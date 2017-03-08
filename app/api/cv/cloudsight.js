const cloudsight = require('cloudsight')({
    apikey: process.env.CLOUDSIGHT_KEY
});
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');

module.exports.getDescr = (location) => {
    return new Promise((resolve, reject) => {
        const imgCloudsight = {
            remote_image_url: location,        // image: location,
            locale: 'en-US'  //Todo Add TTL ?
        };
        cloudsight.request(imgCloudsight, true,
            (err, resp) => {
                if (err)
                    reject(err);
                else if (resp != undefined) {
                    resolve(new Meta(enums.VisionAPI.API_CLOUDSIGHT,
                        enums.TagType.TYPE_DESCR,
                        resp.name));
                }
            });
    });
};

