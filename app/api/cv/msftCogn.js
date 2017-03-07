// const cognitiveServices = require('cognitive-services');
//
// const msftCV = cognitiveServices.computerVision({
//     API_KEY: process.env.MSFT_SECRET
// });

let req = require('request-promise');
let Meta = require('./../../models/meta');
let enums = require('./../../models/enums');
// const body = {"url":location};
// const parameters = '{"visualFeatures": "Tags, Color, Description, Categories"}';
let a = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/describe[?maxCandidates]'
const request = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?' +
    'visualFeatures=Color,Tags,Description,Categories' +//parameters+//
    '&language=en';

module.exports.getDescr = (location) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.MSFT_SECRET
            },
            uri: request,
            qs: {
                maxCandidates: 1
            },
            body: {
                url: location
            },
            json: true // Automatically stringifies the body to JSON
        };
        req.get(options)
            .then((resp) => {
                console.log("MSGT: " + resp);
                if (resp != undefined) {
                    let metaArray = [];
                    /**Color*/
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_COLORS,
                        resp.color.accentColor));

                    /**Tag*/
                    let tags = [];
                    resp.tags.forEach(function (elem) {
                        if (elem.confidence > 0.2)
                            tags.push(elem.name);
                    });
                    metaArray.push(new Meta(enums.VisionAPI.API_MICROSOFT,
                        enums.TagType.TYPE_TAGS,
                        tags));

                    /**DescriptionTag*/
                    let tagDescr = [];
                    resp.description.tags.forEach(function (elem) {
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
            });
        // .catch((err) => {                // POST failed...
        //     reject(err)
        // });
    });
};