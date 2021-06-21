const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../utils/authMiddleware');

module.exports = router;

// Get all
router.get('/', authenticateToken, async (req, res) => {
    console.log("Get All users");
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log("Get All users");
        res.status(500).json({ message: err.message });
    }
});

// Get by id
router.get('/:id', [authenticateToken, getUser], (req, res) => {
    res.send(res.user);
});

// Create one
router.post('/', async (req, res) => {
    const user = new User({
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        companyProfileCreated: false
    });

    try {
        const newUser = await user.save();

        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// Update User proprieties by ID
router.patch('/:id', [authenticateToken, getUser], async (req, res) => {
    if (req.body?.emailAddress != null) {
        res.user.emailAddress = req.body.emailAddress;
    }
    if (req.body?.temporaryBanned != null) {
        res.user.temporaryBanned = req.body.temporaryBanned;
    }
    if (req.body.hasOwnProperty('companyType')) {
        res.user.companyType = req.body.companyType;
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update temporaryBanned prop by ID
router.patch('/temporary-ban/:id', [authenticateToken, adminRights, getUser], async (req, res) => {
    res.user.temporaryBanned = req.body.temporaryBanned;

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete User by ID
router.delete('/:id', [authenticateToken, getUser], async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: "User deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// middleware
async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: 'Cannot find user' });

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}
