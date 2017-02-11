/**
 * Created by gsierra on 8/02/17.
 */
require('dotenv').config();
var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
const Vision = require('@google-cloud/vision');
var authFactory = new GoogleAuth();
const vision = Vision();

authFactory.getApplicationDefault(function(err, authClient) {
  if (err) {
    console.log('Authentication failed because of ', err);
    return;
  }
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
    authClient = authClient.createScoped(scopes);
  }

});
vision.detectProperties('./img/test.jpg', function(err, faces) {
console.log(faces[0]);
if(err)
  console.log("err: "+err)
});
// vision.detectLogos('./test.jpg', function(err, faces) {
// console.log(faces);
// if(err)
//   console.log("err: "+err)
// });
// vision.detectLabels('./test.jpg', function(err, faces) {
// console.log(faces);
// if(err)
//   console.log("err: "+err)
// });
// vision.detectText('./test.jpg', function(err, faces) {
// console.log(faces);
// if(err)
//   console.log("err: "+err)
// });

//
// var express = require('express');
// var multer  = require('multer');
//
// var app = express();
//
// app.get('/',function(req,res){
//     console.log("It's work");
//     res.sendFile(__dirname + "/index.html");
// });
//
// var Clarifai = require('clarifai');
// var clarifai = new Clarifai.App(
//     'bDtm5F-0LRpVkSWhPrdmf33IBkdDiTP8l5e35zP4',
//     'wVqrlvLH0050dTG8SRKFQQolLrO-rbtVSWQcUWju'
// );
//
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log("Dest");
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
//
// var upload = multer({ storage: storage });
//
// app.post('/uploadImage', upload.single('image'), function (req, res, next) {
//     console.log("success");
//     console.log(req.file);
//     res.status(204).end();
// });
//
// app.listen(3001,function(){
//     console.log("Working on port 3001");
// });
// //
// console.log("youturfer");
// app.post('/photo', upload.single('picture'), function (req, res, next) {
//     console.log(req.protocol+req.hostname+req.file.path);
//     app.models.predict(Clarifai.GENERAL_MODEL, req.protocol+req.hostname+req.file.path).then(
//         function (response) {
//             console.log('result'+ {result: response});
//             res.render('result', {result: response});
//         },
//         function (err) {
//             console.error(err);
//         }
//     );
// });
// module.exports = router;

