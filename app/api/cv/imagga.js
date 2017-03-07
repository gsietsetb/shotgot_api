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
class ImaggaReq {
    getTags(url) {
        request.get('https://cv_api.imagga.com/v1/tagging?url='
            + encodeURIComponent(url),
            function (error, status, resp) {
                if (resp != undefined) {
                    let labs = [];
                    resp.results[0].tags.forEach(function (elem) {
                        if (elem.confidence > 20)
                            labs.push(elem.tag)
                    });
                    const meta = new Meta(enums.VisionAPI.API_IMAGGA,
                        enums.TagType.TYPE_TAGS, labs);
                    return meta;
                } else reject(status);
            }).auth(apiKey, apiSecret, true);  //Send_inmediately set to true

    };

    getColors(url) {
        return new Promise((resolve, reject) => {
            request.get('https://cv_api.imagga.com/v1/colors?url='
                + encodeURIComponent(url),
                function (error, status, body) {
                    if (body != undefined) {
                        let cols = [];
                        body.results[0].info.foreground_colors.forEach(function (elem) {
                            if (elem.percentage > 30)
                                cols.push(elem.html_code)
                        });
                        resolve(new Meta(enums.VisionAPI.API_IMAGGA,
                            enums.TagType.TYPE_TAGS, cols));
                    } else reject(status);
                }).auth(apiKey, apiSecret, true);
        });
    };
}

module.exports = ImaggaReq;
