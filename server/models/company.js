const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        userId: {
            type: String,
            required: true//,
            // unique: true
        },
        emailAddress: {
            type: String,
            required: true,
            unique: true
        },
        companyDetails: {
            companyLegalName: {
                type: String,
                required: true
            },
            companyType: {
                type: String,
                required: true
            },
            vatNumber: {
                type: String,
                required: true,
                unique: true
            },
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            addressLine1: {
                type: String,
                required: true
            },
            addressLine2: {
                type: String
            },
            phoneNumber: {
                type: String,
                required: true
            },
            postcode: {
                type: String,
                required: true
            },
            countryName: {
                type: String,
                required: true
            },
        },
        paymentDetails: {
            accountHolderName: {
                type: String,
                required: true
            },
            swiftBicCode: {
                type: String,
                required: true
            },
            ibanNumber: {
                type: String,
                required: true,
                unique: true
            }
        },
        equipment: {
            standardTractorUnits: {
                type: Number
            }, 
            sevenHalfTrucks: {
                type: Number
            },
            threeHalfTailiftVans: {
                type: Number
            },
            threeHalfVans: {
                type: Number
            },
            curtainSidedTrailers: {
                type: Number
            },
            boxTrailer: {
                type: Number
            },
        },
        insuranceDocuments: {
            files: [{
                name: {
                    type: String
                },
                file: {
                    type:  Buffer
                },
                type: {
                    type: String
                }
            }]
        },
        operatingLicense: {
            name: {
                type: String
            },
            file: {
                type: Buffer
            },
            type: {
                type: String
            }
        }
    }
);

const Company = mongoose.model('Company', companySchema);
module.exports = Company;