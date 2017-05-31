/**
 * Socket.js
 * In charge of routing the incoming socket clients */

const server    = require("../server"),
      io        = require('socket.io')(server),
      picToTag  = require("./controller/picToTag.js");

io.on('connection', (socket) => {
    console.log("User connected: ");
    // when the client emits 'PIC_REQ', this listens and executes
    socket.on('PIC_REQ', (base64Data) => {
        console.log("User emitting through Socket: ");

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