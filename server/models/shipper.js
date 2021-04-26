const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shipperSchema = new Schema(
    {
        uniqueId: {
            type: String,
            required: true
        },
        VAT: {
            type: String,
            required: true
        },
        companyHeadquartersCountry: {
            type: String,
            required: true
        },
        shippingFrom: {
            type: String,
            required: true
        },
        ftlShipments: {
            type: Number,
            required: true
        },
        preferedLanguage: {
            type: String,
            required: true
        }
    }
);

const Shipper = mongoose.model('Shipper', shipperSchema);
module.exports = Shipper;

