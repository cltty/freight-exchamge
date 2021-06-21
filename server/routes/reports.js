const express = require('express');
const router = express.Router();
const Report = require('../models/report');

module.exports = router;

// Get reports for specific user
router.get('/:userId', getReportsByUserId, (req, res) => {
    res.send(res.reports);
});

// Create one
router.post('/', async (req, res) => {
    const report = new Report({
        reason: req.body.reason,
        reasonSummary: req.body.reasonSummary,
        userId: req.body.userId,
        reportedBy: {
            userId: req.body.reportedBy.userId,
            companyLegalName: req.body.reportedBy.companyLegalName,
            companyEmailAddress: req.body.reportedBy.companyEmailAddress,
            companyPhoneNumber: req.body.reportedBy.companyPhoneNumber
        }
    });

    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

async function getReportsByUserId(req, res, next) {
    try {
        reports = await Report.find({ "userId": req.params.userId });
        if (reports === null) {
            return res.status(404).json({ message: 'No reports for this user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.reports = reports;
    next();
}