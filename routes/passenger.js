const express = require('express');
const { query, validationResult } = require('express-validator');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

const router = express?.Router();

// @route   GET /api/passenger/routes
// @desc    Get all active routes
// @access  Public
router?.get('/routes', async (req, res) => {
    try {
        const routes = await Route?.find({ isActive: true })?.select('name routeNumber description stops totalDistance estimatedDuration fare operatingHours frequency')?.sort({ routeNumber: 1 });

        res?.json({
            success: true,
            data: routes
        });

    } catch (error) {
        console.error('Get routes error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching routes'
        });
    }
});

// @route   GET /api/passenger/routes/search
// @desc    Search routes by origin and destination
// @access  Public
router?.get('/routes/search', [
    query('from')?.trim()?.isLength({ min: 2 })?.withMessage('Origin must be at least 2 characters'),
    query('to')?.trim()?.isLength({ min: 2 })?.withMessage('Destination must be at least 2 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { from, to } = req?.query;

        // Search for routes that contain both origin and destination stops
        const routes = await Route?.find({
            isActive: true,
            $and: [
                { 'stops.name': { $regex: from, $options: 'i' } },
                { 'stops.name': { $regex: to, $options: 'i' } }
            ]
        });

        // Filter routes where origin comes before destination
        const validRoutes = routes?.filter(route => {
            const fromIndex = route?.stops?.findIndex(stop =>
                stop?.name?.toLowerCase()?.includes(from.toLowerCase())
            );
            const toIndex = route?.stops?.findIndex(stop =>
                stop?.name?.toLowerCase()?.includes(to?.toLowerCase())
            );

            return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
        });

        // Calculate segment fare and duration for each route
        const routesWithSegmentInfo = validRoutes?.map(route => {
            const fromIndex = route?.stops?.findIndex(stop =>
                stop?.name?.toLowerCase()?.includes(from.toLowerCase())
            );
            const toIndex = route?.stops?.findIndex(stop =>
                stop?.name?.toLowerCase()?.includes(to?.toLowerCase())
            );

            const fromStop = route?.stops?.[fromIndex];
            const toStop = route?.stops?.[toIndex];

            // Calculate proportional fare based on stops
            const totalStops = route?.stops?.length;
            const segmentStops = toIndex - fromIndex;
            const segmentFare = Math.round((route?.fare * segmentStops) / totalStops);

            // Calculate segment duration
            const segmentDuration = toStop?.estimatedTime - fromStop?.estimatedTime;

            return {
                ...route?._doc,
                segmentInfo: {
                    fromStop: fromStop?.name,
                    toStop: toStop?.name,
                    duration: segmentDuration,
                    fare: segmentFare,
                    stopCount: segmentStops
                }
            };
        });

        res?.json({
            success: true,
            data: routesWithSegmentInfo,
            searchParams: { from, to }
        });

    } catch (error) {
        console.error('Search routes error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error searching routes'
        });
    }
});

// @route   GET /api/passenger/routes/:id
// @desc    Get specific route details
// @access  Public
router?.get('/routes/:id', async (req, res) => {
    try {
        const route = await Route?.findOne({
            _id: req?.params?.id,
            isActive: true
        });

        if (!route) {
            return res?.status(404)?.json({
                success: false,
                message: 'Route not found'
            });
        }

        res?.json({
            success: true,
            data: route
        });

    } catch (error) {
        console.error('Get route error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching route details'
        });
    }
});

// @route   GET /api/passenger/schedules
// @desc    Get schedules for a specific route and date
// @access  Public
router?.get('/schedules', [
    query('routeId')?.isMongoId()?.withMessage('Invalid route ID'),
    query('date')?.optional()?.isISO8601()?.withMessage('Invalid date format')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors?.isEmpty()) {
            return res?.status(400)?.json({
                success: false,
                errors: errors?.array()
            });
        }

        const { routeId, date } = req?.query;

        // Use provided date or default to today
        const queryDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        const schedules = await Schedule?.find({
            routeId,
            departureTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['scheduled', 'in-progress'] }
        })?.populate('driverId', 'name')?.populate('routeId', 'name routeNumber')?.sort({ departureTime: 1 });

        // Add availability status for each schedule
        const schedulesWithAvailability = schedules?.map(schedule => ({
            ...schedule?._doc,
            availableSeats: schedule?.maxCapacity - schedule?.passengerCount,
            availabilityStatus: getAvailabilityStatus(schedule?.passengerCount, schedule?.maxCapacity)
        }));

        res?.json({
            success: true,
            data: schedulesWithAvailability,
            date: queryDate?.toISOString()?.split('T')?.[0]
        });

    } catch (error) {
        console.error('Get schedules error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching schedules'
        });
    }
});

