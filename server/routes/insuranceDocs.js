const express = require('express');
const router = express.Router();
const fs = require('fs');
const Readable = require('stream').Readable

const Document = require('../models/document');

module.exports = router;

router.use(express.urlencoded({ extended: true }));

router.post('/documents/insurance', async (req, res) => {
    const doc =  new Document({
        userId: req.body.files.userId,
        usedFor: req.body.files.usedFor,
        type: req.body.files.type,
        name: req.body.files.name,
        document: req.body.files.file
    });
    try {
        const newDoc = await doc.save();
        res.status(201);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/documents/insurance/:userId', async (req, res) => {

    try {
        document = await Document.find({ "userId": req.params.userId });
        
        if (document === null) {
            return res.status(404).json({ message: 'Cannot find any loads created by this shipper' });
        }
        
        console.log('res > ', document.data);
        res.status(200).send(document);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

function computeFileName(name, type) {
    return name + '.' + type;
}

function decodeBase64File(file, name, type) {
    const imgBuffer = Buffer.from(file, 'base64');
    let stream = new Readable();

    stream.push(imgBuffer);
    stream.push(null);
    stream.pipe(fs.createWriteStream(computeFileName(name, type)));
}