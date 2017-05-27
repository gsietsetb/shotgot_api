/**
 * Created by gsierra on 28/02/17.
 */

"use strict";

/**Helpers & Utils*/
let fs = require("fs");
let shortid = require('shortid');
let Promise = require("bluebird");

/**CV APIs requires*/
let clarifai = require('./../api/cv/clarifai');
let msft = require('./../api/cv/msftCogn');
let gvision = require('./../api/cv/gvision');
let imagga = require('./../api/cv/imagga');
// let cloudsight = require('./../api/cv/cloudsight');

/**Global Variables*/
let sessionSocket;
let mMetaArray = [];

/**
 * Wrapper for each of the CV API's
 * @param {string}            b64data       Base64 Data compressed
 * @param {Socket}            socket  SocketIo object
 * * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
 */
module.exports.imgToTag = (b64data, socket) => {
    sessionSocket = socket;
    return new Promise((resolve, reject) => {
        /**Asserts correct file creaetion*/
        FileURI.saveB64toUrl(b64data)
            .then((fileLoc) => {
                /**When the file is created, its public URL is populated to ALL the CV APIs*/
                Promise.all([

                    /**Clarifai req*/
                    clarifai.getLabels(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log("ERR API: " + err)),
                    /**@deprecated*/
                    clarifai.getClothing(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    clarifai.getColors(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),

                    /**Google req  //note the use of 'localURIexplicit' rather than 'publicURL'*/
                    gvision.getLogos(fileLoc.localURIexplicit)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    gvision.getLabels(fileLoc.localURIexplicit)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    /**@deprecated*/
                    gvision.getColors(fileLoc.localURIexplicit)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    gvision.getText(fileLoc.localURIexplicit)
                        .then((meta) => onResp(meta, fileLoc.id))
                        .catch((err) => console.log(err)),

                    /**Imagga req*/
                    imagga.getTags(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    imagga.getColors(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),

                    /**Microsoft Cognitive req*/
                    msft.getOCR(fileLoc.publicURL)
                        .then((meta) => resolve(onResp(meta, fileLoc.id)))
                        .catch((err) => console.log(err)),
                    msft.getDescr(fileLoc.publicURL)
                        .then((meta) => meta.forEach((elem) => {
                            resolve(onResp(elem, fileLoc.id));
                        }))
                        .catch((err) => console.log(err))

                    /**Cloudsight req*/
                    // cloudsight.getDescr(fileLoc.publicURL)
                    //     .then((meta) => onResp(elem, fileLoc.id);
                    //     .catch((err)=> console.log(err));

                ]).then(metas => {
                    /**Returns */
                    console.log("From PicToTag: " + metas);
                    resolve(metas);
                });
            })
            .catch((err) => {
                console.log("PicToTag Err: " + err);
                reject(err);
            });
    });
};

/**
 * Delegates the emit function of the socket
 * just after receiving the response
 * and stores the data in a metaTag Array
 * @param {Meta}            mMeta       Metadata
 * @param {String}            id        Unique id pairing the img and the request
 * @param {Array}            mMetaArray  Array wrapper of the whole meta
 * @param {Socket}            socket  SocketIo object
 */
function onResp(mMeta, id) {
    // return new Promise((resolve, reject) => {
    // if(firstTime)
    mMeta.setReqId(id);
    sessionSocket.emit('METADATA', mMeta);
    console.log("Ended subPromise: " + JSON.stringify(mMeta));
    mMetaArray.push(mMeta);
    return mMeta;
    // });
}

class FileURI {
    constructor() {
        this.id = shortid.generate();
        this.localURI = 'public/uploads/' + this.id + '.jpg';
        this.localURIexplicit = './' + this.localURI;  //Required by Google
        this.publicURL = 'https://shotgot.com/' + this.localURI;
    }

    /**
     /**Save data64 stream into a file allocated in a public folder
     * @param {string}            b64data       Base64 Data of the img
     * * @return {FileURI}   FileURI as a wrapper of both local and public img URL
     */
    static saveB64toUrl(b64data) {
        return new Promise((resolve, reject) => {
            let fileLoc = new FileURI();
            fs.writeFile(fileLoc.localURI, new Buffer(b64data, 'base64'),
                function (err) {
                    if (err) reject(err);
                    else {
                        console.log("filename created in: " + fileLoc.publicURL);
                        resolve(fileLoc);
                    }
                });
        });
    }
}