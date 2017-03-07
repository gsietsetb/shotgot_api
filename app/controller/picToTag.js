/**
 * Created by gsierra on 28/02/17.
 */

let fs = require("fs");
let shortid = require('shortid');

/**CV APIs requires*/
let clarifai = require('./../api/cv/clarifai');
// let cloudsight = require('./../api/cv/cloudsight');
let msft = require('./../api/cv/msftCogn');
let gvision = require('./../api/cv/gvision');
let imagga = require('./../api/cv/imagga');
let Promise = require("bluebird");

class PicToTag {
    /**
     * Delegates the emit function of the socket
     * just after receiving the response
     * and stores the data in a metaTag Array
     * @param {string}            URL       Absolute URI of the img
     * @param {Socket}            SocketIo  SocketIo object
     * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */
    onResp(mMeta, socket, mMetaArray) {
        mMeta.setReqId(shortid);
        socket.emit('METADATA', mMeta);
        mMetaArray.push(mMeta);
    }

    /**
     * Wrapper for each of the CV API's
     * @param {string}            URL       Absolute URI of the img
     * @param {Socket}            SocketIo  SocketIo object
     * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */
    imgToTag(socket, b64data) {
        return new Promise((resolve, reject) => {
            let mMetaArray = [];
            /**Asserts correct file creaetion*/
            safeAndGetImgUrl(b64data)
                .then(function (fileLoc) {
                    /**Clarifai req*/
                    clarifai.getLabels(fileLoc.publicURI)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    clarifai.getColors(fileLoc.publicURI)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    clarifai.getClothing(fileLoc.publicURI)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));

                    /**Google req
                     * note the use of 'localURIexplicit'
                     * rather than 'publicURI'*/
                    gvision.getLogos(fileLoc.localURIexplicit)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    gvision.getLabels(fileLoc.localURIexplicit)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    gvision.getColors(fileLoc.localURIexplicit)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    gvision.getText(fileLoc.localURIexplicit)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));

                    /**Imagga req*/
                    imagga.getTags(fileLoc.publicURI)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));
                    imagga.getColors(fileLoc.publicURI)
                        .then((metadata) => this.onResp(metadata, socket, mMetaArray, fileLoc.id));

                    /**Microsoft Cognitive req*/
                    let msftTagArray = msft.getDescr(fileLoc.publicURI);
                    if (msftTagArray != undefined)
                        msftTagArray.forEach(function (elem) {
                            this.onResp(elem, socket, mMetaArray, fileLoc.id);
                        });

                    /**Cloudsight req*/
                    // cloudsight.getDescr(fileLoc.publicURI)
                    //     .then((metadata) => this.onResp(metadata,socket,mMetaArray,fileLoc.id));

                })
                .finally(function () {
                    resolve(mMetaArray);
                });
            /**TODO implement my own reject*/
        });
    }
}

class FileURI {
    constructor() {
        this.id = shortid.generate();
        this.localURI = 'public/uploads/' + this.id + '.jpg';
        this.localURIexplicit = './' + location;  //Required by Google
        this.publicURI = 'https://shotgot.com/' + location;
    }

    /**
     /**Convert data64 into a file saved into a public folder
     * @param {string}            URL       Absolute URI of the img
     * @param {Socket}            SocketIo  SocketIo object
     * * @return {URL} Img public URL
     */
    safeAndGetImgUrl(b64data) {
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

module.exports = PicToTag;




