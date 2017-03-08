/**
 * Created by gsierra on 13/02/17.
 */

// Imagga = require('imagga');
// imagga = new Imagga(process.env.IMAGGA_KEY, process.env.IMAGGA_SECRET, '<YOUR-IMAGGA-ENDPOINT>');

const request = require('request-promise'),
    apiKey = process.env.IMAGGA_KEY,
    apiSecret = process.env.IMAGGA_SECRET;

const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');

/**
 * class representing a collection of Imagga API cross-requests
 * @class
 */
module.exports.getTags = (url) => {
    return new Promise((resolve, reject) => {
        request.get('https://api.imagga.com/v1/tagging?url='
            + encodeURIComponent(url),
            (error, status, resp) => {
                let labs = [];
                /**TODO simplify if possible*/
                let aux = JSON.parse(resp);
                if (aux != null && aux != undefined) {
                    aux.results[0].tags.forEach((elem) => {
                        if (elem.confidence > 20)
                            labs.push(elem.tag);
                    });
                    resolve(new Meta(enums.VisionAPI.API_IMAGGA,
                        enums.TagType.TYPE_TAGS, labs));
                }
            }).auth(apiKey, apiSecret, true);  //Send_inmediately set to true
    });
};

module.exports.getColors = (url) => {
    return new Promise((resolve, reject) => {
        request.get('https://api.imagga.com/v1/colors?url='
            + encodeURIComponent(url),
            (error, status, resp) => {
                let cols = [];
                let aux = JSON.parse(resp);
                if (aux != null && aux != undefined) {
                    aux.results[0].info.foreground_colors.forEach((elem) => {
                        if (elem.percentage > 30)
                            cols.push(elem.html_code);
                    });
                    resolve(new Meta(enums.VisionAPI.API_IMAGGA,
                        enums.TagType.TYPE_COLORS, cols));
                }
                }).auth(apiKey, apiSecret, true);
    });
};