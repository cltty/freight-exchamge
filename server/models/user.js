const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
/*
 * Logic for generating uniqueID
 */


const userSchema = new Schema(
    {
        uniqueID: {
            type: String,
            required: false
        },
        emailAddress: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            required: false
        }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;