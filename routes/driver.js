const express = require('express');
const { body, validationResult } = require('express-validator');
const Schedule = require('../models/Schedule');
const Incident = require('../models/Incident');
const { auth, driverOnly } = require('../middleware/auth');

const router = express?.Router();

// Apply driver authentication to all routes
router?.use(auth);
router?.use(driverOnly);

// @route   GET /api/driver/dashboard
// @desc    Get driver dashboard data
// @access  Private (Driver)
router?.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Get driver's schedules for today
        const todaySchedules = await Schedule?.find({
            driverId: req?.user?.id,
            departureTime: { $gte: startOfDay, $lte: endOfDay }
        })?.populate('routeId', 'name routeNumber stops');

        // Get active/current schedule
        const currentSchedule = await Schedule?.findOne({
            driverId: req?.user?.id,
            status: 'in-progress'
        })?.populate('routeId', 'name routeNumber stops');

        // Get driver statistics
        const [completedTrips, totalPassengers, averageRating] = await Promise.all([
            Schedule?.countDocuments({
                driverId: req?.user?.id,
                status: 'completed'
            }),
            Schedule?.aggregate([
                { $match: { driverId: req?.user?.id, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$passengerCount' } } }
            ]),
            // Mock average rating - you can implement a rating system later
            Promise.resolve(4.8)
        ]);

        res?.json({
            success: true,
            data: {
                driver: req?.userDoc,
                todaySchedules,
                currentSchedule,
                stats: {
                    completedTrips,
                    totalPassengers: totalPassengers?.[0]?.total || 0,
                    averageRating,
                    onTimePercentage: await calculateDriverOnTimePercentage(req?.user?.id)
                }
            }
        });

    } catch (error) {
        console.error('Driver dashboard error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

// @route   GET /api/driver/schedules
// @desc    Get driver's schedules
// @access  Private (Driver)
router?.get('/schedules', async (req, res) => {
    try {
        const { date, status } = req?.query;
        const query = { driverId: req?.user?.id };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay?.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay?.setHours(23, 59, 59, 999);

            query.departureTime = { $gte: startOfDay, $lte: endOfDay };
        } else {
            // Default to today if no date specified
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            query.departureTime = { $gte: startOfDay, $lte: endOfDay };
        }

        if (status) {
            query.status = status;
        }

        const schedules = await Schedule?.find(query)?.populate('routeId', 'name routeNumber stops estimatedDuration')?.sort({ departureTime: 1 });

        res?.json({
            success: true,
            data: schedules
        });

    } catch (error) {
        console.error('Get driver schedules error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching schedules'
        });
    }
});

// @route   PUT /api/driver/schedules/:id/start
// @desc    Start a schedule (mark as in-progress)
// @access  Private (Driver)
router?.put('/schedules/:id/start', async (req, res) => {
    try {
        const schedule = await Schedule?.findOne({
            _id: req?.params?.id,
            driverId: req?.user?.id
        });

        if (!schedule) {
            return res?.status(404)?.json({
                success: false,
                message: 'Schedule not found'
            });
        }

        if (schedule?.status !== 'scheduled') {
            return res?.status(400)?.json({
                success: false,
                message: 'Schedule cannot be started. Current status: ' + schedule?.status
            });
        }

        // Check if there's already an active schedule
        const activeSchedule = await Schedule?.findOne({
            driverId: req?.user?.id,
            status: 'in-progress'
        });

        if (activeSchedule) {
            return res?.status(400)?.json({
                success: false,
                message: 'You already have an active schedule in progress'
            });
        }

        schedule.status = 'in-progress';
        schedule.actualDepartureTime = new Date();
        await schedule?.save();

        const populatedSchedule = await Schedule?.findById(schedule?._id)?.populate('routeId', 'name routeNumber stops');

        res?.json({
            success: true,
            data: populatedSchedule,
            message: 'Schedule started successfully'
        });

    } catch (error) {
        console.error('Start schedule error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error starting schedule'
        });
    }
});

// @route   PUT /api/driver/schedules/:id/complete
// @desc    Complete a schedule
// @access  Private (Driver)
router?.put('/schedules/:id/complete', [
    body('passengerCount')?.optional()?.isInt({ min: 0 })?.withMessage('Passenger count must be a non-negative integer'),
    body('notes')?.optional()?.trim()?.isLength({ max: 500 })?.withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const schedule = await Schedule?.findOne({
            _id: req?.params?.id,
            driverId: req?.user?.id
        });

        if (!schedule) {
            return res?.status(404)?.json({
                success: false,
                message: 'Schedule not found'
            });
        }

        if (schedule?.status !== 'in-progress') {
            return res?.status(400)?.json({
                success: false,
                message: 'Schedule is not in progress'
            });
        }

        schedule.status = 'completed';
        schedule.actualArrivalTime = new Date();

        if (req?.body?.passengerCount !== undefined) {
            schedule.passengerCount = req?.body?.passengerCount;
        }

        if (req?.body?.notes) {
            schedule.notes = req?.body?.notes;
        }

        await schedule?.save();

        const populatedSchedule = await Schedule?.findById(schedule?._id)?.populate('routeId', 'name routeNumber');

        res?.json({
            success: true,
            data: populatedSchedule,
            message: 'Schedule completed successfully'
        });

    } catch (error) {
        console.error('Complete schedule error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error completing schedule'
        });
    }
});

