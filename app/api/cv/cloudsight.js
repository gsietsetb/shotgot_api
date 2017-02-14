const cloudsight = require('cloudsight')({
    apikey: process.env.CLOUDSIGHT_KEY
});
const Meta = require('./../../models/meta');
const enums = require('./../../models/enums');


module.exports.getDescr = (location, socket, startTime) => {
    const imgCloudsight = {
        // image: location,
        remote_image_url: location,
        locale: 'en-US'  //Todo Add TTL ?
    };
    cloudsight.request(imgCloudsight, true, function (err, resp) {
        if (resp != undefined) {
            const timeRx = Date.now();
            var meta = new Meta(enums.CV_API.API_CLOUDSIGHT,
                enums.MetaTypes.TYPE_DESCR,
                resp.name, timeRx);
            socket.emit('METADATA', meta, timeRx - startTime);
            return meta;
        }
    });
};

