/**
 * Router.js
 *
 * In charge of static API - POST model*/

// create a new express router
const express      = require('express'),
    router         = express.Router(),
    balancer       = require('./middleware/balancer');

// export router
module.exports = router;

// define routes
router.get(['/', '/home'], balancer.showHome);
router.get('/post', balancer.postImg);
