const express = require('express');
const router = express.Router();

const fs = require('fs');
const fse = require('fs-extra');
const readline = require('readline');

router.post('/', async (request, response) => {

    let blogPostContent = '---' + '\n';
    const title = `title: "Change me"`;
    blogPostContent += '' + title + '\n';

    // generate header part of blog post
    const now = new Date();
    const dateLine = 'date:' + now.toISOString().slice(0, 10); //e.g. "date: 2021-07-13"
    blogPostContent += dateLine + '\n';
    blogPostContent += 'permalink: \"blog\/change-me"' + '\n';
    blogPostContent += 'published: true' + '\n';
    blogPostContent += 'excerpt: change-me' + '\n';
    blogPostContent += 'thumbnail:' + '\n';
    blogPostContent += '  external: change-me-with-thumbnail-url' + '\n';
    blogPostContent += 'header:' + '\n';
    blogPostContent += '  image: change-me-with-header-url' + '\n';
    blogPostContent += '  teaser: change-me-with-teaser-url-usually-thumbnail' + '\n';
    blogPostContent += 'categories:' + '\n';
    blogPostContent += ' - change-me-category' + '\n';
    blogPostContent += 'tags:' + '\n';
    blogPostContent += ' - change-me-tags' + '\n';
    blogPostContent += '---' + '\n\n';

    // generate body of the post
    blogPostContent += 'TODO: add introduction' + '\n\n';

    // ----- generate the image entries ------
    const fileStream = fs.createReadStream('input/image-paths.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let imagePaths = [];
    for await ( const line of rl ) {
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        if ( line ) {
            imagePaths.push(line);
        }
    }

    imagePaths.sort((a, b) => {
        const imageNameA = a.substring(a.lastIndexOf('/'), a.length);
        const imageNameB = b.substring(b.lastIndexOf('/'), b.length);

        return imageNameA.localeCompare(imageNameB);
    });

    for ( let i = 0; i < imagePaths.length; i = i + 2 ) {
        blogPostContent += '<figure class=\"image\">' + '\n';
        blogPostContent += `  <a href="${imagePaths[i]}">\n`;
        blogPostContent += `    <img src="${imagePaths[i + 1]}" alt="TODO-change-me">\n`;
        blogPostContent += `  </a>\n`;
        blogPostContent += `  <figcaption>TODO-change-me-optional</figcaption>\n`;
        blogPostContent += `</figure>\n`;
        blogPostContent += `\n\n`;
    }

    //write content to file
    const fileName = `output/${now.toISOString().slice(0, 10)}-change-me.md`;
    await fse.writeFile(fileName, blogPostContent);

    return response.status(201).send();
});

module.exports = router;
