/**Todo Change to Restify*/
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;
server.listen(port, function(){
    console.log('Server listening at port %d', port);
});

'use strict';



/**Todo afterwards in order to implement a frontend
 app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});
 // Routing
 app.use(express.static(__dirname + '/public'));*/



//For Load-Balancers for general Multi-thread purposes
var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;
    console.log("User ["+numUsers+"] connected: ");//+socket.username);

    // when the client emits 'new message', this listens and executes
    socket.on('PIC_REQ', function (data) {
        // we store the username in the socket session for this client
        // socket.username = username;
        ++numUsers;
        addedUser = true;
        console.log("User emitting: "+data[60]);

        /**Clarifai req*/
        console.log("Sending data to Clarify: "+data[40]);
        clarifai
            .models
            .predict(Clarifai.GENERAL_MODEL, {base64: data})
            .then(
                function(resp) {
                    if (resp.status.description === 'Ok') {
                        var concepts = resp.rawData.outputs[0].data.concepts;
                        for(var i=0;i<=concepts.length;i++){
                            if(concepts[i].value>0.7
                                &&concepts[i].name!="no person"
                                &&concepts[i].name!="indoors"
                                &&concepts[i].name!="one"
                                &&concepts[i].name!="empty"
                                &&concepts[i].name!="furniture"
                                &&concepts[i].name!="room"
                            ){
                                socket.emit('CLARIFAI_CONCEPTS', concepts[i].name);
                                console.log(concepts[i].name);
                            }
                        }
                    } else {
                        console.log('Sorry, something is wrong.\n'+resp.status.description);
                    }            },
                function(err) {
                    console.log(err)
                });
        console.log("Req color to Clarify: "+data[40]);
        clarifai
            .models
            .predict(Clarifai.COLOR_MODEL, {base64: data})
            .then(
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
        // socket.emit('EVENT_MESSAGE', predictClarifai(data));

        console.log("Would be now asking to Google: ");

        /**GoogleCloud req
         console.log("Sending data to GoogleCloud: ");//+data);
         vision.detectLabels(data).then(
         function(results) {
                const labels = results[0];
                console.log("Google response: "+results);
                // labels.forEach((label) => console.log(label));
                socket.emit('res', results);
            },
         function(err) {
                console.error(err);
            }
         );*/
        console.log("Here would go Google's response ");

        /* we tell the client to execute 'new message'
         socket.broadcast.emit('new picReq', {
         username: socket.username,
         message: data
         });*/
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
            console.log("User left...");
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers

            });
        }
    });
});


/*Instance of CV APIs
 * TODO add (and fix) Blippar*/

/**Clarifai*/
var Clarifai = require('clarifai');
// initialize with your clientId and clientSecret
var clarifai = new Clarifai.App(
    'SieJMnA5BP4CkpL0YoXEGOEj7VKAGrH8VLZpD7zm',
    'QQLo9NTDvhg9R32nQaC8Fb-ogAZDyzD4YPushXH6'
);

function predictClarifai(imgBase64) {
    clarifai
        .models
        .predict(Clarifai.GENERAL_MODEL, {base64: imgBase64})
        .then(
            function(resp) {
                if (resp.status.description === 'Ok') {
                    return resp.rawData.outputs[0].data.concepts;
                    /**Todo get array?
                     var data = resp.rawData.outputs[0].data.concepts;
                     for(var i=0;i<=data.length;i++){
                        // var tags = data[i].name;//collectTags(data);
                        // tags = results[0].result.tag.classes;
                        console.log(tags);
                    }*/
                    socket.emit('EVENT_MESSAGE', response);
                } else {
                    console.log('Sorry, something is wrong.\n'+resp.status.description);
                }            },
            function(err) {
                console.log(err)
            });
}

/**Clodusight*/

/**Google Cloud Vision API*/
// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
// Your Google Cloud Platform project ID
const projectId = '1074207413557';
// Instantiates a client
const visionClient = Vision({
    projectId: projectId
});
const vision = Vision();