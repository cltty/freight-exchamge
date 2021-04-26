const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carrierSchema = new Schema(
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
        fleet: {
            tractors: {
                type: Number,
                required: true
            },
            vans: {
                type: Number,
                required: true
            },
            trailers: {
                curtainSideTrailer: {
                    type: Number,
                    required: true
                },
                boxTrailer: {
                    type: Number,
                    required: true
                }
            }
        }
    }
);

const Carrier = mongoose.model('Carrier', carrierSchema);
module.exports = Carrier;