const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const distance = require('google-distance-matrix');

module.exports = router;

distance.key('AIzaSyD_z2Q7vsuwFFrwHtEPPOh1O7CqVO_8VbA');
distance.units('metric');

router.post('/', async (req, res) => {
    let origins = [];
    origins.push(req.body.origins);
    
    let destinations = [];
    destinations.push(req.body.destinations);

    await distance.matrix(origins, destinations, function (err, distances) {
        if (err) {
            res.statusCode(500);
        }
        if (distances.status == 'OK') {
            for (let i = 0; i < origins.length; i++) {
                for (let j = 0; j < destinations.length; j++) {
                    let origin = distances.origin_addresses[i];
                    let destination = distances.destination_addresses[j];
                    if (distances.rows[0].elements[j].status == 'OK') {
                        let distance = distances.rows[i].elements[j].distance.text;
                        res.status(200).send({ distance: distance });
                    } else {
                        res.status(500).send({ distance: 'Not reachable' });
                    }
                }
            }
        }
    });
});