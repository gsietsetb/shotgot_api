'use strict';

// load environment variables
require('dotenv').config();

// call the required packages
const app =     require('express')(),
    server =    require('http').createServer(app),
    io =        require('socket.io')(server),
    picToTag =  require("./app/controller/picToTag.js"),

    //Server Side
    port = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', (base64Data) => {
        console.log("User emitting: ");

        /**After receiving the img as base64 data
         * from the phone, it gets tags and metadata*/
        picToTag.imgToTag(base64Data, socket)
            .then((metaArray) => console.log(JSON.stringify(metaArray))) //seems to be TODO since is returned not full*/)
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