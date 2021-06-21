const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = router;

// Get unread notifications for userId
router.get('/:userId', getUnreadNotifications, (req, res) => {
    res.send(res.notifications);
});

// Create one
router.post('/', async (req, res) => {
    console.log('>> Create notification!');

    const notification = new Notification({
        read: req.body.notificationPayload.read,
        for: {
            userId: req.body.notificationPayload.for.userId,
            companyLegalName: req.body.notificationPayload.for.companyLegalName,
            companyEmailAddress: req.body.notificationPayload.for.companyEmailAddress,
            companyPhoneNumber: req.body.notificationPayload.for.companyPhoneNumber
        },
        from: {
            userId: req.body.notificationPayload.from.userId,
            companyLegalName: req.body.notificationPayload.from.companyLegalName,
            companyEmailAddress: req.body.notificationPayload.from.companyEmailAddress,
            companyPhoneNumber: req.body.notificationPayload.from.companyPhoneNumber
        },
        messageSummary: req.body.notificationPayload.messageSummary,
        message: req.body.notificationPayload.message
    });

    try {
        const newNotification = await notification.save();

        sendNotificationViaSMS(notification.for.companyPhoneNumber, notification.messageSummary, notification.message);
        
        res.status(201).json(newNotification);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/markAsRead/:notificationId',  getNotificationById, async (req, res) => {
    res.notification.read = true;
    
    try {
        const updatedNotification = await res.notification.save();
        res.json(updatedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


async function getUnreadNotifications(req, res, next) {
    try {
        notifications = await Notification.find({ "read": false, "for.userId": req.params.userId});
        if (notifications === null) {
            return res.status(404).json({ message: 'Nothing new for this user' });

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.notifications = notifications;
    next();
}

async function getNotificationById(req, res, next) {
    try {
        notification = await Notification.findById(req.params.notificationId);
        if (notification === null) {
            return res.status(404).json({ message: 'Could not find notification with provided id' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.notification = notification;
    next();
}

function sendNotificationViaSMS(phoneNumber, messageSummary, message) {
    client.messages
    .create({
        body: messageSummary,
        from: '+15622685702',
        to: phoneNumber
    })
    .then(message => {
        console.log('Twilio success', message.sid);
    })
    .catch(err => {
        console.log('Twilio err : ', err);
    });
}