const path = require('path');

const express = require('express');
const router = express.Router();
const Jimp = require('jimp');

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

const JPEG = require('jpeg-js');

router.post('/', async (request, response) => {
    Jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, { maxMemoryUsageInMB: 1024 });
    const {width} = request.body;
    if ( !width ) {
        response.status(400).send({"validation_error": "desired width is mandatory"});
    }
    const quality = request.body.quality || 100;
    const numberPrefixOnly = request.body.numberPrefixOnly || false;
    const outputImgExt = request.body.outputImgExt || undefined;

    const imgDir = request.body.imgDir || 'images';//fallback to images in input folder if no path is provided
    const outputImgDir = `${imgDir}/resized`;

    let files = await readdir(imgDir, {withFileTypes: true});

    files = files.filter(file => {
        if ( numberPrefixOnly ) {
            return file.name.match(/^\d/) && file.name.match(/\.(jpe?g|png|gif|JPG)$/)
        } else {
            return file.name.match(/\.(jpe?g|png|gif|JPG)$/)
        }
    });

    for ( const file of files ) {
        console.log('Processing image - ', file.name);
        const fileName = file.name;
        const dotIndex = fileName.lastIndexOf('.');
        const name = fileName.substring(0, dotIndex);
        const extension = outputImgExt || fileName.substring(dotIndex, fileName.length);

        const image = await Jimp.read(`${imgDir}/${fileName}`);
        await image.resize(width, Jimp.AUTO);
        await image.quality(quality);
        let newFileName = '';
        let fileNameStartsWithIntegerFollowedByHyphen = fileName.match(/^\d+-/);

        newFileName = `${name}-${width}x${image.bitmap.height}.${extension}`;


        await image.writeAsync(`${outputImgDir}/${newFileName}`);
        console.log(`${outputImgDir}/${newFileName}`);
    }

    return response.status(201).send();
});

module.exports = router;
