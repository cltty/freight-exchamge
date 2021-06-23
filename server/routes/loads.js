const express = require('express');
const router = express.Router();
const Load = require('../models/load');

module.exports = router;

// Get all
router.get('/', async (req, res) => {
    try {
        const loads = await Load.find();
        res.json(loads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all available loads
router.get('/booked/false', getAvailableLoads, (req, res) => {
    res.send(res.loads);
})

// Get all booked loads by carrier id
router.get('/booked/true/:carrierId', getBookedLoadsByCarrierId, (req, res) => {
    res.send(res.loads);
});

// Get all loads created by shipper id
router.get('/shippers/:shipperId', getLoadsByShipperId, (req, res) => {
    res.send(res.loads);
});

// Get all loads booker by carrier id
router.get('/carriers/:carrierId', getBookedLoadsByCarrierId, (req, res) => {
    res.send(res.loads);
});

// Get Load By Id getLoadById
router.get('/:loadId', getLoadById, (req, res) => {
    res.send(res.load);
});

// Create one
router.post('/', async (req, res) => {
    const load = new Load({
        cancelled: req.body.cancelled,
        rejected: req.body.rejected,
        shipperDetails: {
            shipperId: req.body.shipperDetails.shipperId,
            shipperName: req.body.shipperDetails.shipperName,
            shipperPhoneNumber: req.body.shipperDetails.shipperPhoneNumber,
            shipperEmailAddress: req.body.shipperDetails.shipperEmailAddress
        },
        booked: {
            isBooked: req.body.booked.isBooked,
            carrierId:  req.body.booked.carrierId
        },
        origin: {
            city: req.body.origin.city,
            country: req.body.origin.country,
            arrival: req.body.origin.arrival
        },
        destination: {
            city: req.body.destination.city,
            country: req.body.destination.country,
            arrival: req.body.destination.arrival
        },
        distance: req.body.distance,
        equipment: {
            equipment: req.body.equipment.equipment,
            isRequired: req.body.equipment.isRequired
        },
        payout: req.body.payout
    });

    try {
        const newLoad = await load.save();
        res.status(201).json(newLoad);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// Book load
router.patch('/book/:loadId',  getLoadById, async (req, res) => {
    
    res.load.booked.isBooked = req.body.book;
    res.load.booked.carrierId = req.body.carrierId;
    res.load.booked.carrierCompanyLegalName = req.body.carrierCompanyLegalName;
    res.load.booked.carrierEmailAddress = req.body.carrierEmailAddress;
    res.load.booked.carrierPhoneNumber = req.body.carrierPhoneNumber;
    
    try {
        const updatedLoad = await res.load.save();
        res.json(updatedLoad);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cancel load
router.patch('/cancel/:loadId',  getLoadById, async (req, res) => {
    res.load.cancelled = true;

    try {
        const updatedLoad = await res.load.save();
        res.json(updatedLoad);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// reject load
router.patch('/reject/:loadId',  getLoadById, async (req, res) => {
    res.load.rejected = true;
    
    try {
        const updatedLoad = await res.load.save();
        res.json(updatedLoad);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// middleware for booked flag
async function getLoadsByBookedFlag(req, res, next) {
    try {
        loads = await Load.find({ "booked.isBooked": req.params.bookedflag });
        if (loads === null) {
            return res.status(404).json({ message: 'Cannot find' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.loads = loads;
    next();
}
// middleware for booked flag
async function getAvailableLoads(req, res, next) {
    try {
        loads = await Load.find({ "booked.isBooked": false, "cancelled": false });
        if (loads === null) {
            return res.status(404).json({ message: 'Cannot find' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.loads = loads;
    next();
}


// middleware for booked flag
async function getBookedLoadsByCarrierId(req, res, next) {
    try {
        loads = await Load.find({ "booked.carrierId": req.params.carrierId });
        if (loads === null) {
            return res.status(404).json({ message: 'Cannot find any loads of this carrier' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.loads = loads;
    next();
}

async function getLoadById(req, res, next) {
    try {
        load = await Load.findById(req.params.loadId)
        if (load === null) {
            return res.status(404).json({ message: 'Cannot find any load with this id' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.load = load;
    next();
}

async function getLoadsByShipperId(req, res, next) {
    try {
        loads = await Load.find({ "shipperDetails.shipperId": req.params.shipperId });
        if (loads === null) {
            return res.status(404).json({ message: 'Cannot find any loads created by this shipper' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.loads = loads;
    next();
}