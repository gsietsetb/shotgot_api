// const cognitiveServices = require('cognitive-services');
//
// const msftCV = cognitiveServices.computerVision({
//     API_KEY: process.env.MSFT_SECRET
// });

var rp = require('request-promise');

const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');
// const body = {"url":location};
// const parameters = {"visualFeatures": "Tags, Color, Description, Categories"};
const request = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?' +
    'visualFeatures=Color,Tags,Description&language=en';

module.exports.getDescr = (location, socket, startTime) => {
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
    rp(options)
        .then((resp) => {
            // const resp = JSON.parse(body);
            if (resp != undefined) {
                const metaArray = [];
                /**Color*/
                const metaCol = new Meta(enums.VisionAPI.API_MICROSOFT,
                    enums.TagType.TYPE_COLORS,
                    resp.color.accentColor, Date.now() - startTime);
                socket.emit('METADATA', metaCol);
                metaArray.push(metaCol);

                /**Tag*/
                let tags = [];
                resp.tags.forEach(function (elem) {
                    if (elem.confidence > 0.2)
                        tags.push(elem.name);
                });
                const metaTag = new Meta(enums.VisionAPI.API_MICROSOFT,
                    enums.TagType.TYPE_TAGS,
                    tags,
                    Date.now() - startTime);
                socket.emit('METADATA', metaTag);
                metaArray.push(metaTag);

                /**DescriptionTag*/
                let tagDescr = [];
                resp.description.tags.forEach(function (elem) {
                    tagDescr.push(elem);
                });
                const metaTagDescr = new Meta(enums.VisionAPI.API_MICROSOFT,
                    enums.TagType.TYPE_TAGS,
                    tagDescr,
                    Date.now() - startTime);
                socket.emit('METADATA', metaTagDescr);
                metaArray.push(metaTagDescr);

                /**DescriptionText*/
                const metaText = new Meta(enums.VisionAPI.API_MICROSOFT,
                    enums.TagType.TYPE_DESCR,
                    resp.description.captions[0].text,
                    Date.now() - startTime);
                socket.emit('METADATA', metaText);
                metaArray.push(metaText);

                return metaArray;
            }
            // POST failed...
        }).catch(function (err) {
        throw err;
    });
};