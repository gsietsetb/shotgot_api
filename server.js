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

let metadata = [];
// const debug = true;
const port = process.env.PORT || 3001;

const publicFileName = 'https://shotgot.com/images/img.jpg';
io.on('connection', function (socket) {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        const startTime = Date.now();
        const location = 'public/uploads/' + shortid.generate() + '.jpg';
        const filename = './' + location;
        console.log("User emitting: ");

        /**Convert data64 into a file saved (replaced) in a public reposiory*/
        fs.writeFile(location, new Buffer(base64Data, "base64"), function (err) {

            if (err) console.log("FileCreationError: " + err);
            console.log("filename created: " + filename + " in " + publicFileName);

            /**Cloudsight req*/
            console.log(cloudsight.getDescr(publicFileName, socket, startTime));

            /**Microsoft Cognitive req*/
            const msftTagArray = msft.getDescr(publicFileName, socket, startTime);
            if (msftTagArray != undefined)
                msftTagArray.forEach(function (elem) {
                    metadata.push(elem);
                });

            /**Google req*/
            console.log(gvision.getLogos(filename, socket, startTime));
            console.log(gvision.getLabels(filename, socket, startTime));
            console.log(gvision.getColors(filename, socket, startTime));
            console.log(gvision.getText(filename, socket, startTime));

            /**Imagga req*/
            console.log(imagga.getTags(publicFileName, socket, startTime));
            console.log(imagga.getColors(publicFileName, socket, startTime));

            /**Clarifai req*/
            console.log(clarifai.getLabels(publicFileName, socket, startTime));
            console.log(clarifai.getColors(publicFileName, socket, startTime));
            console.log(clarifai.getClothing(publicFileName, socket, startTime));

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