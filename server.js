'use strict';

require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");

/**APIs requires*/
/**CV requires*/
const clarifai = require('./app/api/cv/clarifai.js');
const cloudsight = require('./app/api/cv/cloudsight.js');
const gvision = require('./app/api/cv/gvision.js');
/**Affiliate Programs requires*/
const amazon = require('./app/api/affiliate/amazon.js');

let metadata = {};
// const debug = true;
const port = process.env.PORT || 3001;
const location = 'public/uploads/img.jpg';//+shortid.generate()+".jpg";
const filename = './' + location;

io.on('connection', function (socket) {
    console.log("Meta connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        console.log("Meta emitting: ");

        /**Clarifai req*/
        metadata.push(clarifai.getLabels(base64Data, socket));
        metadata.push(clarifai.getColors(base64Data, socket));
        metadata.push(clarifai.getClothing(base64Data, socket));

        /**Convert data64 into a file (needed by some APIs)*/

        fs.writeFile(location, new Buffer(base64Data, "base64"), function (err) {
            if (err) console.log("FileCreationError: " + err);
            console.log("filename created: " + filename);

            /**Google req*/
            metadata.push(gvision.getLogos(filename, socket));
            metadata.push(gvision.getLabels(filename, socket));
            metadata.push(gvision.getColors(filename, socket));
            metadata.push(gvision.getText(filename, socket));

            /**Cloudsight req*/
            metadata.push(cloudsight.getDescr(location, socket));
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