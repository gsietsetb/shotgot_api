/**
 * Created by gsierra on 10/02/17.
 */

const Google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const GoogleAuthFactory = new GoogleAuth();
const GoogleVision = require('@google-cloud/vision');
const googleVision = GoogleVision();
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');

GoogleAuthFactory.getApplicationDefault(function (err, authClient) {
    if (err) {
        console.log('Authentication failed because of ', err);
        return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
        authClient = authClient.createScoped(scopes);
    }
});

/**Tag Getters*/
module.exports.getLogos = (filename, socket, startTime) => {
    googleVision.detectLogos(filename, function (err, logo) {
        if (logo != undefined) {
            const timeRx = Date.now();
            const meta = new Meta(enums.CV_API.API_GOOGLE, enums.MetaTypes.TYPE_LOGO, logo[0]);
            socket.emit('METADATA', meta, timeRx - startTime);
            return meta;
        }
    });
};

module.exports.getLabels = (filename, socket, startTime) => {
    googleVision.detectLabels(filename, function (err, labs) {
        if (labs != undefined) {
            const timeRx = Date.now();
            const meta = new Meta(enums.CV_API.API_GOOGLE, enums.MetaTypes.TYPE_LABELS, labs);
            socket.emit('METADATA', meta, timeRx - startTime);
            return meta;
        }
    });
};
module.exports.getText = (filename, socket, startTime) => {
    googleVision.detectText(filename, function (err, text) {
        if (text != undefined) {
            const timeRx = Date.now();
            const meta = new Meta(enums.CV_API.API_GOOGLE, enums.MetaTypes.TYPE_OCR, text[0]);
            socket.emit('METADATA', meta, timeRx - startTime);
            return meta;
        }
    });
};
module.exports.getColors = (filename, socket, startTime) => {
    googleVision.detectProperties(filename, function (err, col) {
        if (col != undefined) {
            const timeRx = Date.now();
            const meta = new Meta(enums.CV_API.API_GOOGLE, enums.MetaTypes.TYPE_COLORS, col.colors);
            socket.emit('METADATA', meta, timeRx - startTime);
            return meta;
        }
    });
};