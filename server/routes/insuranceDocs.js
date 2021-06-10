const express = require('express');
const router = express.Router();
const fs = require('fs');
const Readable = require('stream').Readable

module.exports = router;

router.use(express.urlencoded({ extended: true }));

router.post('/documents/insurance', (req, res) => {
    console.log("Post >> /file-upload");

    if (req.body.files === undefined || req.body.files?.length === 0) {
        res.status(400);
        res.send('No files sent!');
        return;
    }
    req.body.files.forEach(file => {
        decodeBase64File(file.file.split(',')[1], file.name, file.type);
        
    });
    res.send('Succes');
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