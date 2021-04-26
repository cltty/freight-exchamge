const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('../config/config');

module.exports = router;

const connDB = async () => {
    try {
        await mongoose.connect(
            config.dbURI, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            }
        );
        console.log("signup route Mongo DB connected");
    } catch(err) {
        console.log("Error : ", err);
    }
}

connDB();

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));


router.post('/signup', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, X-Requested-With', 'X-HTTP-Method-Override');
    // res.header('Access-Control-Allow-Credentials', true);
    
    console.log("POST - signup!");

    res.send({
        success: 'success'
    });
});