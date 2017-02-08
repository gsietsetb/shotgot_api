'use strict';

require('dotenv').config();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var filename = './img.jpg';
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
var cloudsight = require ('cloudsight') ({
    apikey: process.env.CLOUDSIGHT_KEY
});

var Google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var GoogleAuthFactory = new GoogleAuth();
const GoogleVision = require('@google-cloud/vision');
const googleVision = GoogleVision();

var port = process.env.PORT || 3001;
server.listen(port, function(){
    console.log('Server listening at port %d', port);
});

GoogleAuthFactory.getApplicationDefault(function(err, authClient) {
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
function respTag(API,type,resp){
    var data;
    console.log("This is the actual response: "+resp);
    switch(API) {
        case "Google":
            data = resp;
            break;
        case "Clarifai":
            //Todo: make it collaborative or self learning shared list
            var clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture"];
            if (resp.status.description === 'Ok') {
                //TODO ToBeChanged to getOutuputData function instead,
                // check https://sdk.clarifai.com/js/latest/Model.html#getOutputInfo
                console.log("Within constructor. This should be an array: "+resp.getOutputInfo());

                data = (type=='Labels') ?
                    arrExclude(resp.rawData.outputs[0].data.concepts.forEach.name, clarifai_blacklist) :
                    resp.rawData.outputs[0].data.colors.forEach.w3c.hex;

                //TODO ToBe @deprecated  + if(concepts[i].value>0.7){
                console.log("Pre filtered tags:  " + preFilterTags + "\nPost filtered tags: " + data);
            }
            break;
        case "Cloudsight":
            // if (resp.status == 'completed')
                data = resp.name;
            break;
        default: //Assuming case for google
            data = resp; //SHould not happen
            console.log("Default swtich case, should never happpen..."+err);
    }
    this.respTag = {
        id: shortid.generate(),
        API: API,
        type: type,
        data: data
    };
}

io.on('connection', function (socket) {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        console.log("User emitting: ");

        /**Convert data64 into a file (needed by some APIs)*/
        // console.log("filename created: "+ filename);

        fs.writeFile("img.jpg",  new Buffer(base64Data, "base64"), function(err) {
            if(err) console.log("FileCreationError: "+ err);

            /**TODO remove from within fs writer when possible*/

            /**Google req*/
            googleVision.detectLogos(filename, function(resp){
                const aux = resp[0];
                onResp(new respTag('Google','Logo',aux),null);
            });
            googleVision.detectLabels(filename, function(resp){
                onResp(new respTag('Google','Labels',resp));
            });
            googleVision.detectText(filename, function(resp){
                onResp(new respTag('Google','OCR',resp));
            });
            googleVision.detectProperties(filename, function(resp){
                onResp(new respTag('Google','Colors',resp));
            });

            /**Cloudsight req*/
            var imgCloudsight = {
                image: './img.jpg',
                locale: 'en-US'  //Todo Add TTL ?
            };
            // cloudsight.request(imgCloudsight, true, function(err, data) {
            //     // onResp(new respTag('Cloudsight','Text',data),err);
            //     console.log("This si data: "+data.stringify())
            // });
        });

        /**Clarifai req*/
        clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data}, function(resp, err) {
            onResp(new respTag('Clarifai','Labels',resp),err);
        });
        clarifai.models.predict(Clarifai.COLOR_MODEL, {base64: base64Data}, function(resp, err) {
            onResp(new respTag('Clarifai','Colors',resp),err);
        });
    });

    /**TODO handle disconnections from client*/
    socket.on('disconnect', function () {
        console.log("User left...");
    });

    /**
     * Process results obtained from different APIs into a JSON file
     * @param {JSON}         concepts    Object with keys explained below:
     * @return {void} A JSON that is fulfilled with Params
     */
    function onResp(tagJSON, err){
        if(debug){
            console.log(tagJSON.name+"Log: "+ tagJSON.data);
        }
        if(err)
            console.log(tagJSON.type+tagJSON.API+err);
        socket.emit('METADATA', tagJSON);
        /**Todo @fterwards: save img onto a DB*/
    }
});