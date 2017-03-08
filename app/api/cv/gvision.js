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

GoogleAuthFactory.getApplicationDefault(
    (err, authClient) => {
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
module.exports.getLogos = (filepath) => {
    return new Promise((resolve, reject) => {
        googleVision.detectLogos(filepath,
            (err, logo) => {
                if (err)
                    reject(err);
                else if (logo[0] != undefined) {
                    resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                        enums.TagType.TYPE_LOGO,
                        logo[0]));
                }
            });
    });
};

module.exports.getLabels = (filepath) => {
    return new Promise((resolve, reject) => {
        googleVision.detectLabels(filepath,
            (err, labs) => {
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

module.exports.getText = (filepath) => {
    return new Promise((resolve, reject) => {
        googleVision.detectText(filepath,
            (err, text) => {
                if (err)
                    reject(err);
                else if (text[0] != undefined) {
                    resolve(new Meta(enums.VisionAPI.API_GOOGLE,
                        enums.TagType.TYPE_OCR,
                        text[0]));
                }
            });
    });
};

module.exports.getColors = (filepath) => {
    return new Promise((resolve, reject) => {
        googleVision.detectProperties(filepath,
            (err, col) => {
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