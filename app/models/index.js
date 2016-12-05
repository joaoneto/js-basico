const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports.User = require('./User');
