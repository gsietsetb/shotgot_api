/**
 * Created by gsierra on 10/02/17.
 */

//TODO https://github.com/mercmobily/SimpleSchema
const enums = require('./enums');
var validate = require('express-jsonschema').validate;
var bodyParser = require('body-parser');

/**
 * JSON file compatible object constructor
 * @param {int                  objectId                    Unique identifier:
 * @param {String               API                         used API {Google, Cloudsight, Clarifai...}
 * @param {Object                 type                        Object with keys explained below:
 *   @param {String[]}           type[].Colors               Hex Color, Ex:
 *   @param {String[]}           type[].Labels
 *   @param {String}             type[].Text                'gray acer cordless mouse'
 *   @param {String}             type[].Logo                'Acer'
 *   @param {String}             type[].OCR                 'Desinfectador'
 * @param {object}               data                      Either String or String[] representing the data
 * @return {JSON} A JSON that is fulfilled with Params
 */
var schemas = {
    meta: {
        id: {type: 'string', default: enums.CV_API.API_GOOGLE},
        api: null,
        type: null,
        data: null,
    }
};

module.exports = schemas;