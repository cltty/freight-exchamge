// //will contain all of my user related routes
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('../config/config.js');
const User = require('../models/user');
const UserValidation = require('../helpers/user-validation');

module.exports = router;

const connDB = async () => {
    try {
        // const conn = await mongoose.connect(config.dbURI, {
        await mongoose.connect(config.dbURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log("Mongo DB connected.");

    } catch(err) {
        console.log("Error : ", err);
        process.exit(1);
    }
}

connDB();


router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

router.post('/user', (req, res) => {
    console.log("POST - User!");

    const response = UserValidation.createUserValidation(req.body);
    console.log("Response :: ", response);
    //some refactoring here..

    switch(response) {
        case 'valid':
            const user = new User(req.body);
            user.save()
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


router.get('/users', (req, res) => {
    User.find()
    .then(result => {
        res.status(200).json({
            studentData: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
        .then(result => {
            console.log("GET by id : ", JSON.stringify(result));
            res.send(result);
        })
        .catch(err => {
            console.log("Error : ", err);
        });
});

router.put('/user/id', (req, res) => {

});

router.delete('/user/id', (req, res) => {

});


// // get
// // post
// // put
// // delete