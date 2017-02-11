/**
 * Created by gsierra on 10/02/17.
 */

const arrExclude = require('arr-exclude');
const Clarifai = require('clarifai');
const clarifai = new Clarifai.App(
    process.env.CLARIFAI_ID,
    process.env.CLARIFAI_SECRET
);
const clarifai_blacklist = ["no person", "indoors", "one", "empty", "furniture", "ofense",
    "energy", "people", "house", "man", "family", "motion", "home", "room"];

function getLabels(base64Data, socket) {
    clarifai.models.predict(Clarifai.GENERAL_MODEL, {base64: base64Data}).then(function (resp) {
        var labs = [];
        resp.outputs[0].data.concepts.forEach(function (elem) {
            if (elem.value > 0.8)
                labs.push(elem.name)
        });
        //Postprocess to clean unused data
        var meta = new respTag('Clarifai', 'Labels', arrExclude(labs, clarifai_blacklist));
        socket.emit('METADATA', meta);
        return meta;
    });
}

function getColors(base64Data, socket) {
    clarifai.models.predict(Clarifai.COLOR_MODEL, {base64: base64Data}).then(function (resp) {
        var cols = [];
        resp.outputs[0].data.colors.forEach((elem) => cols.push(elem.w3c.hex));
        var meta = new respTag('Clarifai', 'Colors', cols);
        socket.emit('METADATA', meta);
        return meta;
    });
}

/**Clothing Model*/
function getClothing(base64Data, socket) {
    clarifai.models.predict("e0be3b9d6a454f0493ac3a30784001ff", {base64: base64Data}).then(function (resp) {
        var meta = new respTag('Clarifai', 'Categories', unescape(resp.outputs[0].data.concepts[0].name));
        socket.emit('METADATA', meta);
        return meta;
    });
}