//
// 'use strict';
//
// require('dotenv').config();
// var express = require('express')();
// // var server = require('http').createServer(express);
// /////////////
// var router = express.Router();
// var multer = require('multer');
// var upload = multer({dest: 'public/uploads/'});
// //////////////
// var io = require('socket.io')(server);
// var fs = require("fs");
// var filename = './img.jpg';
// var arrExclude = require('arr-exclude');
// var shortid = require('shortid');
// //TODO create my own JSON schema
// //var jsonObj = require("./path/to/myjsonfile.json")
//
// /**APIs requires*/
// var Clarifai = require('clarifai');
// var clarifai = new Clarifai.App(
//     process.env.CLARIFAI_ID,
//     process.env.CLARIFAI_SECRET
// );
// var cloudsight = require ('cloudsight') ({
//     apikey: process.env.CLOUDSIGHT_KEY
// });
//
// var Google = require('googleapis');
// var GoogleAuth = require('google-auth-library');
// var GoogleAuthFactory = new GoogleAuth();
// const GoogleVision = require('@google-cloud/vision');
// const googleVision = GoogleVision();
//
// var port = process.env.PORT || 3001;
//
// GoogleAuthFactory.getApplicationDefault(function(err, authClient) {
//     if (err) {
//         console.log('Authentication failed because of ', err);
//         return;
//     }
//     if (authClient.createScopedRequired && authClient.createScopedRequired()) {
//         var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
//         authClient = authClient.createScoped(scopes);
//     }
// });
//
// module.exports = router;
//
// var debug = true;
//
//
// /**
//  * JSON file compatible object constructor
//  * @param {int                  objectId                    Unique identifier:
//  * @param {String               api                         used api {Google, Cloudsight, Clarifai...}
//  * @param {Object                 type                        Object with keys explained below:
//  *   @param {String[]}           type[].Colors               Hex Color, Ex:
//  *   @param {String[]}           type[].Labels
//  *   @param {String}             type[].Text                'gray acer cordless mouse'
//  *   @param {String}             type[].Logo                'Acer'
//  *   @param {String}             type[].OCR                 'Desinfectador'
//  * @param {object}               data                      Either String or String[] representing the data
//  * @return {JSON} A JSON that is fulfilled with Params
//  */
// function respTag(api,type,resp){
//     var data;
//     console.log(api+type+" resp: "+JSON.stringify(resp));
//     switch(api) {
//         case "Google":
//             data = resp;
//             break;
//         case "Clarifai":
//             //Todo: make it collaborative or self learning shared list
//             var clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture"];
//             if (resp.status.description === 'Ok') {
//                 //TODO ToBeChanged to getOutuputData function instead,
//                 // check https://sdk.clarifai.com/js/latest/Model.html#getOutputInfo
//                 console.log("Within constructor. This should be an array: "+resp.getOutputInfo());
//
//                 data = (type=='Labels') ?
//                     arrExclude(resp.rawData.outputs[0].data.concepts.forEach.name, clarifai_blacklist) :
//                     resp.rawData.outputs[0].data.colors.forEach.w3c.hex;
//
//                 //TODO ToBe @deprecated  + if(concepts[i].value>0.7){
//                 console.log("Pre filtered tags:  " + preFilterTags + "\nPost filtered tags: " + data);
//             }
//             break;
//         case "Cloudsight":
//             // if (resp.status == 'completed')
//             data = resp.name;
//             break;
//         default: //Assuming case for google
//             data = resp; //SHould not happen
//             console.log("Default swtich case, should never happpen..."+err);
//     }
//     this.respTag = {
//         id: shortid.generate(),
//         api: api,
//         type: type,
//         data: data
//     };
// }
// app.post('/uploadImage', upload.single('image'), function (req, res, next) {
//     console.log("success");
//     console.log(req.file);
//     res.status(204).end();
//
//     /**TODO remove from within fs writer when possible*/
//
//     /**Google req*/
//     googleVision.detectLogos(filename).then(function(err, resp){
//         console.log("Google Logo resp: "+resp.responses)
//         const aux = resp[0];
//         onResp(new respTag('Google','Logo',aux),null);
//     });
//     googleVision.detectLabels(filename).then(function(err, resp){
//         onResp(new respTag('Google','Labels',resp[0]));
//     });
//     googleVision.detectText(filename).then(function(err, resp){
//         onResp(new respTag('Google','OCR',resp[0]));
//     });
//     googleVision.detectProperties(filename).then(function(err, resp){
//         onResp(new respTag('Google','Colors',resp[0]));
//     });
//
//     /**Cloudsight req*/
//     var imgCloudsight = {
//         image: './img.jpg',
//         locale: 'en-US'  //Todo Add TTL ?
//     };
//     cloudsight.request(imgCloudsight, true, function(err, data) {
//         onResp(new respTag('Cloudsight','Descr',data),err);
//     });
// });
//
// /**Clarifai req*/
// clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data}).then(function(resp) {
//     onResp(new respTag('Clarifai','Labels',resp));
// });
// clarifai.models.predict(Clarifai.COLOR_MODEL, {base64: base64Data}).then(function(resp) {
//     onResp(new respTag('Clarifai','Colors',resp));
// });
//
// /**
//  * Process results obtained from different APIs into a JSON file
//  * @param {JSON}         concepts    Object with keys explained below:
//  * @return {void} A JSON that is fulfilled with Params
//  */
// function onResp(tagJSON, err){
//     if(debug){
//         console.log(tagJSON.name+" Log: "+ tagJSON.data);
//     }
//     if(err)
//         console.log("Err: "+tagJSON.type+tagJSON.api+err);
//     // socket.emit('METADATA', tagJSON);
//     /**Todo @fterwards: save img onto a DB*/
// }
//
// server.listen(port, function(){
//     console.log('Server listening at port %d', port);
// });