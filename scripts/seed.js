require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env');

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Admin user
    const adminEmail = 'admin@ethiobus.gov.et';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
        isActive: true,
      });
      console.log('Created admin user:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    // Driver user
    const driverEmail = 'driver@ethiobus.gov.et';
    const driver = await User.findOne({ email: driverEmail });
    if (!driver) {
      await User.create({
        name: 'Demo Driver',
        email: driverEmail,
        password: 'password123',
        role: 'driver',
        isActive: true,
        busNumber: 'BUS-101',
        routeAssignment: 'R-01 Addis Center',
        licenseNumber: 'DR-ET-0001',
      });
      console.log('Created driver user:', driverEmail);
    } else {
      console.log('Driver user already exists:', driverEmail);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  }
}

run();
