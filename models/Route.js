const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    estimatedTime: {
        type: Number, // minutes from start
        required: true,
        min: 0
    },
    order: {
        type: Number,
        required: true,
        min: 1
    }
});

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Route name is required'],
        trim: true,
        unique: true
    },
    routeNumber: {
        type: String,
        required: [true, 'Route number is required'],
        trim: true,
        unique: true,
        uppercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    stops: [stopSchema],
    totalDistance: {
        type: Number, // in kilometers
        required: true,
        min: 0
    },
    estimatedDuration: {
        type: Number, // in minutes
        required: true,
        min: 0
    },
    fare: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    operatingHours: {
        start: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
        },
        end: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
        }
    },
    frequency: {
        type: Number, // minutes between buses
        required: true,
        min: 5,
        max: 120
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
routeSchema?.index({ routeNumber: 1 });
routeSchema?.index({ isActive: 1 });
routeSchema?.index({ 'stops.coordinates': '2dsphere' });

// Virtual for stop count
routeSchema?.virtual('stopCount')?.get(function () {
    return this.stops?.length;
});

// Virtual for route status
routeSchema?.virtual('status')?.get(function () {
    return this.isActive ? 'Active' : 'Inactive';
});

module.exports = mongoose?.model('Route', routeSchema);