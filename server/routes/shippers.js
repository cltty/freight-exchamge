const express = require('express');
const router = express.Router();
const Company = require('../models/company');

module.exports = router;

// Get all
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all shippers
router.get('/shippers', async (req, res) => {
    try {
        companies = await Company.find({ companyType: "Shipper" });
        if (user === null) {
            return res.status(404).json({ message: 'Cannot find user' });

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/:id',  (req, res) => {
    res.send(res.user);
});