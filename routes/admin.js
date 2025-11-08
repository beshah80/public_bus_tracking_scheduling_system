const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Route = require('../models/Route');
const Incident = require('../models/Incident');
const { auth, adminOnly } = require('../middleware/auth');

const router = express?.Router();

// Apply admin authentication to all routes
router?.use(auth);
router?.use(adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router?.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Get dashboard metrics
        const [
            totalDrivers,
            activeRoutes,
            todaySchedules,
            openIncidents,
            recentIncidents,
            systemMetrics
        ] = await Promise.all([
            User?.countDocuments({ role: 'driver', isActive: true }),
            Route?.countDocuments({ isActive: true }),
            Schedule?.countDocuments({
                departureTime: { $gte: startOfDay, $lte: endOfDay }
            }),
            Incident?.countDocuments({ status: { $nin: ['resolved', 'closed'] } }),
            Incident?.find({ status: { $nin: ['resolved', 'closed'] } })?.sort({ createdAt: -1 })?.limit(5)?.populate('reportedBy.userId', 'name')?.populate('assignedTo.userId', 'name'),
            {
                onTimePerformance: await calculateOnTimePerformance(),
                averageDelay: await calculateAverageDelay(),
                totalPassengers: await calculateTotalPassengers()
            }
        ]);

        res?.json({
            success: true,
            data: {
                metrics: {
                    totalDrivers,
                    activeRoutes,
                    todaySchedules,
                    openIncidents,
                    onTimePerformance: systemMetrics?.onTimePerformance,
                    averageDelay: systemMetrics?.averageDelay,
                    totalPassengers: systemMetrics?.totalPassengers
                },
                recentIncidents
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

// @route   GET /api/admin/drivers
// @desc    Get all drivers with filtering and pagination
// @access  Private (Admin)
router?.get('/drivers', [
    query('page')?.optional()?.isInt({ min: 1 })?.withMessage('Page must be a positive integer'),
    query('limit')?.optional()?.isInt({ min: 1, max: 100 })?.withMessage('Limit must be between 1 and 100'),
    query('search')?.optional()?.trim(),
    query('status')?.optional()?.isIn(['active', 'inactive'])?.withMessage('Invalid status filter')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 10;
        const skip = (page - 1) * limit;
        const { search, status } = req?.query;

        // Build query
        const query = { role: 'driver' };

        if (status) {
            query.isActive = status === 'active';
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { busNumber: { $regex: search, $options: 'i' } },
                { licenseNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const [drivers, total] = await Promise.all([
            User?.find(query)?.sort({ createdAt: -1 })?.skip(skip)?.limit(limit),
            User?.countDocuments(query)
        ]);

        res?.json({
            success: true,
            data: {
                drivers,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get drivers error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching drivers'
        });
    }
});

// @route   PUT /api/admin/drivers/:id
// @desc    Update driver information
// @access  Private (Admin)
router?.put('/drivers/:id', [
    body('name')?.optional()?.trim()?.isLength({ min: 2, max: 100 }),
    body('phoneNumber')?.optional()?.isMobilePhone(),
    body('busNumber')?.optional()?.trim()?.isLength({ min: 1, max: 20 }),
    body('routeAssignment')?.optional()?.trim()?.isLength({ min: 1, max: 200 }),
    body('licenseNumber')?.optional()?.trim()?.isLength({ min: 1, max: 50 }),
    body('isActive')?.optional()?.isBoolean()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const driver = await User?.findOne({ _id: req?.params?.id, role: 'driver' });
        if (!driver) {
            return res?.status(404)?.json({
                success: false,
                message: 'Driver not found'
            });
        }

        // Update fields
        const allowedUpdates = ['name', 'phoneNumber', 'busNumber', 'routeAssignment', 'licenseNumber', 'isActive'];
        allowedUpdates?.forEach(field => {
            if (req?.body?.[field] !== undefined) {
                driver[field] = req?.body?.[field];
            }
        });

        await driver?.save();

        res?.json({
            success: true,
            data: driver?.toJSON(),
            message: 'Driver updated successfully'
        });

    } catch (error) {
        console.error('Update driver error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error updating driver'
        });
    }
});

// @route   GET /api/admin/schedules
// @desc    Get all schedules with filtering
// @access  Private (Admin)
router?.get('/schedules', [
    query('date')?.optional()?.isISO8601()?.withMessage('Invalid date format'),
    query('status')?.optional()?.isIn(['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed']),
    query('routeId')?.optional()?.isMongoId()?.withMessage('Invalid route ID')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { date, status, routeId } = req?.query;
        const query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay?.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay?.setHours(23, 59, 59, 999);

            query.departureTime = { $gte: startOfDay, $lte: endOfDay };
        }

        if (status) {
            query.status = status;
        }

        if (routeId) {
            query.routeId = routeId;
        }

        const schedules = await Schedule?.find(query)?.populate('routeId', 'name routeNumber')?.populate('driverId', 'name busNumber')?.sort({ departureTime: 1 });

        res?.json({
            success: true,
            data: schedules
        });

    } catch (error) {
        console.error('Get schedules error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching schedules'
        });
    }
});

// @route   GET /api/admin/incidents
// @desc    Get all incidents with filtering
// @access  Private (Admin)
router?.get('/incidents', [
    query('status')?.optional()?.isIn(['reported', 'investigating', 'in-progress', 'resolved', 'closed']),
    query('severity')?.optional()?.isIn(['low', 'medium', 'high', 'critical']),
    query('type')?.optional()?.isIn(['mechanical', 'accident', 'traffic', 'weather', 'passenger', 'security', 'other'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { status, severity, type } = req?.query;
        const query = {};

        if (status) query.status = status;
        if (severity) query.severity = severity;
        if (type) query.type = type;

        const incidents = await Incident?.find(query)?.populate('reportedBy.userId', 'name')?.populate('assignedTo.userId', 'name')?.sort({ createdAt: -1 });

        res?.json({
            success: true,
            data: incidents
        });

    } catch (error) {
        console.error('Get incidents error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching incidents'
        });
    }
});

// Helper functions
async function calculateOnTimePerformance() {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [total, onTime] = await Promise.all([
            Schedule?.countDocuments({
                status: 'completed',
                actualDepartureTime: { $exists: true },
                createdAt: { $gte: sevenDaysAgo }
            }),
            Schedule?.countDocuments({
                status: 'completed',
                actualDepartureTime: { $exists: true },
                createdAt: { $gte: sevenDaysAgo },
                $expr: {
                    $lte: [
                        { $subtract: ['$actualDepartureTime', '$departureTime'] },
                        5 * 60 * 1000 // 5 minutes tolerance
                    ]
                }
            })
        ]);

        return total > 0 ? Math.round((onTime / total) * 100) : 100;
    } catch (error) {
        console.error('Calculate on-time performance error:', error);
        return 0;
    }
}

async function calculateAverageDelay() {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const result = await Schedule?.aggregate([
            {
                $match: {
                    status: 'completed',
                    actualDepartureTime: { $exists: true },
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $project: {
                    delay: {
                        $max: [
                            0,
                            { $divide: [{ $subtract: ['$actualDepartureTime', '$departureTime'] }, 60000] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    averageDelay: { $avg: '$delay' }
                }
            }
        ]);

        return result?.length > 0 ? Math.round(result?.[0]?.averageDelay) : 0;
    } catch (error) {
        console.error('Calculate average delay error:', error);
        return 0;
    }
}

async function calculateTotalPassengers() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        const result = await Schedule?.aggregate([
            {
                $match: {
                    departureTime: { $gte: startOfDay },
                    passengerCount: { $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPassengers: { $sum: '$passengerCount' }
                }
            }
        ]);

        return result?.length > 0 ? result?.[0]?.totalPassengers : 0;
    } catch (error) {
        console.error('Calculate total passengers error:', error);
        return 0;
    }
}

module.exports = router;