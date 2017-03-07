'use strict';

require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


/**Affiliate Programs requires*/
/**TODO to move away to app/controller/tagToItem*/
// const amazon = require('./app/api/affiliate/amazon');
// const aliexpress = require('./app/api/affiliate/aliexpress');
const imgToTag = require("./app/controller/picToTag.js").imgToTag;

// const debug = true;
const port = process.env.PORT || 3001;

io.on('connection', function (socket) {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', function (base64Data) {
        console.log("User emitting: ");
        imgToTag(socket, base64Data)
            .then((metaArray) => console.log(metaArray));
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