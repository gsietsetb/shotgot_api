'use strict';

require('dotenv').config();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var filename = './img.jpg';
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

// googleVision.detectProperties(filename, function(err, faces) {
//     console.log(faces);
// });

io.on('connection', function (socket) {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        console.log("User emitting: ");

        /**Convert data64 into a file (needed by some APIs)*/
        // console.log("filename created: "+ filename);

        fs.writeFile("img.jpg",  new Buffer(base64Data, "base64"), function(err) {
            if(err) console.log("FileCreationError: "+ err);

            /**Google req*/
            console.log("Sending data to Google: ");
            googleVision.detectLogos(filename).then(
                function(resp) {
                    const logos = resp[0];
                    // console.log('Logos:');
                    // logos.forEach((logo) => console.log(logo);
                    socket.emit('GOOGLE_LOGOS', logos);
                    console.log("GoogleLogo: "+ logos);
                }, function(err) {
                    console.log("GoogleLogoError: "+ err);
                });
            googleVision.detectLabels(filename).then(
                function(resp) {
                    const labels = resp[0];
                    socket.emit('GOOGLE_LABELS', labels);
                    console.log("GoogleLabel: "+labels);
                }, function(err) {
                    console.log("GoogleLabelError: "+ err);
                });
            googleVision.detectText(filename).then(
                function(resp) {
                    const text = resp[0];
                    socket.emit('GOOGLE_TEXT', text);
                    console.log("GoogleText: "+text);
                }, function(err) {
                    console.log("GoogleTextError: "+ err);
                });
            /**Cloudsight req*/
            console.log("Sending data to Cloudsight: "+base64Data[40]);

            var imgCloudsight = {
                image: '/img.jpg',
                locale: 'en-US'  //Todo Add TTL ?
            };
            cloudsight.request (imgCloudsight, true, function(err, resp) {
                if (err) {
                    console.log ("Cloudsight error: "+err);
                    return;
                }
                if (resp.status === 'completed') {
                    console.log(resp.name);
                    socket.emit('CLOUDSIGHT', resp.name);
                } else {
                    console.log('Sorry, something is wrong.\n'+resp.status);
                }
            });
        });

        /**Clarifai req*/
        console.log("Sending data to Clarify: "+base64Data[40]);
        clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data}).then(
            function(resp) {
                //resp.getOuputInfo()

                //Blacklist as array.notincase()
                var clarifai_blacklist = [ "no person", "indoors", "one", "empty", "furniture"];
                if (resp.status.description === 'Ok') {
                    //TODO ToBeChanged... FOREACH
                    var concepts = resp.rawData.outputs[0].data.concepts;
                    for(var i=0;i<=concepts.length;i++){
                        if(concepts[i].value>0.7){
                            //Foreach
                            socket.emit('CLARIFAI_CONCEPTS', concepts[i].name);
                            console.log("Clarifai: "+concepts[i].name);
                        }
                    }
                } else {
                    console.log('Sorry, something is wrong.\n'+resp.status.description);
                }            },
            function(err) {
                console.log(err)
            });

        console.log("Req color to Clarify: "+base64Data[40]);
        clarifai.models.predict(Clarifai.COLOR_MODEL, {base64: base64Data}).then(
            function(resp) {
                if (resp.status.description === 'Ok') {
                    var col = resp.rawData.outputs[0].data.colors;
                    for(var i=0;i<=col.length;i++){
                        // if(col[i].value>0.5)
                        socket.emit('CLARIFAI_COLOR', col[i].w3c.hex);
                        console.log(col[i].w3c.hex);
                    }
                } else {
                    console.log('Sorry, something is wrong.\n'+resp.status.description);
                }            },
            function(err) {
                console.log(err)
            });
    });

    /**TODO handle disconnections from client*/
    socket.on('disconnect', function () {
        console.log("User left...");
    });
});