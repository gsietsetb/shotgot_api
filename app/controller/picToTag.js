/**
 * Created by gsierra on 28/02/17.
 */

let fs = require("fs");
let shortid = require('shortid');

/**CV APIs requires*/
let clarifai = require('./../api/cv/clarifai');
let msft = require('./../api/cv/msftCogn');
let gvision = require('./../api/cv/gvision');
let imagga = require('./../api/cv/imagga');
let Promise = require("bluebird");
// let cloudsight = require('./../api/cv/cloudsight');

// class picToTag {
    /**
     * Wrapper for each of the CV API's
     * @param {string}            URL       Absolute URI of the img
     * @param {Socket}            SocketIo  SocketIo object
     * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */
    module.exports.imgToTag = (socket, b64data) => {
        return new Promise((resolve, reject) => {
            /**TODO implement my own reject*/
            let mMetaArray = [];
            /**Asserts correct file creaetion*/
            FileURI.safeAndGetImgUrl(b64data)
                .then(function (fileLoc) {
                    // /**Clarifai req*/
                    // clarifai.getLabels(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    // .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    // clarifai.getColors(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    // clarifai.getClothing(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    //
                    // /**Google req
                    //  * note the use of 'localURIexplicit'
                    //  * rather than 'publicURI'*/
                    // gvision.getLogos(fileLoc.localURIexplicit)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    // gvision.getLabels(fileLoc.localURIexplicit)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    // gvision.getColors(fileLoc.localURIexplicit)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    // gvision.getText(fileLoc.localURIexplicit)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id))
                    //     .catch((err)=> console.log("DAMN! REJ ERR GOT: "+mMetaArray.toString()+err));
                    //
                    // /**Imagga req*/
                    // imagga.getTags(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id));
                    // imagga.getColors(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata, socket, mMetaArray, fileLoc.id));

                    /**Microsoft Cognitive req*/
                    let msftTagArray = msft.getDescr(fileLoc.publicURI);
                    if (msftTagArray != undefined)
                        console.log("wrap error: " + JSON.parse(msftTagArray));
                        msftTagArray.forEach(function (elem) {
                            onResp(elem, socket, mMetaArray, fileLoc.id);
                        });

                    /**Cloudsight req*/
                    // cloudsight.getDescr(fileLoc.publicURI)
                    //     .then((metadata) => onResp(metadata,socket,mMetaArray,fileLoc.id));

                })
                .finally(function () {
                    resolve(mMetaArray);
                });
        });
    };

/**
 * Delegates the emit function of the socket
 * just after receiving the response
 * and stores the data in a metaTag Array
 * @param {string}            URL       Absolute URI of the img
 * @param {Socket}            SocketIo  SocketIo object
 * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
 */
function onResp(mMeta, socket, mMetaArray) {
    mMeta.setReqId(shortid);
    socket.emit('METADATA', mMeta);
    mMetaArray.push(mMeta);
    // mMetaArray.forEach(function (elem) {
    //     console.log("UNTIL NOW: "+JSON.stringify(elem));
    // })
};

class FileURI {
    constructor() {
        this.id = shortid.generate();
        this.localURI = 'public/uploads/' + this.id + '.jpg';
        this.localURIexplicit = './' + this.localURI;  //Required by Google
        this.publicURI = 'https://shotgot.com/' + this.localURI;
    }

    /**
     /**Convert data64 into a file saved into a public folder
     * @param {string}            URL       Absolute URI of the img
     * @param {Socket}            SocketIo  SocketIo object
     * * @return {URL} Img public URL
     */
    static safeAndGetImgUrl(b64data) {
        return new Promise((resolve, reject) => {
            let fileLoc = new FileURI();
            fs.writeFile(fileLoc.localURI, new Buffer(b64data, "base64"), function (err) {
                if (err) {
                    console.log("FileCreationError: " + err);
                    reject(err);
                } else {
                    console.log("filename created: " + fileLoc.localURI + " in " + fileLoc.publicURI);
                    resolve(fileLoc);
                }
            });
        });
    }
}
;





