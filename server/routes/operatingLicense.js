const express = require('express');
const router = express.Router();
const fs = require('fs');
const Readable = require('stream').Readable

module.exports = router;

router.use(express.urlencoded({ extended: true }));

router.post('/documents/operating-license', (req, res) => {
    console.log("Post >> /documents/operating-license");

    if (req.body.files === undefined || req.body.files?.length === 0) {
        res.status(400);
        res.send('No files sent!');
        return;
    }
    req.body.files.forEach(file => {
        decodeBase64File(file.file.split(',')[1], file.name, file.type);
        
    });
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