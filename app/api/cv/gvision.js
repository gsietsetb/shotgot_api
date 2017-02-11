/**
 * Created by gsierra on 10/02/17.
 */

const Google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const GoogleAuthFactory = new GoogleAuth();
const GoogleVision = require('@google-cloud/vision');
const googleVision = GoogleVision();


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
function getLogos(filename, socket) {
    googleVision.detectLogos(filename, function (err, logo) {
        if (logo != undefined) {
            const meta = new respTag('Google', 'Logo', logo[0]);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
}

function getLabels(filename, socket) {
    googleVision.detectLabels(filename, function (err, labs) {
        if (labs != undefined) {
            const meta = new respTag('Google', 'Labels', labs);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
}
function getText(filename, socket) {
    googleVision.detectText(filename, function (err, text) {
        if (text != undefined) {
            const meta = new respTag('Google', 'OCR', text[0]);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
}

function getColors(filename, socket) {
    googleVision.detectProperties(filename, function (err, col) {
        if (col != undefined) {
            const meta = new respTag('Google', 'Colors', col);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
}