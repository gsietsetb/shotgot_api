const cloudsight = require('cloudsight')({
    apikey: process.env.CLOUDSIGHT_KEY
});
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');


module.exports.getDescr = (location, socket, startTime) => {
    const imgCloudsight = {
        remote_image_url: location,        // image: location,
        locale: 'en-US'  //Todo Add TTL ?
    };
    cloudsight.request(imgCloudsight, true, function (err, resp) {
        if (resp != undefined) {
            const meta = new Meta(enums.VisionAPI.API_CLOUDSIGHT,
                enums.TagType.TYPE_DESCR,
                resp.name, Date.now() - startTime);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
};

