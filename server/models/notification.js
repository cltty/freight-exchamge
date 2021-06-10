const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        read: {
            type: String,
            require: true
        },
        for: {
            userId: {
                type: String,
                require: true
            },
            companyLegalName: {
                type: String,
                require: true
            },
            companyEmailAddress: {
                type: String,
                require: true
            },
            companyPhoneNumber: {
                type: String,
                require: true
            },
        },
        from: {
            userId: {
                type: String,
                require: true
            },
            companyLegalName: {
                type: String,
                require: true
            },
            companyEmailAddress: {
                type: String,
                require: true
            },
            companyPhoneNumber: {
                type: String,
                require: true
            },
        },
        message: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
