// recordModel.js

var mongoose = require('mongoose');

// setup record schema
var recordSchema = mongoose.Schema({
  key: String,
  value: String,
  createdAt: Date,
  counts: [Number],
});

// export record model
module.exports = mongoose.model('record', recordSchema);
