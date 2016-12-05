const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { BadRequest, Unauthorized } = require('../lib/exceptions');

const encryptPassword = module.exports.encryptPassword = (salt, password) => {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

module.exports.verifyUserPassword = (password, user) => {
  return encryptPassword(user.salt, password) === user.senha;
};

module.exports.issueToken = (payload, tokenExpirationInSeconds) => {
  return jwt.sign({ id: payload }, 'secret', { expiresIn: tokenExpirationInSeconds });
};

module.exports.verifyToken = (req, tokenExpirationInSeconds, next) => {
  let token;
  const parts = req.headers && req.headers.authorization && req.headers.authorization.split(' ');

  if (parts && parts.length === 2) {
    let scheme = parts[0];
    let credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    }
  }

  if (!token) {
    return next(new BadRequest('Token deve ser enviado via authorization header Bearer.'));
  }

  jwt.verify(token, 'secret', {}, (err) => {
    if (err && err.expiredAt) {
      return next(new Unauthorized('Sessão inválida'));
    } else if (err) {
      return next(new BadRequest('Token inválido'));
    }

    req.token = token;
    return next(err);
  });
};
