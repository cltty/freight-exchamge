const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
    {
        reason: {
            type: String,
            required: true
        },
        reasonSummary: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        reportedBy: {
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
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;