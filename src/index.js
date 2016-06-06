/**
 * Created by Jorge Cuesta on 4/6/16.
 */
var mongoose = require('mongoose');

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

    if (opts && opts.recursive === false) {
        if (schema._appliedPlugins.indexOf(fn) > -1) {
            return schema;
        }

        schema._appliedPlugins.push(fn);
    }

    fn(schema, opts);

    return schema;
};