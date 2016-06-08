/**
 * Created by Jorge Cuesta on 4/6/16.
 */
var mongoose = require('mongoose'),
    diff = require('recursive-diff'),
    _ = require('lodash');

/**
 * Wrap discriminator function to use created delta by plugin method to remove repeated
 * hooks attached after discriminator calls mongoose.model with merged schema.
 * @param fn
 * @returns {Function}
 */
var wrapper = function (fn) {
    return function (name, schema) {
        var model = fn.apply(this, arguments);

        if (model.schema.__notRecursive.length > 0) {
            model.schema.callQueue = _.differenceBy(model.schema.callQueue, model.schema.__notRecursive);
        }

        return model;
    };
};

/**
 * Wrapped mongoose.Model.discriminator
 * @type {Function}
 */
mongoose.Model.discriminator = wrapper(mongoose.Model.discriminator);

/**
 * Override original mongoose.Schema.plugin method to accept recursive flag inside options.
 * If recursive is not false it leave mongoose work normally otherwise prevent add same plugin method again.
 * @param {Function} fn Plugin entry point.
 * @param {Object} opts Options.
 * @override {mongoose.Schema}
 * @returns {mongoose.Schema}
 */
mongoose.Schema.prototype.plugin = function (fn, opts) {
    var schema = this;

    // it was added here to don't extend mongoose.Schema giving us chance to upgrade
    // mongoose without issues.
    if (!schema._appliedPlugins) {
        schema._appliedPlugins = [];
    }

    if (!schema.__notRecursive) {
        schema.__notRecursive = [];
    }

    if (opts && opts.recursive === false) {
        if (schema._appliedPlugins.indexOf(fn) > -1) {
            return schema;
        }

        schema._appliedPlugins.push(fn);

        var beforeQueue = _.cloneDeep(schema.callQueue);

        fn(schema, opts);

        if (beforeQueue.length < schema.callQueue.length) {
            _.values(diff.getDiff(beforeQueue, schema.callQueue)).map(function (delta) {
                schema.__notRecursive.push(delta.value);
            });
        }

    } else {
        fn(schema, opts);
    }

    return schema;
};