var mongoose = require('mongoose');
require('./models/portfolio');
require('./models/user');
var express = require('express');
var router = express.Router();


mongoose.connect('mongodb://localhost/portfolio');

var db = module.exports = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connected.')
});


module.exports = router;