// @route   PUT /api/driver/schedules/:id/location
// @desc    Update current location for active schedule
// @access  Private (Driver)
router?.put('/schedules/:id/location', [
    body('latitude')?.isFloat({ min: -90, max: 90 })?.withMessage('Latitude must be between -90 and 90'),
    body('longitude')?.isFloat({ min: -180, max: 180 })?.withMessage('Longitude must be between -180 and 180')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { latitude, longitude } = req?.body;

        const schedule = await Schedule?.findOne({
            _id: req?.params?.id,
            driverId: req?.user?.id,
            status: 'in-progress'
        });

        if (!schedule) {
            return res?.status(404)?.json({
                success: false,
                message: 'Active schedule not found'
            });
        }

        schedule.currentLocation = {
            latitude,
            longitude,
            lastUpdated: new Date()
        };

        await schedule?.save();

        res?.json({
            success: true,
            message: 'Location updated successfully'
        });

    } catch (error) {
        console.error('Update location error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error updating location'
        });
    }
});

// @route   POST /api/driver/incidents
// @desc    Report an incident
// @access  Private (Driver)
router?.post('/incidents', [
    body('title')?.trim()?.isLength({ min: 5, max: 100 })?.withMessage('Title must be between 5 and 100 characters'),
    body('description')?.trim()?.isLength({ min: 10, max: 1000 })?.withMessage('Description must be between 10 and 1000 characters'),
    body('type')?.isIn(['mechanical', 'accident', 'traffic', 'weather', 'passenger', 'security', 'other'])?.withMessage('Invalid incident type'),
    body('severity')?.isIn(['low', 'medium', 'high', 'critical'])?.withMessage('Invalid severity level'),
    body('location.description')?.optional()?.trim()?.isLength({ max: 200 })?.withMessage('Location description cannot exceed 200 characters'),
    body('location.coordinates.latitude')?.optional()?.isFloat({ min: -90, max: 90 })?.withMessage('Invalid latitude'),
    body('location.coordinates.longitude')?.optional()?.isFloat({ min: -180, max: 180 })?.withMessage('Invalid longitude')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { title, description, type, severity, location } = req?.body;

        // Get current schedule if any
        const currentSchedule = await Schedule?.findOne({
            driverId: req?.user?.id,
            status: 'in-progress'
        })?.populate('routeId', 'routeNumber');

        const incident = new Incident({
            title,
            description,
            type,
            severity,
            reportedBy: {
                userId: req.user.id,
                name: req.userDoc.name,
                role: req.user.role
            },
            location,
            relatedSchedule: currentSchedule ? {
                scheduleId: currentSchedule._id,
                routeNumber: currentSchedule.routeId.routeNumber,
                busNumber: req.userDoc.busNumber
            } : undefined
        });

        await incident?.save();

        res?.status(201)?.json({
            success: true,
            data: incident,
            message: 'Incident reported successfully'
        });

    } catch (error) {
        console.error('Report incident error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error reporting incident'
        });
    }
});

// @route   GET /api/driver/incidents
// @desc    Get driver's reported incidents
// @access  Private (Driver)
router?.get('/incidents', async (req, res) => {
    try {
        const incidents = await Incident?.find({
            'reportedBy.userId': req?.user?.id
        })?.sort({ createdAt: -1 });

        res?.json({
            success: true,
            data: incidents
        });

    } catch (error) {
        console.error('Get driver incidents error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching incidents'
        });
    }
});

// Helper function to calculate driver's on-time percentage
async function calculateDriverOnTimePercentage(driverId) {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [total, onTime] = await Promise.all([
            Schedule?.countDocuments({
                driverId,
                status: 'completed',
                actualDepartureTime: { $exists: true },
                createdAt: { $gte: thirtyDaysAgo }
            }),
            Schedule?.countDocuments({
                driverId,
                status: 'completed',
                actualDepartureTime: { $exists: true },
                createdAt: { $gte: thirtyDaysAgo },
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
        console.error('Calculate driver on-time percentage error:', error);
        return 0;
    }
}

module.exports = router;