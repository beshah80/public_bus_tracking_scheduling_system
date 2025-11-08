const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Incident title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Incident description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    type: {
        type: String,
        enum: ['mechanical', 'accident', 'traffic', 'weather', 'passenger', 'security', 'other'],
        required: [true, 'Incident type is required']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: [true, 'Incident severity is required'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['reported', 'investigating', 'in-progress', 'resolved', 'closed'],
        default: 'reported'
    },
    reportedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'driver', 'passenger'],
            required: true
        }
    },
    assignedTo: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        assignedAt: {
            type: Date,
            default: Date.now
        }
    },
    location: {
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Location description cannot exceed 200 characters']
        },
        coordinates: {
            latitude: {
                type: Number,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180
            }
        }
    },
    relatedSchedule: {
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Schedule'
        },
        routeNumber: String,
        busNumber: String
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolution: {
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Resolution description cannot exceed 1000 characters']
        },
        resolvedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String
        },
        resolvedAt: Date,
        actionsTaken: [{
            action: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            performedBy: {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                name: String
            }
        }]
    },
    impact: {
        affectedRoutes: [String],
        estimatedDelay: {
            type: Number, // in minutes
            min: 0
        },
        passengersAffected: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpDate: Date,
    tags: [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
incidentSchema?.index({ type: 1 });
incidentSchema?.index({ severity: 1 });
incidentSchema?.index({ status: 1 });
incidentSchema?.index({ 'reportedBy.userId': 1 });
incidentSchema?.index({ 'assignedTo.userId': 1 });
incidentSchema?.index({ createdAt: -1 });
incidentSchema?.index({ 'location.coordinates': '2dsphere' });

// Virtual for response time
incidentSchema?.virtual('responseTime')?.get(function () {
    if (this.assignedTo?.assignedAt && this.createdAt) {
        return Math.ceil((this.assignedTo?.assignedAt - this.createdAt) / (1000 * 60)); // in minutes
    }
    return null;
});

// Virtual for resolution time
incidentSchema?.virtual('resolutionTime')?.get(function () {
    if (this.resolution?.resolvedAt && this.createdAt) {
        return Math.ceil((this.resolution?.resolvedAt - this.createdAt) / (1000 * 60 * 60)); // in hours
    }
    return null;
});

// Virtual for age
incidentSchema?.virtual('age')?.get(function () {
    return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60)); // in hours
});

// Pre-save middleware to update timestamps
incidentSchema?.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'resolved' && !this.resolution?.resolvedAt) {
        this.resolution.resolvedAt = new Date();
    }
    next();
});

module.exports = mongoose?.model('Incident', incidentSchema);