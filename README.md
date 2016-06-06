## mongoose-plugins-recurrency

This package was created so some mongoose plugins could be installed only 
once per schema. And not every time a new model is created using that same schema.

The option passed is if the plugin should be applied recursively(mongoose normal behavior), 
or just once for that schema.

### Installation

`npm install mongoose-plugins-recurrency`

> @NOTE: It require as peerDependency mongoose.

### Usage

```javascript
var mongoose = require('mongoose');

// It automatically add logic to mongoose.
require('mongoose-plugins-recurrency');

// Register Global plugin with recursive flag in false to prevent it be more than one.
mongoose.plugin(function pluginA (schema, options){
    console.log('Registering only once');
}, {
    recursive: false
});

// Register Global plugin with recursive flag in true lo leave it work like mongoose does.
// @NOTE: if don't pass recursive it also work like if you pass true.
mongoose.plugin(function pluginB(schema, options){
    console.log('Registering only once');
}, {
    recursive: true
});

var Dummy = new mongoose.Schema({
    title: String
});

// You also can add with same logic plugin directly on schema before build models.
Dummy.plugin(function pluginC (schema, options){
    console.log('## Something Great ##');
}, {
    recursive: true // or false or don't pass it.
});

var DummyA = mongoose.model('DummyA', Dummy);
var DummyB = mongoose.model('DummyB', Dummy);

// Right now Dummy schema should have 1 instance of pluginA, 2 instances of pluginB and 1 instance of pluginC

```

### Tests

`npm test`

### Credits

* [Robert Hurst](https://github.com/RobertWHurst) as main thinker of this solution reported in mongoose as issue [#4106](https://github.com/Automattic/mongoose/issues/4106)


