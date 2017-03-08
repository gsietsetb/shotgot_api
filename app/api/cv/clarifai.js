/**
 * Created by gsierra on 10/02/17.
 */

let arrExclude = require('arr-exclude');
let {Promise} = require('es6-promise');
let Meta = require('./../../models/meta');
let enums = require('./../../models/enums');
let Clarifai = require('clarifai');
let clarifai = new Clarifai.App(
    process.env.CLARIFAI_ID,
    process.env.CLARIFAI_SECRET
);

const clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture",
    "ofense", "energy", "people", "house", "man", "family", "motion", "home",
    "room", "business", "technology", "money", "still life", "finance", "travel",
    "internet", "computer", "medicine", "commerce", "security", "industry",
    "education", "pill", "telephone", "electronics", "banking"];

/**
 * Calls predict for Labels in Clarify
 * @param {string}            URL       Absolute URI of the img
 * @param {Socket}            SocketIo  SocketIo object
 * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
 */
module.exports.getLabels = (imgUrl) => {
    return new Promise((resolve, reject) => {
        /**TODO Test if faster with b64 data directly*/
        // clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data})
        clarifai.models.predict(Clarifai.GENERAL_MODEL, imgUrl)
            .then((resp) => {
                let labs = [];
                resp.outputs[0].data.concepts.forEach((elem) => {
                    if (elem.value > 0.9)
                        labs.push(elem.name);
                });
                //Includes postprocess to clean unused data
                resolve(new Meta(enums.VisionAPI.API_CLARIFAI,
                    enums.TagType.TYPE_TAGS,
                    arrExclude(labs, clarifai_blacklist)));
            })
            .catch(reject);
    });
};

/**
 * Calls predict for Colors in Clarify
 * @param {string}            imgUrl       Absolute URI of the img
 * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
 */
module.exports.getColors = (imgUrl) => {
    return new Promise((resolve, reject) => {
        clarifai.models.predict(Clarifai.COLOR_MODEL, imgUrl)
            .then((resp) => {
                let cols = [];
                resp.outputs[0].data.colors.forEach((elem) => cols.push(elem.w3c.hex));
                resolve(new Meta(enums.VisionAPI.API_CLARIFAI,
                    enums.TagType.TYPE_COLORS, cols));
            })
            .catch(reject);
    });
};

/**
 * Calls predict for Clothing Model in Clarify.
 * Not Really Accurated
 * @param {string}            imgUrl       Absolute URI of the img
 * * @return {Promise(resolve, reject)} A Promise that is fulfilled with the API response or rejected with an error
 */
module.exports.getClothing = (imgUrl) => {
    return new Promise((resolve, reject) => {
        clarifai.models.predict("e0be3b9d6a454f0493ac3a30784001ff", imgUrl)
            .then((resp) => {
                resolve(new Meta(enums.VisionAPI.API_CLARIFAI,
                    enums.TagType.TYPE_TAG,
                    decodeURI((resp.outputs[0].data.concepts[0].name))));
            })
            .catch(reject);
    });
};

