const express = require('express');
const router = express.Router();
const Company = require('../models/company');

const SHIPPER_TYPE = "Shipper";
const CARRIER_TYPE = "Carrier";

module.exports = router;

// Get all
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all shippers
router.get('/shippers', async (req, res) => {
    console.log("get('/shippers'");
    try {
        companies = await Company.find({ "companyDetails.companyType": SHIPPER_TYPE });
        // if (companies === null) return res.status(204).json({ message: "There aren't any shippers" });
        return res.status(200).send(companies);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get all carriers
router.get('/carriers', async (req, res) => {
    try {
        companies = await Company.find({ companyType: CARRIER_TYPE });
        // if (companies === null) return res.status(204).json({ message: "There aren't any shippers" });
        return res.status(200).send(companies);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get Company by id
router.get('/:id', getCompanyByUserId, (req, res) => {
    console.log("Get Company by id");
    res.send(res.company);
});

// Get Carrier by id
router.get('/carriers/:id', getCarrierById, (req, res) => {
    console.log("Get Carrier by id");
    res.send(res.company);
});

// Get Shipper by id
router.get('/shippers/:id', getShipperById, (req, res) => {
    console.log("Get Shipper by id");
    res.send(res.company);
});

// Create Company Profile
router.post('/', async (req, res) => {
    const company = new Company(req.body);

    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

async function getCompanyByUserId(req, res, next) {
    try {
        company = await Company.findOne({ userId: req.params.id });
        if (company === null) {
            return res.status(404).json({ message: 'Cannot find company' });

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.company = company;
    next();
}

async function getCarrierById(req, res, next) {
    try {
        company = await Company.findOne({ userId: req.params.id, companyType: CARRIER_TYPE});
        if (company === null) {
            return res.status(404).json({ message: 'Cannot find carrier' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.company = company;
    next();
}

async function getShipperById(req, res, next) {
    try {
        company = await Company.findOne({ userId: req.params.id, companyType: SHIPPER_TYPE });
        if (company === null) {
            return res.status(404).json({ message: 'Cannot find shipper' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.company = company;
    next();
}