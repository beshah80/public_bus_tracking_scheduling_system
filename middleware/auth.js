const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req?.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res?.status(401)?.json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt?.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User?.findById(decoded?.user?.id);
        if (!user || !user?.isActive) {
            return res?.status(401)?.json({
                success: false,
                message: 'Token is no longer valid'
            });
        }

        // Add user to request object
        req.user = decoded?.user;
        req.userDoc = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error?.name === 'JsonWebTokenError') {
            return res?.status(401)?.json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error?.name === 'TokenExpiredError') {
            return res?.status(401)?.json({
                success: false,
                message: 'Token expired'
            });
        }

        res?.status(500)?.json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req?.user) {
            return res?.status(401)?.json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles?.includes(req?.user?.role)) {
            return res?.status(403)?.json({
                success: false,
                message: `Access denied. Required roles: ${roles?.join(', ')}`
            });
        }

        next();
    };
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (!req?.user || req?.user?.role !== 'admin') {
        return res?.status(403)?.json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Driver only middleware
const driverOnly = (req, res, next) => {
    if (!req?.user || req?.user?.role !== 'driver') {
        return res?.status(403)?.json({
            success: false,
            message: 'Access denied. Driver privileges required.'
        });
    }
    next();
};

module.exports = {
    auth,
    authorize,
    adminOnly,
    driverOnly
};