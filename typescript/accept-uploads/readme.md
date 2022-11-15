# node uploads
https://www.twilio.com/blog/handle-file-uploads-node-express
##
mkdir multipart_demo
cd multipart_demo
mkdir node_app
npx express-generator express_app
cd express_app
npm install

##
cd ..
cd node_app
npm init -y
npm install form-data axios

## upload route .js
```js
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const upload = async () => {
  try {
    const file = fs.createReadStream('./myfile.txt');
    const title = 'My file';

    const form = new FormData();
    form.append('title', title);
    form.append('file', file);

    const resp = await axios.post('http://localhost:3000/upload', form, {
      headers: {
        ...form.getHeaders(),
      }
    });

    if (resp.status === 200) {
      return 'Upload complete';
    }
  } catch(err) {
    return new Error(err.message);
  }
}

upload().then(resp => console.log(resp));
```

##

cd ..
cd express_app
npm install multer

## router multer

https://www.npmjs.com/package/multer

### fields
```
.fields(fields)
[
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]
```

```js
var express = require('express');
var router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

router.post('/upload', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

module.exports = router;
```

## test
npm start
upload file
