/**
 * Created by jorgecuesta on 4/6/16.
 */

var dbURI = 'mongodb://localhost/global_plugin_multiple_model_same_schema',
    should = require('chai').should(),
    mongoose = require('mongoose'),
    Dummy,
    pluginA,
    pluginB,
    clearDB = require('mocha-mongoose')(dbURI);

// Add our tweak.
require('../src/index');

pluginA = function pluginA (schema, options) {
    if (!schema.pluginACounter) {
        schema.pluginACounter = 0;
    }

    schema.pluginACounter++;

    schema.pre('validate', function (next) {
        var doc = this;

        if (!doc.pluginACounter) {
            doc.pluginACounter = 0;
        }

        doc.pluginACounter++;

        doc.pluginACounter.should.equal(1);
        doc.schema.pluginACounter.should.equal(1);

        next();
    });
};

pluginB = function pluginB (schema, options) {
    if (!schema.pluginBCounter) {
        schema.pluginBCounter = 0;
    }

    schema.pluginBCounter++;

    schema.pre('validate', function (next) {
        var doc = this;

        if (!doc.pluginBCounter) {
            doc.pluginBCounter = 0;
        }

        doc.pluginBCounter++;

        doc.pluginBCounter.should.above(0);
        // Because we register it 2 times on 2 different models (DummyA and DummyB)
        doc.pluginBCounter.should.lessThan(3);

        next();
    });
};

// Register plugin.
mongoose.plugin(pluginA, {
    recursive: false
});

mongoose.plugin(pluginB, {
    recursive: true
});

Dummy = new mongoose.Schema({
    title: String
});

mongoose.model('DummyA', Dummy);
mongoose.model('DummyB', Dummy);

describe('Mongoose with global plugins', function () {

    beforeEach(function (done) {
        if (mongoose.connection.db) return done();

        mongoose.connect(dbURI, done);
    });

    it('validate amount of plugins executions', function (done) {

        var self = this, myDummy,
            dummyClass = mongoose.model('DummyA');

        myDummy = new dummyClass({
            title: 'My Dummy'
        });

        return myDummy.save(function (err, results) {
            self.dummy = results;

            return mongoose.model('DummyA').find(function (err, results) {
                results.length.should.equal(1);
                results[0].title.should.equal('My Dummy');
                return done();
            });
        });
    });

    it("can clear the DB on demand", function (done) {
        clearDB(function (err) {
            if (err) return done(err);

            mongoose.model('DummyA').find({}, function (err, docs) {
                if (err) return done(err);
                docs.length.should.equal(0);
                done();
            });
        });
    });
});

