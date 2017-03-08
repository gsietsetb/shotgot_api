'use strict';

require('dotenv').config();
let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);


/**Affiliate Programs requires*/
/**TODO to move away to app/controller/tagToItem*/
// const amazon = require('./app/api/affiliate/amazon');
// const aliexpress = require('./app/api/affiliate/aliexpress');
let picToTag = require("./app/controller/picToTag.js");

// const debug = true;
const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', (base64Data) => {
        console.log("User emitting: ");
        picToTag.imgToTag(base64Data, socket)
            .then(/**(metaArray) => ) //seems to be TODO since is returned not full*/)
            .catch((err) => {
                console.log("Server Err: " + err);
            });
    });

    /**TODO handle disconnections from client*/
    socket.on('disconnect', () => {
        /**Print overall results*/
        console.log("User left...");
    });
});

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});