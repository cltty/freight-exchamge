var validate = require('validate-vat');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
module.exports = router;
router.use(express.urlencoded({ extended: true }));

router.post('/vat-check', (req, res) => {
    console.log("POST  -> /vat-check");
    
    const internalValidationResponse = validateReqBody(req.body);

   

    switch(internalValidationResponse) {
        case 'success':
            validate( req.body.vatObj.countryCode,  req.body.vatObj.vatNumber,  function(err, validationInfo) {
                console.log("RESPONSE >> ", validationInfo);
                if (validationInfo) {
                    res.send(
                        {
                            "valid": validationInfo.valid
                        }
                    );
                }
                if (err) {
                    res.send(
                        {
                            "valid": false,
                            "error": err
                        }
                    );
                }
            });
        break;
        default:
            // Internal Validation failed
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(
                    {
                        "valid": false,
                        "error": internalValidationResponse
                    }
                )
            );
        break;
    }
});

function validateReqBody(req) {
    if (
        !req.hasOwnProperty('vatObj') ||
        !req.vatObj.hasOwnProperty('countryCode') || 
        !req.vatObj.hasOwnProperty('countryCode')) {
        return "Incomplete request body";
    }
    if (
        !req.vatObj.countryCode || 
        req.vatObj.countryCode.length !== 2 ||
        typeof req.vatObj.countryCode !== "string"
        ) {
        return "Invalid country code received";
    }
    if (!req.vatObj.vatNumber || typeof req.vatObj.vatNumber !== "string" || isNaN(Number(req.vatObj.vatNumber))) {
        return "Invalid vat number received";
    }
    return "success";
}