'use strict';

require('dotenv').config();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
// var filename = './img.jpg';
var arrExclude = require('arr-exclude');
var shortid = require('shortid');
//TODO create my own JSON schema
//var jsonObj = require("./path/to/myjsonfile.json")

/**APIs requires*/
var Clarifai = require('clarifai');
var clarifai = new Clarifai.App(
    process.env.CLARIFAI_ID,
    process.env.CLARIFAI_SECRET
);
var cloudsight = require('cloudsight')({
    apikey: process.env.CLOUDSIGHT_KEY
});

var Google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var GoogleAuthFactory = new GoogleAuth();
const GoogleVision = require('@google-cloud/vision');
const googleVision = GoogleVision();

var port = process.env.PORT || 3001;

GoogleAuthFactory.getApplicationDefault(function (err, authClient) {
    if (err) {
        console.log('Authentication failed because of ', err);
        return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
        authClient = authClient.createScoped(scopes);
    }
});

var debug = true;


/**
 * JSON file compatible object constructor
 * @param {int                  objectId                    Unique identifier:
 * @param {String               API                         used API {Google, Cloudsight, Clarifai...}
 * @param {Object                 type                        Object with keys explained below:
 *   @param {String[]}           type[].Colors               Hex Color, Ex:
 *   @param {String[]}           type[].Labels
 *   @param {String}             type[].Text                'gray acer cordless mouse'
 *   @param {String}             type[].Logo                'Acer'
 *   @param {String}             type[].OCR                 'Desinfectador'
 * @param {object}               data                      Either String or String[] representing the data
 * @return {JSON} A JSON that is fulfilled with Params
 */
function respTag(API, type, data) {
    this.respTag = {
        id: shortid.generate(),
        API: API,
        type: type,
        data: data
    };
    if (debug)
        console.log(this.respTag);
}

io.on('connection', function (socket) {
    console.log("Meta connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        console.log("Meta emitting: ");

        /**Clarifai req*/
        clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data}).then(function (resp) {
            var labs = [];
            resp.outputs[0].data.concepts.forEach(function (elem) {
                if (elem.value > 0.8)
                    labs.push(elem.name)
            });
            //Postprocess to clean unused data
            const clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture", "ofense",
                "energy", "people", "house", "man", "family", "motion", "home", "room"];
            var meta = new respTag('Clarifai', 'Labels', arrExclude(labs, clarifai_blacklist));
            socket.emit('METADATA', meta);
        });
        clarifai.models.predict(Clarifai.COLOR_MODEL, {base64: base64Data}).then(function (resp) {
            var cols = [];
            resp.outputs[0].data.colors.forEach((elem) => cols.push(elem.w3c.hex));
            var meta = new respTag('Clarifai', 'Colors', cols);
            socket.emit('METADATA', meta);
        });
        /**Clothing Model*/
        clarifai.models.predict("e0be3b9d6a454f0493ac3a30784001ff", {base64: base64Data}).then(function (resp) {
            var meta = new respTag('Clarifai', 'Categories', unescape(resp.outputs[0].data.concepts[0].name));
            socket.emit('METADATA', meta);
        });

        /**Convert data64 into a file (needed by some APIs)*/
        var location = 'img.jpg';//+shortid.generate()+".jpg";
        var filename = './' + location;
        fs.writeFile(location, new Buffer(base64Data, "base64"), function (err) {
            if (err) console.log("FileCreationError: " + err);
            console.log("filename created: " + filename);

            /**Google req*/
            googleVision.detectLogos(filename, function (err, logo) {
                if (logo != undefined) {
                    var meta = new respTag('Google', 'Logo', logo[0]);
                    socket.emit('METADATA', meta);
                }
            });
            googleVision.detectLabels(filename, function (err, labs) {
                if (labs != undefined) {
                    var meta = new respTag('Google', 'Labels', labs);
                    socket.emit('METADATA', meta);
                }
            });
            googleVision.detectText(filename, function (err, text) {
                if (text != undefined) {
                    var meta = new respTag('Google', 'OCR', text[0]);
                    socket.emit('METADATA', meta);
                }
            });
            googleVision.detectProperties(filename, function (err, col) {
                if (col != undefined) {
                    var meta = new respTag('Google', 'Colors', col);
                    socket.emit('METADATA', meta);
                }
            });

            /**Cloudsight req*/
            var imgCloudsight = {
                image: location,
                locale: 'en-US'  //Todo Add TTL ?
            };
            cloudsight.request(imgCloudsight, true, function (err, resp) {
                if (resp != undefined) {
                    var meta = new respTag('Cloudsight', 'Descr', resp.name);
                    socket.emit('METADATA', meta);
                }
            });
        });

    });

    /**TODO handle disconnections from client*/
    socket.on('disconnect', function () {
        console.log("Meta left...");
    });

});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});