/**Todo Change to Restify*/
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Server listening at port %d', port);
});

/**Todo afterwards in order to implement a frontend
app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});
// Routing
app.use(express.static(__dirname + '/public'));*/


/*Instance of CV APIs
 * TODO add (and fix) Blippar*/

/**Clarifai*/
var Clarifai = require('clarifai');
  // initialize with your clientId and clientSecret
  var clarifai = new Clarifai.App(
    'SieJMnA5BP4CkpL0YoXEGOEj7VKAGrH8VLZpD7zm',
    'QQLo9NTDvhg9R32nQaC8Fb-ogAZDyzD4YPushXH6'
  );

/**Clodusight*/

/**Google Cloud Vision API*/
'use strict';
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';
// Instantiates a client
const visionClient = Vision({
    projectId: projectId
});

// The name of the image file to annotate
const fileName = './resources/wakeupcat.jpg';

// Performs label detection on the image file
visionClient.detectLabels(fileName).then((results) => {
    labels = results[0];

console.log('Labels:');
labels.forEach((label) => console.log(label));
});

//For Load-Balancers for general Multi-thread purposes
var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new picReq', function (data) {
        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;

        /**Clarifai req*/
        clarifai.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg').then(
            function(response) {
                console.log(response);
                socket.emit('login', response);
            },
            function(err) {
                console.error(err);
            }
        );

        // we tell the client to execute 'new message'
        socket.broadcast.emit('new picReq', {
            username: socket.username,
            message: data
        });
    });


    /**Not really required anymore...
    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });*/

    // when the user disconnects.. perform this
    /**TODO handle disconnections from client*/
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});