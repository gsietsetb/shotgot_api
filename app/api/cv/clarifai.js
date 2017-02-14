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

const clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture", "ofense",
    "energy", "people", "house", "man", "family", "motion", "home", "room"];

module.exports.getLabels = (base64Data, socket, startTime) => {
    clarifai.models.predict(Clarifai.GENERAL_MODEL, base64Data/*{base64: base64Data}*/).then(function (resp) {
        const timeRx = Date.now();
        var labs = [];
        resp.outputs[0].data.concepts.forEach(function (elem) {
            if (elem.value > 0.8)
                labs.push(elem.name)
        });
        //Postprocess to clean unused data
        var meta = new Meta(enums.CV_API.API_CLARIFAI,
            enums.MetaTypes.TYPE_LABELS,
            arrExclude(labs, clarifai_blacklist), timeRx - startTime);
        socket.emit('METADATA', meta);
        return meta;
    });
};

module.exports.getColors = (base64Data, socket, startTime) => {
    clarifai.models.predict(Clarifai.COLOR_MODEL, base64Data/*{base64: base64Data}*/).then(function (resp) {
        const timeRx = Date.now();
        var cols = [];
        resp.outputs[0].data.colors.forEach((elem) => cols.push(elem.w3c.hex));
        var meta = new Meta(enums.CV_API.API_CLARIFAI,
            enums.MetaTypes.TYPE_COLORS, cols, timeRx - startTime);
        socket.emit('METADATA', meta);
        return meta;
    });
};

/**Clothing Model*/
module.exports.getClothing = (base64Data, socket, startTime) => {
    clarifai.models.predict("e0be3b9d6a454f0493ac3a30784001ff", base64Data/*{base64: base64Data}*/).then(function (resp) {
        const timeRx = Date.now();
        var meta = new Meta(enums.CV_API.API_CLARIFAI,
            enums.MetaTypes.TYPE_LABELS,
            unescape(resp.outputs[0].data.concepts[0].name));
        socket.emit('METADATA', meta, timeRx - startTime);
        return meta;
    });
};


