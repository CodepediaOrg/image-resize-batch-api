Batch image resize api
---

ExpressJS API to help you resize the images from absolute path directory (`imgDir`) if provided, otherwise from [images/input](images/input) folder
and places the transformed images either in `${imgDir}/resized` or [images/resized](images/resized).

> See instruction below 

### Installation and start the server

```
npm installl
npm start
```

### Execute **resizing** with curl
With absolute directory path where are stored the images
```
curl -0 -v -X POST localhost:9000/resize \
-H 'Content-Type: application/json; charset=utf-8' \
--data-binary @- << EOF
{
    "width": 1200,
    "quality": 90,
    "disablePrefix": false,
    "imgDir": "/Users/ama/Desktop/post-zweisimmen"
}
EOF
```

Without `imgDir`
```
curl -0 -v -X POST localhost:9000/resize \
-H 'Content-Type: application/json; charset=utf-8' \
--data-binary @- << EOF
{
    "width": 1200,
    "quality": 90,
    "disablePrefix": false
}
EOF
```

Parameters
- `width` - desired width list (height is automatically scaled)
- `quality` - (0 to 100)
- `disablePrefix` 
  - `false` - **default** in this case ONLY images with number prefixes are resized (e.g. `4-good-view-zweisimmen-north.jpeg`)
  - `true` - all images in the directory are considered for resizing
- `imgDir` (optional) - **absolute path** where the images are found 
  - the resized images are placed in the `${imgDir}/resized` directory
  - if this parameter is not provided the program expects that the images are placed in the [images/input](images/input)
  directory. Resized images are then placed in [images/resized](images/resized) directory
  - tested only in MacOS. Should work fine in Linux OS. For Windows place the images in the `input` directory
  as mentioned above

> You can use Postman or similar tools to execute the POST commands above if you are more comfortable with these tools
