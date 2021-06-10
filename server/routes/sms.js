const express = require('express');
const router = express.Router();

module.exports = router;

const dotenv = require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/', (req, res) => {
    console.log("Sending SMS...");
    client.messages
    .create({
        body: "Dummy Message",
        from: '+15622685702',
        to: "+40742631780"
    })
    .then(message => {
        console.log(message.sid);
        res.status(200).json(message.sid);
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
});

// 40742631780