var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var Clarifai = require('clarifai');
var app = new Clarifai.App(
    'bDtm5F-0LRpVkSWhPrdmf33IBkdDiTP8l5e35zP4',
    'wVqrlvLH0050dTG8SRKFQQolLrO-rbtVSWQcUWju'
);

router.post('/photo', upload.single('picture'), function (req, res, next) {
    app.models.predict(Clarifai.GENERAL_MODEL, req.protocol+req.hostname+req.file.path).then(
        function (response) {
            res.render('result', {result: response});
        },
        function (err) {
            console.error(err);
        }
    );
});
module.exports = router;