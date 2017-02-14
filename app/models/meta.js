/**
 * Created by gsierra on 10/02/17.
 */

const schemas = require("./schemas.js");
const _ = require("lodash");
const shortid = require('shortid');
// const timer = require('./../../server');


var Meta = function (api, type, data, delay) {
    this.data = data;//this.sanitize(data);
    this.type = type;//this.sanitize(type);
    this.api = api; //this.sanitize(api);
    this.id = shortid.generate();//this.sanitize(shortid.generate());
    if (delay != undefined)
        this.delay = delay;
    console.log("[" + this.api + " | " + this.type + "\t{" + this.delay + " ms} with: " + JSON.stringify(this.data));
};

Meta.prototype.data = {};

Meta.prototype.changeName = function (name) {
    this.data.name = name;
};

Meta.prototype.get = function (name) {
    return this.data[name];
};

Meta.prototype.set = function (name, value) {
    this.data[name] = value;
};

Meta.prototype.sanitize = function (data) {
    data = data || {};
    schema = schemas.meta;
    return _.pick(_.defaults(data, schema), _.keys(schema));
};

Meta.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);
    /*db.get('meta', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
     if (err) return callback(err);
     callback(null, result);
     });*/
};

Meta.findById = function (id, callback) {
    // db.get('meta', {id: id}).run(function (err, data) {
    //     if (err) return callback(err);
    //     callback(null, new Meta(data));
    // });
};

module.exports = Meta;