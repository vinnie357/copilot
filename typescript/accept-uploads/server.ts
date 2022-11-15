var express = require('express');
var router = express.Router();
const os  = require('os');

const multer  = require('multer');
const fileUpload = multer({ dest: os.tmpdir() });
const fields = [
    { name: 'tarball', maxCount: 1 },
    { name: 'name', maxCount: 1 },
    { name: 'runtime', maxCount: 1 },
    { name: 'entry_point', maxCount: 1 },
    { name: 'source_path', maxCount: 1 },
    { name: 'port', maxCount: 1 },
    { name: 'project_id', maxCount: 1 },
    { name: 'envs', maxCount: 1 },
];
router.post('/upload/single', fileUpload.single('file'), function(req:any, res:any) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

router.post('/upload', fileUpload.fields(fields), function(req:any, res:any) {
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
});

module.exports = router;
