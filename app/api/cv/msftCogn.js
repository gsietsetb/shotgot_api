// let cognitiveServices = require('cognitive-services');
// let computerVision = cognitiveServices.computerVision({
//     API_KEY: process.env.MSFT_SECRET
// });
// let Meta = require('./../../models/meta');
// let enums = require('./../../models/enums');
//
// const parameters = {
//     visualFeatures: "Categories, Tags, Color, Description"
// };
// module.exports.getDescr = (location) => {
//     const body = {"url":location};
//
//     return new Promise((resolve, reject) => {
//         computerVision.analyzeImage({
//             parameters,
//             body,
//         })
//             .then((response) => {
//                 console.log('Got response', response);
//                 console.log("MSGT: " + resp);
//                 if (resp != undefined) {
//                     let metaArray = [];
//                     /**Color*/
//                     metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
//                         enums.TagType.TYPE_COLORS,
//                         resp.color.accentColor));
//
//                     /**Tag*/
//                     let tags = [];
//                     resp.tags.forEach(function (elem) {
//                         if (elem.confidence > 0.2)
//                             tags.push(elem.name);
//                     });
//                     metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
//                         enums.TagType.TYPE_TAGS,
//                         tags));
//
//                     /**DescriptionTag*/
//                     let tagDescr = [];
//                     resp.description.tags.forEach(function (elem) {
//                         tagDescr.push(elem);
//                     });
//                     metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
//                         enums.TagType.TYPE_TAGS,
//                         tagDescr));
//
//                     /**DescriptionText*/
//                     metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
//                         enums.TagType.TYPE_DESCR,
//                         resp.description.captions[0].text));
//
//                     /**Resolves the whole array of meta tags*/
//                     resolve(metaArray);
//                 }
//             })
//             .catch((err) => {
//                 console.error('Encountered error making request:', err);
//                 reject(err);
//             });
//     });
// };

const req = require('request-promise');
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');
const util = require('util');

// const body = {"url":location};
// const parameters = '{"visualFeatures": "Tags, Color, Description, Categories"}';
const request = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?' +
    'visualFeatures=Color,Tags,Description,Categories' +//parameters+//
    '&language=en';

module.exports.getDescr = (location) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {'Ocp-Apim-Subscription-Key': process.env.MSFT_SECRET},
            uri: request,
            qs: {maxCandidates: 1},
            body: {url: location},
            json: true // Automatically stringifies the body to JSON
        };
        req(options)
            .then((resp) => {
                if (resp != undefined) {
                    let metaArray = [];
                    /**Color*/
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_COLORS,
                        resp.color.accentColor));

                    /**@deprecated
                     /**Tag
                    let tags = [];
                    resp.tags.forEach((elem) => {
                        if (elem.confidence > 0.2)
                            tags.push(elem.name);
                    });
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_TAGS,
                     tags));*/

                    /** DescriptionTag*/
                    let tagDescr = [];
                    resp.description.tags.forEach((elem) => {
                        tagDescr.push(elem);
                    });
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_TAGS,
                        tagDescr));

                    /**DescriptionText*/
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_DESCR,
                        resp.description.captions[0].text));

                    /**Resolves the whole array of meta tags*/
                    resolve(metaArray);
                }
            })
            .catch((err) => {                // POST failed...
                reject(err)
            });
    });
};

const ocrReq = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=unk&detectOrientation =true';

module.exports.getOCR = (location) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {'Ocp-Apim-Subscription-Key': process.env.MSFT_SECRET},
            uri: ocrReq,
            body: {url: location},
            json: true // Automatically stringifies the body to JSON
        };
        req(options)
            .then((resp) => {
                /**OCR*/
                let lineOCR = resp.regions[0];
                if (lineOCR != undefined) {
                    let OCR = [];
                    lineOCR.lines.forEach((line) => {
                        line.words.forEach((word) => {
                            OCR.push(word.text);
                        });
                    });
                    resolve(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_OCR,
                        OCR));
                }
            })
            .catch((err) => {  // POST failed...
                reject(err)
            });
    });
};