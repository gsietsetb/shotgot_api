'use strict';

// load environment variables
require('dotenv').config();

// call the required packages
const app           = require('express')(),
    express         = require('express'),
    // pug             = require('pug'),
    server          = require('http').createServer(app),

    //Server Side
    port = process.env.PORT || 3001;

    // tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

// set ejs as our templating engine
// app.set('view engine', 'pug');

// ROUTES FOR OUR STATIC API
app.use(require('./app/routes'));

// Socket.io balancing
// app.use(require('./app/socket'));

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});