const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const driverRoutes = require('./routes/driver');
const passengerRoutes = require('./routes/passenger');

// Load environment variables
dotenv?.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app?.use(helmet());
app?.use(morgan('combined'));
app?.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app?.use(express?.json({ limit: '10mb' }));
app?.use(express?.urlencoded({ extended: true }));

// MongoDB Connection
mongoose?.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})?.then(() => {
    console.log('Connected to MongoDB Atlas');
})?.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Routes
app?.use('/api/auth', authRoutes);
app?.use('/api/admin', adminRoutes);
app?.use('/api/driver', driverRoutes);
app?.use('/api/passenger', passengerRoutes);

// Health check endpoint
app?.get('/api/health', (req, res) => {
    res?.status(200)?.json({
        status: 'OK',
        message: 'EthioBus API is running',
        timestamp: new Date()?.toISOString()
    });
});

// Error handling middleware
app?.use((error, req, res, next) => {
    console.error('Error:', error);
    res?.status(error?.status || 500)?.json({
        error: {
            message: error?.message || 'Internal Server Error',
            status: error?.status || 500
        }
    });
});

// 404 handler
app?.use('*', (req, res) => {
    res?.status(404)?.json({
        error: {
            message: 'Endpoint not found',
            status: 404
        }
    });
});

app?.listen(PORT, () => {
    console.log(`EthioBus API server running on port ${PORT}`);
});

module.exports = app;