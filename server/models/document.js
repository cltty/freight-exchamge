const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        usedFor: {
            type: String,
            required: true
        },
        type: {
            type: String,
        },
        name: {
            type: String,
            required: true
        },
        document: {
            type: Buffer,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;