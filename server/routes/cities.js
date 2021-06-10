const express = require('express');
const router = express.Router();
const unirest = require("unirest");
const citiesReq = unirest("GET", "https://ip-geo-location.p.rapidapi.com/ip/check");

module.exports = router;

// Get all
router.get('/', (req, res) => {
    citiesReq.query({
        "format": "json"
    });
    
    citiesReq.headers({
        "x-rapidapi-key": "c51cc0ffdbmsh65c40bea33ecdcdp12dadcjsn3485f4c0897f",
        "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
        "useQueryString": true
    });
    
    
    citiesReq.end(function (citiesRes) {
        // if (citiesRes.error) throw new Error(citiesRes.error);
        if (citiesRes.error) {
            res.status(400).json({ message: citiesRes });
            return;
        }
        

        // console.log(rcitiesRes.body);
        res.send(citiesRes);
    });
});