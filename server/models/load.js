const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const loadSchema = new Schema(
    {
        cancelled: {
            type: Boolean,
            required: true
        },
        rejected: {
            type: Boolean,
            required: true
        },
        shipperDetails: {
            shipperId: {
                type: String,
                required: true
            },
            shipperName: {
                type: String,
                required: true
            },
            shipperPhoneNumber: {
                type: String,
                required: true
            },
            shipperEmailAddress: {
                type: String,
                required: true
            },
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        booked: {
            isBooked: {
                type: Boolean,
                required: true
            },
            carrierId: {
                type: String,
                required: false
            },
            carrierCompanyLegalName: {
                type: String,
                required: false
            },
            carrierEmailAddress: {
                type: String,
                required: false
            },
            carrierPhoneNumber: {
                type: String,
                required: false
            },
        },
        origin: {
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            arrival: {
                type: String,
                required: true
            }
        },
        destination: {
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            arrival: {
                type: String,
                required: true
            }
        },
        distance: {
            type: String,
            required: true
        },
        equipment: {
            equipment: {
                type: String,
                required: true
            },
            isRequired: {
                type: Boolean,
                required: true
            }
        },
        payout: {
            type: Number,
            required: true
        }
    }
);

const Load = mongoose.model('Load', loadSchema);
module.exports = Load;