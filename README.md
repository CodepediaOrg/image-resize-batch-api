Batch image resize api
---

ExpressJS API to help you resize images from a directory and generate new ones in the `resized` subfolder.

> See the `curl` examples below and parameters to understand how to use it

### Installation and start the server

```
npm installl
npm start
```

### Execute **resizing** examples with curl
With directory, where you provide the absolute path where the images are stored
```
curl -0 -v -X POST localhost:9000/resize \
-H 'Content-Type: application/json; charset=utf-8' \
--data-binary @- << EOF
{
    "width": 1200,
    "quality": 90,
    "numberPrefixOnly": false,
    "imgDir": "/Users/ama/Desktop/post-zweisimmen"
}
EOF
```

> If **no image directory** (`imgDir`) is provided, then the images from [images](images) folder of the project are used.

In the following example only images starting with a number and dash are resized (`numberPrefixOnly` is `true`):
```
curl -0 -v -X POST localhost:9000/resize \
-H 'Content-Type: application/json; charset=utf-8' \
--data-binary @- << EOF
{
    "width": 1200,
    "quality": 90,
    "numberPrefixOnly": true
}
EOF
```

Parameters
- `width` - **required** desired width list (height is automatically scaled)
- `quality` - (0 to 100)
- `numberPrefixOnly` 
  - `false` - **default** all images in the directory are considered for resizing 
  - `true` - **ONLY** images with number prefixes are resized (e.g. `4-good-view-zweisimmen-north.jpeg`)
- `imgDir` (optional) - **absolute path** where the images are stored 
  - the resized images are placed in the `${imgDir}/resized` sub-directory
  - if this parameter is not provided the program expects that the images are placed in the [images](images)
  directory. Resized images are then generated in [images/resized](images/resized) directory
  - tested only in MacOS. Should work fine in Linux OS. For Windows place the images in the `input` directory
  as mentioned above

> You can use Postman or similar tools to execute the POST commands above if you are more comfortable with these tools
