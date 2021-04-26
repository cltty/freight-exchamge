const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('../config/config');
const Shipper = require('../models/shipper');

module.exports = router;

const connDB = async () => {
    try {
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log("Shipper.js Mongo DB connected.");
    } catch(err) {
        console.log("Error : ", err);
    }
}

connDB();

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

router.post('/shipper', (req, res) => {
    console.log("POST - shipper!");
    

    // const response = ShipperNamespace.validateCreationOfNewShipper(req.body)
    const response = 'valid';
    
    switch(response) {
        case 'valid':
            const shipper = new Shipper(req.body);    
            shipper.save()
                .then((result) => {
                res.send(result);
                })
                .catch((error) => {
                    console.log('error :', error);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Cannot create user!' + error);
                })
        break;
        default:
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Cannot create user!' + response);
        break;
    }
});