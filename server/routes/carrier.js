const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('../config/config.js');
const Carrier = require('../models/carrier');
const CarrierValidation = require('../helpers/user-validation');

module.exports = router;


const connDB = async () => {
    try {
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log("Carrier.js Mongo DB connected.");
    } catch(err) {
        console.log("Error : ", err);
        process.exit(1);
    }
}

connDB();

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

router.post('/carrier', (req, res) => {
    console.log("POST - carrier!");

    // const response = CarrierValidation.createCarrierValidation(req.body);
    const response = 'valid';
    console.log("Response :: ", response);
    //some refactoring here..

    switch(response) {
        case 'valid':
            const carrier = new Carrier(req.body);    
            carrier.save()
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