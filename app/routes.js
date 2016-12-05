const { Router } = require('express');
const { loginResource, registerResource, usersResource } = require('./resources');
const { verifyToken } = require('./lib/security');

const routes = Router();

routes.route('/').get((req, res) => {
  res.json({ success: true, message: 'Olá :)' });
});

routes.route('/login').post(loginResource.create.bind(loginResource));

routes.route('/register').post([
  registerResource.validate.bind(registerResource),
  registerResource.checkEmailIsInUse.bind(registerResource),
  registerResource.create.bind(registerResource)
]);

routes.route('/user/:id').get([
  verifyToken,
  usersResource.index.bind(usersResource)
]);

module.exports = routes;
