const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        userId: {
            type: String,
            required: true
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
            city: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            },
            country: {
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