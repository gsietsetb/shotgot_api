// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

// configure app to use bodyParser()-> get the data from a POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// conf mongoose for MongoDB Database
var mongoose   = require('mongoose');
// mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
// mongoose.connect('mongodb://gsierra:<pass>@jello.modulusmongo.net:27017/Y3sotoqe'); // connect to our database
mongoose.connect('mongodb://localhost/collection');

// Conf BEAR
var Bear = require('./bear');

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR cv_api
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({message: 'hooray! welcome to our cv_api!'});
});

// more routes for our cv_api will happen here

// routes ending in /bears
// ----------------------------------------------------
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var bear = new Bear();		// create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })

    // delete the bear with this id
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /cv_api
app.use('/cv_api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
