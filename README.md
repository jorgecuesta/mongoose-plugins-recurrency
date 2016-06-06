## mongoose-plugins-recurrency
[![Build Status](https://travis-ci.org/jorgecuesta/mongoose-plugins-recurrency.svg?branch=master)](https://travis-ci.org/jorgecuesta/mongoose-plugins-recurrency)
[![Coverage Status](https://coveralls.io/repos/github/jorgecuesta/mongoose-plugins-recurrency/badge.svg?branch=master)](https://coveralls.io/github/jorgecuesta/mongoose-plugins-recurrency?branch=master)
[![npm version](https://badge.fury.io/js/mongoose-plugins-recurrency.svg)](https://badge.fury.io/js/mongoose-plugins-recurrency)
[![Dependency Status](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency.svg)](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency)
[![devDependency Status](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency/dev-status.svg)](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency#info=devDependencies)
[![peerDependency Status](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency/peer-status.svg)](https://david-dm.org/jorgecuesta/mongoose-plugins-recurrency#info=peerDependencies)

This package was created so some mongoose plugins could be installed only 
once per schema. And not every time a new model is created using that same schema.

The option passed is if the plugin should be applied recursively(mongoose normal behavior), 
or just once for that schema.

### Installation

`npm install mongoose-plugins-recurrency`

> @NOTE: It requires mongoose as peerDependency.

### Usage

```javascript
var mongoose = require('mongoose');

// It automatically adds logic to mongoose.
require('mongoose-plugins-recurrency');

// Register Global plugin with recursive flag set to false to prevent it to be called more than once.
mongoose.plugin(function pluginA (schema, options){
    console.log('Registering only once');
}, {
    recursive: false
});

// Register Global plugin with recursive flag set to true to use mongoose normal behavior.
// @NOTE: recursive default value is true
mongoose.plugin(function pluginB(schema, options){
    console.log('Registering only once');
}, {
    recursive: true
});

var Dummy = new mongoose.Schema({
    title: String
});

// You also can also use it directly on a schema before building the models.
Dummy.plugin(function pluginC (schema, options){
    console.log('## Something Great ##');
}, {
    recursive: true // or false
});

var DummyA = mongoose.model('DummyA', Dummy);
var DummyB = mongoose.model('DummyB', Dummy);

// Right now Dummy schema should have 1 instance of pluginA, 2 instances of pluginB and 1 instance of pluginC

```

### Tests

`npm test`

### Credits

* [Robert Hurst](https://github.com/RobertWHurst) as main thinker of this solution reported in mongoose as issue [#4106](https://github.com/Automattic/mongoose/issues/4106)