// @route   GET /api/passenger/schedules/:id/tracking
// @desc    Get real-time tracking info for a schedule
// @access  Public
router?.get('/schedules/:id/tracking', async (req, res) => {
    try {
        const schedule = await Schedule?.findOne({
            _id: req?.params?.id,
            status: 'in-progress'
        })?.populate('routeId', 'name routeNumber stops')?.populate('driverId', 'name busNumber');

        if (!schedule) {
            return res?.status(404)?.json({
                success: false,
                message: 'Active schedule not found'
            });
        }

        // Calculate estimated arrival times for remaining stops
        const currentTime = new Date();
        const route = schedule?.routeId;
        const estimatedArrivals = route?.stops?.map(stop => {
            const baseTime = schedule?.departureTime?.getTime();
            const estimatedTime = new Date(baseTime + (stop.estimatedTime * 60 * 1000));

            return {
                stopName: stop?.name,
                coordinates: stop?.coordinates,
                estimatedArrival: estimatedTime,
                isPassed: stop?.order <= (schedule?.completedStops?.length + 1)
            };
        });

        res?.json({
            success: true,
            data: {
                schedule: {
                    id: schedule?._id,
                    routeName: route?.name,
                    routeNumber: route?.routeNumber,
                    driverName: schedule?.driverId?.name,
                    busNumber: schedule?.driverId?.busNumber,
                    status: schedule?.status,
                    departureTime: schedule?.departureTime,
                    estimatedArrival: schedule?.arrivalTime
                },
                currentLocation: schedule?.currentLocation,
                estimatedArrivals,
                completedStops: schedule?.completedStops,
                lastUpdated: schedule?.currentLocation?.lastUpdated || schedule?.updatedAt
            }
        });

    } catch (error) {
        console.error('Get tracking error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching tracking information'
        });
    }
});

// @route   GET /api/passenger/announcements
// @desc    Get public announcements
// @access  Public
router?.get('/announcements', async (req, res) => {
    try {
        // Mock announcements - you can create an Announcement model later
        const announcements = [
            {
                id: '1',
                title: 'Service Update',
                message: 'Route 1 - Central to Airport will have extended service hours during the holiday season.',
                type: 'info',
                priority: 'medium',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                isActive: true
            },
            {
                id: '2',
                title: 'Traffic Advisory',
                message: 'Heavy traffic expected on main routes due to road construction. Please plan accordingly.',
                type: 'warning',
                priority: 'high',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                isActive: true
            },
            {
                id: '3',
                title: 'New Mobile App',
                message: 'Download our new mobile app for better route planning and real-time updates!',
                type: 'success',
                priority: 'low',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                isActive: true
            }
        ];

        // Filter active announcements that haven't expired
        const activeAnnouncements = announcements?.filter(announcement =>
            announcement?.isActive && announcement?.expiresAt > new Date()
        );

        res?.json({
            success: true,
            data: activeAnnouncements
        });

    } catch (error) {
        console.error('Get announcements error:', error);
        res?.status(500)?.json({
            success: false,
            message: 'Error fetching announcements'
        });
    }
});

// Helper function to determine availability status
function getAvailabilityStatus(passengerCount, maxCapacity) {
    const occupancyRate = (passengerCount / maxCapacity) * 100;

    if (occupancyRate >= 100) {
        return 'full';
    } else if (occupancyRate >= 80) {
        return 'limited';
    } else if (occupancyRate >= 50) {
        return 'moderate';
    } else {
        return 'available';
    }
}

module.exports = router;