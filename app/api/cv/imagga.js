/**
 * Created by gsierra on 13/02/17.
 */


// Imagga = require('imagga');
// imagga = new Imagga(process.env.IMAGGA_KEY, process.env.IMAGGA_SECRET, '<YOUR-IMAGGA-ENDPOINT>');

const request = require('request'),
    apiKey = process.env.IMAGGA_KEY,
    apiSecret = process.env.IMAGGA_SECRET;

const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');

module.exports.getTags = (url, socket, startTime) => {
    request.get('https://cv_api.imagga.com/v1/tagging?url=' + encodeURIComponent(url),
        function (error, response, resp) {
            if (resp != undefined) {
                const timeRx = Date.now();
                var labs = [];
                resp.results[0].tags.forEach(function (elem) {
                    if (elem.confidence > 20)
                        labs.push(elem.tag)
                });
                const meta = new Meta(enums.VisionAPI.API_IMAGGA,
                    enums.TagType.TYPE_TAGS, labs, timeRx - startTime);
                socket.emit('METADATA', meta);
                return meta;
            }
        }).auth(apiKey, apiSecret, true);//True for Send_inmediately option
};

module.exports.getColors = (url, socket, startTime) => {
    request.get('https://cv_api.imagga.com/v1/colors?url=' + encodeURIComponent(url),
        function (error, response, resp) {
            if (resp != undefined) {
                const timeRx = Date.now();
                var cols = [];
                resp.results[0].info.foreground_colors.forEach(function (elem) {
                    if (elem.percentage > 30)
                        cols.push(elem.html_code)
                });
                const meta = new Meta(enums.VisionAPI.API_IMAGGA,
                    enums.TagType.TYPE_TAGS, cols, timeRx - startTime);
                socket.emit('METADATA', meta);
                return meta;
            }
        }).auth(apiKey, apiSecret, true);//True for Send_inmediately option
};

