const Login = require('./login');
const Register = require('./register');
const Users = require('./users');

const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.loginResource = new Login(User);
module.exports.registerResource = new Register(User);
module.exports.usersResource = new Users(User);
