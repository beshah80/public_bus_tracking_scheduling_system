const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Incident = require('../models/Incident');
const bcrypt = require('bcryptjs');

async function calculateOnTimePerformance() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [total, onTime] = await Promise.all([
      Schedule.countDocuments({
        status: 'completed',
        actualDepartureTime: { $exists: true },
        createdAt: { $gte: sevenDaysAgo },
      }),
      Schedule.countDocuments({
        status: 'completed',
        actualDepartureTime: { $exists: true },
        createdAt: { $gte: sevenDaysAgo },
        $expr: {
          $lte: [
            { $subtract: ['$actualDepartureTime', '$departureTime'] },
            5 * 60 * 1000,
          ],
        },
      }),
    ]);

    return total > 0 ? Math.round((onTime / total) * 100) : 100;
  } catch (e) {
    return 0;
  }
}

async function calculateAverageDelay() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await Schedule.aggregate([
      { $match: { status: 'completed', actualDepartureTime: { $exists: true }, createdAt: { $gte: sevenDaysAgo } } },
      { $project: { delay: { $max: [0, { $divide: [{ $subtract: ['$actualDepartureTime', '$departureTime'] }, 60000] }] } } },
      { $group: { _id: null, averageDelay: { $avg: '$delay' } } },
    ]);

    return result?.length > 0 ? Math.round(result[0].averageDelay) : 0;
  } catch (e) {
    return 0;
  }
}

async function calculateTotalPassengers() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const result = await Schedule.aggregate([
      { $match: { departureTime: { $gte: startOfDay }, passengerCount: { $exists: true } } },
      { $group: { _id: null, totalPassengers: { $sum: '$passengerCount' } } },
    ]);

    return result?.length > 0 ? result[0].totalPassengers : 0;
  } catch (e) {
    return 0;
  }
}

const resolvers = {
  Query: {
    health: () => 'OK',
    me: async (_, __, ctx) => {
      if (!ctx.userId) return null;
      const user = await User.findById(ctx.userId);
      return user ? mapUser(user) : null;
    },
    drivers: async (_, { filter }) => {
      const page = parseInt(filter?.page) || 1;
      const limit = parseInt(filter?.limit) || 10;
      const skip = (page - 1) * limit;
      const { search, status } = filter || {};

      const q = { role: 'driver' };
      if (status) q.isActive = status === 'active';
      if (search) {
        q.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { busNumber: { $regex: search, $options: 'i' } },
          { licenseNumber: { $regex: search, $options: 'i' } },
        ];
      }

      const [items, total] = await Promise.all([
        User.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(q),
      ]);

      return {
        items: items.map(mapUser),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    },
    routes: async () => {
      const routes = await Route.find({});
      return routes.map(mapRoute);
    },
    route: async (_, { id }) => {
      const r = await Route.findById(id);
      return r ? mapRoute(r) : null;
    },
    adminDashboard: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const [totalDrivers, activeRoutes, todaySchedules, openIncidents, recentIncidents] = await Promise.all([
        User.countDocuments({ role: 'driver', isActive: true }),
        Route.countDocuments({ isActive: true }),
        Schedule.countDocuments({ departureTime: { $gte: startOfDay, $lte: endOfDay } }),
        Incident.countDocuments({ status: { $nin: ['resolved', 'closed'] } }),
        Incident.find({ status: { $nin: ['resolved', 'closed'] } }).sort({ createdAt: -1 }).limit(5),
      ]);

      return {
        metrics: {
          totalDrivers,
          activeRoutes,
          todaySchedules,
          openIncidents,
          onTimePerformance: await calculateOnTimePerformance(),
          averageDelay: await calculateAverageDelay(),
          totalPassengers: await calculateTotalPassengers(),
        },
        recentIncidents: recentIncidents.map(mapIncident),
      };
    },
  },
  Mutation: {
    login: async (_, { email, password, role }) => {
      const user = await User.findOne({ email }).select('+password');
      if (!user || user.role !== role || !user.isActive) {
        throw new Error('Invalid credentials');
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error('Invalid credentials');

      user.lastLogin = new Date();
      await user.save();

      const payload = { user: { id: user._id.toString(), email: user.email, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });
      return { token, user: mapUser(user) };
    },
    updateDriver: async (_, args, ctx) => {
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new Error('Access denied');
      }
      const { id, ...updates } = args;
      const allowed = ['name', 'phoneNumber', 'busNumber', 'routeAssignment', 'licenseNumber', 'isActive'];
      const safe = Object.fromEntries(Object.entries(updates).filter(([k, v]) => allowed.includes(k) && v !== undefined));
      const doc = await User.findOne({ _id: id, role: 'driver' });
      if (!doc) throw new Error('Driver not found');
      Object.assign(doc, safe);
      await doc.save();
      return mapUser(doc);
    },
  },
};

function mapUser(u) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    busNumber: u.busNumber || null,
    routeAssignment: u.routeAssignment || null,
    licenseNumber: u.licenseNumber || null,
    phoneNumber: u.phoneNumber || null,
    isActive: !!u.isActive,
    lastLogin: u.lastLogin ? u.lastLogin.toISOString() : null,
    profileImage: u.profileImage || null,
    createdAt: u.createdAt ? u.createdAt.toISOString() : null,
    updatedAt: u.updatedAt ? u.updatedAt.toISOString() : null,
  };
}

function mapRoute(r) {
  return {
    id: r._id.toString(),
    name: r.name,
    routeNumber: r.routeNumber,
    description: r.description || null,
    stops: (r.stops || []).map((s) => ({
      name: s.name,
      coordinates: { latitude: s.coordinates?.latitude, longitude: s.coordinates?.longitude },
      estimatedTime: s.estimatedTime,
      order: s.order,
    })),
    totalDistance: r.totalDistance,
    estimatedDuration: r.estimatedDuration,
    fare: r.fare,
    isActive: !!r.isActive,
    operatingHours: r.operatingHours || null,
    frequency: r.frequency,
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
  };
}

function mapIncident(i) {
  return {
    id: i._id.toString(),
    type: i.type,
    status: i.status,
    severity: i.severity,
    description: i.description || null,
    reportedBy: i.reportedBy || null,
    assignedTo: i.assignedTo || null,
    createdAt: i.createdAt ? i.createdAt.toISOString() : null,
    updatedAt: i.updatedAt ? i.updatedAt.toISOString() : null,
  };
}

module.exports = { resolvers };
