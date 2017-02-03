var socket = require('socket.io-client')('http://shotgot.com:3000');
var request = require('request').defaults({ encoding: null });

function getBase64(){
    request.get('http://tinypng.org/images/example-shrunk-8cadd4c7.png', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
            // console.log(data);
            return new Buffer(body).toString('base64');
        }
    });
}

socket.on('connect', function(){
    socket.emit("EVENT_MESSAGE",getBase64());
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});