/**
 * Created by gsierra on 10/02/17.
 */

/**
 * Supported CV APIs.
 * @enum {string}
 */
const VisionAPI = {
    API_GOOGLE: 'Google',
    API_CLARIFAI: 'Clarifai',
    API_CLOUDSIGHT: 'Cloudsight',
    API_BLIPPAR: 'BLIPPAR',
    API_AMAZON: 'AMAZON',
    API_IBM: 'IBM'
};

/**
 * Supported Affiliate Program APIs.
 * @enum {string}
 */
const AffiliateAPI = {
    API_GOOGLE: 'Google',
    API_CLARIFAI: 'Clarifai',
    API_CLOUDSIGHT: 'Cloudsight',
};

/**
 * Supported types for Metadata.
 * @enum {string}
 */
const MetaTypes = {
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
const API_Affiliate = {
    KEY_ID: 'id',
    KEY_API: 'API',
    KEY_TYPE: 'type',
    KEY_DATA: 'data',
};
