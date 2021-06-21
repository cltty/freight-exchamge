const express = require('express');
const router = express.Router();

module.exports = router;

const dotenv = require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/', (req, res) => {
    client.messages
    .create({
        body: req.body.message,
        from: '+15622685702',
        to: req.body.to
    })
    .then(message => {
        console.log(message.sid);
        res.status(200).json(message.sid);
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
});