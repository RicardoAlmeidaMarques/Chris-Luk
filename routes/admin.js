var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var connection = require('../db.js');
var portfolio = mongoose.model('Portfolio');
var user = mongoose.model('User');

module.exports = router;