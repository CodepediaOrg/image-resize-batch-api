const path = require('path');

const express = require('express');
const router = express.Router();
const Jimp = require('jimp');

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

router.post('/', async (request, response) => {
    const {width} = request.body;
    if ( !width ) {
        response.status(400).send({"validation_error": "desired width is mandatory"});
    }
    const quality = request.body.quality || 100;
    const numberPrefixOnly = request.body.numberPrefixOnly || false;

    const imgDir = request.body.imgDir || 'images';//fallback to images in input folder if no path is provided
    const outputImgDir = `${imgDir}/resized`;

    let files = await readdir(imgDir, {withFileTypes: true});

    files = files.filter(file => {
        if ( numberPrefixOnly ) {
            return file.name.match(/^\d/) && file.name.match(/\.(jpe?g|png|gif)$/)
        } else {
            return file.name.match(/\.(jpe?g|png|gif)$/)
        }
    });

    for ( const file of files ) {
        const image = await Jimp.read(`${imgDir}/${file.name}`);
        await image.resize(width, Jimp.AUTO);
        await image.quality(quality);
        let newFileName = '';
        if ( file.name.match(/^\d/) ) {
            const photoNumber = file.name.substring(0, file.name.indexOf('-'));
            newFileName = `${photoNumber}-${width}x${image.bitmap.height}-${file.name.substring(file.name.indexOf('-') + 1, file.length)}`;
        } else {
            newFileName = `${width}x${image.bitmap.height}-${file.name}`;
        }

        await image.writeAsync(`${outputImgDir}/${newFileName}`);
        console.log(`${outputImgDir}/${newFileName}`);
    }

    return response.status(201).send();
});

module.exports = router;
