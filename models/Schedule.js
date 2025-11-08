const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: [true, 'Route is required']
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Driver is required']
    },
    busNumber: {
        type: String,
        required: [true, 'Bus number is required'],
        trim: true,
        uppercase: true
    },
    departureTime: {
        type: Date,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Arrival time is required']
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed'],
        default: 'scheduled'
    },
    actualDepartureTime: {
        type: Date
    },
    actualArrivalTime: {
        type: Date
    },
    delayReason: {
        type: String,
        trim: true,
        maxlength: [200, 'Delay reason cannot exceed 200 characters']
    },
    passengerCount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxCapacity: {
        type: Number,
        required: true,
        default: 50,
        min: 1
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    currentLocation: {
        latitude: {
            type: Number,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            min: -180,
            max: 180
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    completedStops: [{
        stopId: {
            type: String,
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },
        passengersBoardingCount: {
            type: Number,
            default: 0,
            min: 0
        },
        passengersAlightingCount: {
            type: Number,
            default: 0,
            min: 0
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
scheduleSchema?.index({ routeId: 1 });
scheduleSchema?.index({ driverId: 1 });
scheduleSchema?.index({ busNumber: 1 });
scheduleSchema?.index({ departureTime: 1 });
scheduleSchema?.index({ status: 1 });
scheduleSchema?.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });

// Virtual for schedule duration
scheduleSchema?.virtual('scheduledDuration')?.get(function () {
    if (this.departureTime && this.arrivalTime) {
        return Math.ceil((this.arrivalTime - this.departureTime) / (1000 * 60)); // in minutes
    }
    return 0;
});

// Virtual for actual duration
scheduleSchema?.virtual('actualDuration')?.get(function () {
    if (this.actualDepartureTime && this.actualArrivalTime) {
        return Math.ceil((this.actualArrivalTime - this.actualDepartureTime) / (1000 * 60)); // in minutes
    }
    return 0;
});

// Virtual for occupancy percentage
scheduleSchema?.virtual('occupancyRate')?.get(function () {
    return Math.round((this.passengerCount / this.maxCapacity) * 100);
});

// Virtual for delay in minutes
scheduleSchema?.virtual('delayMinutes')?.get(function () {
    if (this.actualDepartureTime && this.departureTime) {
        const delay = Math.ceil((this.actualDepartureTime - this.departureTime) / (1000 * 60));
        return delay > 0 ? delay : 0;
    }
    return 0;
});

// Pre-save middleware to validate times
scheduleSchema?.pre('save', function (next) {
    if (this.departureTime >= this.arrivalTime) {
        return next(new Error('Arrival time must be after departure time'));
    }

    if (this.actualDepartureTime && this.actualArrivalTime && this.actualDepartureTime >= this.actualArrivalTime) {
        return next(new Error('Actual arrival time must be after actual departure time'));
    }

    next();
});

module.exports = mongoose?.model('Schedule', scheduleSchema);