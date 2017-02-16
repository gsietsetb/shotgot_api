/**
 * Created by gsierra on 10/02/17.
 */

var exports = module.exports = {};

/**
 * Supported CV APIs.
 * @enum {string}
 */
exports.VisionAPI = {
    API_GOOGLE: 'GOGL',
    API_CLARIFAI: 'CLRF',
    API_CLOUDSIGHT: 'CSHT',
    API_IMAGGA: 'IMGG',
    API_BLIPPAR: 'BLPR',
    API_AMAZON: 'AMZN',
    API_MICROSOFT: 'MSFT',
    API_IBM: 'IBM'
};

/**
 * Supported Affiliate Program APIs.
 * @enum {string}
 */
exports.AffiliateAPI = {
    API_AMAZON: 'AMZN',
    API_ALIEXPRESS: 'AXPS',
    API_EBAY: 'EBAY',
};

/**
 * Supported types for Metadata.
 * @enum {string}
 */
exports.TagType = {
    TYPE_TAGS: 'TAGs',
    TYPE_COLORS: 'CLRs',
    TYPE_OCR: 'OCRs',
    TYPE_LOGO: 'LGO',
    TYPE_DESCR: 'TXT',
};
