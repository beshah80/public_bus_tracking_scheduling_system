const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router?.post('/login', [
    body('email')?.isEmail()?.normalizeEmail()?.withMessage('Please provide a valid email'),
    body('password')?.exists()?.withMessage('Password is required'),
    body('role')?.isIn(['admin', 'driver'])?.withMessage('Invalid role specified')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { email, password, role } = req?.body;

        // Check if user exists
        const user = await User?.findOne({ email })?.select('+password');
        if (!user) {
            return res?.status(401)?.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user role matches
        if (user?.role !== role) {
            return res?.status(401)?.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user?.isActive) {
            return res?.status(401)?.json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Validate password
        const isPasswordValid = await user?.comparePassword(password);
        if (!isPasswordValid) {
            return res?.status(401)?.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user?.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user?._id,
                email: user?.email,
                role: user?.role
            }
        };

        const token = jwt?.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '24h'
        });

        // Remove password from response
        const userResponse = user?.toJSON();

        res?.json({
            success: true,
            token,
            user: userResponse,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/register
// @desc    Register new user (admin only)
// @access  Private (Admin)
router.post(
  '/register',
  auth,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'driver', 'passenger']).withMessage('Invalid role specified'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  async (req, res) => {
    try {
        // Check if requesting user is admin
        if (req?.user?.role !== 'admin') {
            return res?.status(403)?.json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { name, email, password, role, phoneNumber, busNumber, routeAssignment, licenseNumber } = req?.body;

        // Check if user already exists
        const existingUser = await User?.findOne({ email });
        if (existingUser) {
            return res?.status(400)?.json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user object
        const userData = {
            name,
            email,
            password,
            role,
            phoneNumber
        };

        // Add driver-specific fields if role is driver
        if (role === 'driver') {
            if (!busNumber || !routeAssignment || !licenseNumber) {
                return res?.status(400)?.json({
                    success: false,
                    message: 'Bus number, route assignment, and license number are required for drivers'
                });
            }
            userData.busNumber = busNumber;
            userData.routeAssignment = routeAssignment;
            userData.licenseNumber = licenseNumber;
        }

        // Create user
        const user = new User(userData);
        await user?.save();

        res?.status(201)?.json({
            success: true,
            user: user?.toJSON(),
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error?.code === 11000) {
            return res?.status(400)?.json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        res?.status(500)?.json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router?.get('/me', auth, async (req, res) => {
    try {
        const user = await User?.findById(req?.user?.id);
        if (!user) {
            return res?.status(404)?.json({
                success: false,
                message: 'User not found'
            });
        }

        res?.json({
            success: true,
            user: user?.toJSON()
        });

    } catch (error) {
        console.error('Get user error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router?.post('/logout', auth, (req, res) => {
    res?.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router?.put('/profile', [
    auth,
    body('name')?.optional()?.trim()?.isLength({ min: 2, max: 100 })?.withMessage('Name must be between 2 and 100 characters'),
    body('phoneNumber')?.optional()?.isMobilePhone()?.withMessage('Please provide a valid phone number')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { name, phoneNumber } = req?.body;
        const user = await User?.findById(req?.user?.id);

        if (!user) {
            return res?.status(404)?.json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user?.save();

        res?.json({
            success: true,
            user: user?.toJSON(),
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Server error during profile update'
        });
    }
});

module.exports = router;