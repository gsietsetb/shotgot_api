/**
 * Created by gsierra on 10/02/17.
 */

const arrExclude = require('arr-exclude');
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');
const Clarifai = require('clarifai');
const clarifai = new Clarifai.App(
    process.env.CLARIFAI_ID,
    process.env.CLARIFAI_SECRET
);

const clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture",
    "ofense", "energy", "people", "house", "man", "family", "motion", "home",
    "room", "business", "technology", "money", "still life", "finance", "travel",
    "internet", "computer", "medicine", "commerce", "security", "industry",
    "education", "pill", "telephone", "electronics", "banking"];

module.exports.getLabels = (base64Data, socket, startTime) => {
    clarifai.models.predict(Clarifai.GENERAL_MODEL, base64Data/*{base64: base64Data}*/).then(function (resp) {
        let labs = [];
        resp.outputs[0].data.concepts.forEach(function (elem) {
            // console.log(elem.name+" CLRF: "+elem.value);
            if (elem.value > 0.9)
                labs.push(elem.name);
        });
        //Postprocess to clean unused data
        const meta = new Meta(enums.VisionAPI.API_CLARIFAI,
            enums.TagType.TYPE_TAGS,
            arrExclude(labs, clarifai_blacklist),
            Date.now() - startTime);
        socket.emit('METADATA', meta);
        return meta;
    });
};

module.exports.getColors = (base64Data, socket, startTime) => {
    clarifai.models.predict(Clarifai.COLOR_MODEL, base64Data/*{base64: base64Data}*/).then(function (resp) {
        let cols = [];
        resp.outputs[0].data.colors.forEach((elem) => cols.push(elem.w3c.hex));
        const meta = new Meta(enums.VisionAPI.API_CLARIFAI,
            enums.TagType.TYPE_COLORS, cols,
            Date.now() - startTime);
        socket.emit('METADATA', meta);
        return meta;
    });
};

/**Clothing Model*/
module.exports.getClothing = (base64Data, socket, startTime) => {
    clarifai.models.predict("e0be3b9d6a454f0493ac3a30784001ff", base64Data/*{base64: base64Data}*/).then(function (resp) {
        const meta = new Meta(enums.VisionAPI.API_CLARIFAI,
            enums.TagType.TYPE_TAG,
            unescape(resp.outputs[0].data.concepts[0].name),
            Date.now() - startTime);
        socket.emit('METADATA', meta);
        return meta;
    });
};


