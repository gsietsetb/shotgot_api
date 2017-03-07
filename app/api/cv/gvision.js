/**
 * Created by gsierra on 10/02/17.
 */

let Google = require('googleapis');
let GoogleAuth = require('google-auth-library');
let GoogleAuthFactory = new GoogleAuth();
let GoogleVision = require('@google-cloud/vision');
let googleVision = GoogleVision();
let Meta = require('./../../models/meta');
let enums = require('./../../models/enums');

GoogleAuthFactory.getApplicationDefault(function (err, authClient) {
    if (err) {
        console.log('Authentication failed because of ', err);
        return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        let scopes = ['https://www.googleapis.com/auth/cloud-platform'];
        authClient = authClient.createScoped(scopes);
    }
});

/**
 * class representing a collection of Google API cross-requests
 * @class
 */
module.exports.getLogos = (filename) => {
    return new Promise((resolve, reject) => {
        googleVision.detectLogos(filename, function (err, logo) {
            if (err)
                reject(err);
            else if (logo != undefined) {
                resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                    enums.TagType.TYPE_LOGO,
                    logo[0]));
            }
        });
    });
};

module.exports.getLabels = (filename) => {
    return new Promise((resolve, reject) => {
        googleVision.detectLabels(filename, function (err, labs) {
            if (err)
                reject(err);
            else if (labs != undefined) {
                resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                    enums.TagType.TYPE_TAGS,
                    labs));
            }
        });
    });

};

module.exports.getText = (filename) => {
    return new Promise((resolve, reject) => {
        googleVision.detectText(filename, function (err, text) {
            if (err)
                reject(err);
            else if (text != undefined) {
                resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                    enums.TagType.TYPE_OCR,
                    text[0]));
            }
        });
    });
};

module.exports.getColors = (filename) => {
    return new Promise((resolve, reject) => {
        googleVision.detectProperties(filename, function (err, col) {
            if (err)
                reject(err);
            else if (col != undefined) {
                resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                    enums.TagType.TYPE_COLORS,
                    col.colors));
            }
        });
    });
};