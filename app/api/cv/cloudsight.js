const cloudsight = require('cloudsight')({
    apikey: process.env.CLOUDSIGHT_KEY
});

function getDescr(location, socket) {
    const imgCloudsight = {
        image: location,
        locale: 'en-US'  //Todo Add TTL ?
    };
    cloudsight.request(imgCloudsight, true, function (err, resp) {
        if (resp != undefined) {
            var meta = new respTag('Cloudsight', 'Descr', resp.name);
            socket.emit('METADATA', meta);
            return meta;
        }
    });
}