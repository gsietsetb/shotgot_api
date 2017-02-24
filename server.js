'use strict';

require('dotenv').config();
const shortid = require('shortid');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");

/**APIs requires*/
/**CV requires*/
const clarifai = require('./app/api/cv/clarifai');
const cloudsight = require('./app/api/cv/cloudsight');
const msft = require('./app/api/cv/msftCogn');
const gvision = require('./app/api/cv/gvision');
const imagga = require('./app/api/cv/imagga');
/**Affiliate Programs requires*/
const amazon = require('./app/api/affiliate/amazon');
const aliexpress = require('./app/api/affiliate/aliexpress');

// const debug = true;
const port = process.env.PORT || 3001;
//TODO add shortid.generate as a variable and use it to populate to each meta
const location = 'public/uploads/' + shortid.generate() + '.jpg';
const filename = './' + location;  //Required by Google
const publicFileName = 'https://shotgot.com/' + location;
var metadata = [];
io.on('connection', function (socket) {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        const startTime = Date.now();

        console.log("User emitting: ");

        /**Convert data64 into a file saved (replaced) in a public reposiory*/
        fs.writeFile(location, new Buffer(base64Data, "base64"), function (err) {

            if (err) console.log("FileCreationError: " + err);
            console.log("filename created: " + filename + " in " + publicFileName);

            /**Cloudsight req*/
            // console.log(cloudsight.getDescr(publicFileName, socket, startTime));

            /**Microsoft Cognitive req*/
            // var msftTagArray = msft.getDescr(publicFileName, socket, startTime);
            // if (msftTagArray != undefined)
            //     msftTagArray.forEach(function (elem) {
            //         metadata.push(elem);
            //     });

            /**Google req*/
            var auxgVlog = gvision.getLogos(filename, socket, startTime);
            metadata.push(auxgVlog);
            var gVtag = gvision.getLabels(filename, socket, startTime);
            metadata.push(gVtag);
            console.log("Going to add: " + gvision.getLabels(filename, socket, startTime));
            metadata.push(gvision.getColors(filename, socket, startTime));
            metadata.push(gvision.getText(filename, socket, startTime));

            /**Imagga req*/
            metadata.push(imagga.getTags(publicFileName, socket, startTime));
            metadata.push(imagga.getColors(publicFileName, socket, startTime));

            /**Clarifai req*/
            metadata.push(clarifai.getLabels(publicFileName, socket, startTime));
            metadata.push(clarifai.getColors(publicFileName, socket, startTime));
            metadata.push(clarifai.getClothing(publicFileName, socket, startTime));

        });
    });

    /**TODO handle disconnections from client*/
    socket.on('disconnect', function () {
        /**Print overall results*/
        console.log(JSON.stringify(metadata));
        console.log("User left...");
    });

});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});