/**
 * Created by gsierra on 10/02/17.
 */

var exports = module.exports = {};

/**
 * Supported CV APIs.
 * @enum {string}
 */
exports.VisionAPI = {
    API_GOOGLE: 'GGL',
    API_CLARIFAI: 'CLRFI',
    API_CLOUDSIGHT: 'CLDSHGT',
    API_IMAGGA: 'IMGG',
    API_BLIPPAR: 'BLPPR',
    API_AMAZON: 'AMZN',
    API_IBM: 'IBM'
};

/**
 * Supported Affiliate Program APIs.
 * @enum {string}
 */
exports.CV_API = {
    API_GOOGLE: 'Google',
    API_CLARIFAI: 'Clarifai',
    API_CLOUDSIGHT: 'Cloudsight',
};

/**
 * Supported types for Metadata.
 * @enum {string}
 */
exports.MetaTypes = {
    TYPE_LABELS: 'Labels',
    TYPE_COLORS: 'Colors',
    TYPE_OCR: 'OCR',
    TYPE_LOGO: 'Logo',
    TYPE_DESCR: 'Descr',
};

/**
 * Supported keys for Metadata.
 * @enum {string}
 */
exports.API_Affiliate = {
    KEY_ID: 'id',
    KEY_API: 'API',
    KEY_TYPE: 'type',
    KEY_DATA: 'data',
};
