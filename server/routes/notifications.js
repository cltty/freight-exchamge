const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

module.exports = router;

// Get unread notifications for userId
router.get('/:userId', getUnreadNotifications, (req, res) => {
    res.send(res.notifications);
});

// Create one
router.post('/', async (req, res) => {
    const notification = new Notification({
        read: req.body.read,
        for: {
            userId: req.body.for.userId,
            companyLegalName: req.body.for.companyLegalName,
            companyEmailAddress: req.body.for.companyEmailAddress,
            companyPhoneNumber: req.body.for.companyPhoneNumber
        },
        from: {
            userId: req.body.from.userId,
            companyLegalName: req.body.from.companyLegalName,
            companyEmailAddress: req.body.from.companyEmailAddress,
            companyPhoneNumber: req.body.from.companyPhoneNumber
        },
        message: req.body.message
    });

    try {
        const newNotification = await notification.save();
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