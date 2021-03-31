const path = require('path');

const express = require('express');
const router = express.Router();
const Jimp = require('jimp');

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);



router.post('/', async (request, response) => {
    const {width, quality} = request.body;
    const disablePrefix = request.body.disablePrefix === undefined ? false :  request.body.disablePrefix;

    let imgDir = 'images/input';//fallback to images in input folder if no path is provided
    let outputImgDir = path.join(__dirname, `../images/resized`);
    if(request.body.imgDir) {
        imgDir = request.body.imgDir;
        outputImgDir = `${imgDir}/resized`;
    }

    const images = await readdir(imgDir);

    for ( const file of images ) {
        if (disablePrefix || !disablePrefix && file.match(/^\d/)) {
            const image = await Jimp.read(`${imgDir}/${file}`);
            await image.resize(width, Jimp.AUTO);
            await image.quality(quality);

            const photoNumber = file.substring(0, file.indexOf('-'));
            const newFileName = `${photoNumber}-${width}x${image.bitmap.height}-${file.substring(file.indexOf('-') + 1, file.length)}`;
            await image.writeAsync(`${outputImgDir}/${newFileName}`);
            console.log(`${outputImgDir}/${newFileName}`);
        }
    }

    return response.status(201).send();
});

module.exports = router;
