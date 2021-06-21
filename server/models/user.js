const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const userSchema = new Schema(
    {
        emailAddress: {
            type: String,
            required: true,
            unique : true
        },
        password: {
            type: String,
            required: true
        },
        companyProfileCreated: {
            type: Boolean,
            required: true
        },
        companyType: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;