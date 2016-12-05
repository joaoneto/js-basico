const crypto = require('crypto');
const { BadRequest } = require('../lib/exceptions');
const { isEmail } = require('../lib/validators');
const { issueToken, encryptPassword } = require('../lib/security');

class RegisterResource {
  constructor(User) {
    this.User = User;
  }

  validate(req, res, next) {
    const { body } = req;

    if (!body.email || body.email.trim() === '') {
      return next(new BadRequest('E-mail não pode ser nulo'));
    }

    if (!isEmail(body.email)) {
      return next(new BadRequest('E-mail inválido'));
    }

    if (!body.nome || body.nome.trim() === '') {
      return next(new BadRequest('Nome não pode ser nulo'));
    }

    if (!body.senha || body.senha.trim() === '') {
      return next(new BadRequest('Senha não pode ser nula'));
    }

    next();
  }

  prepareNewUserObject(obj) {
    let sanitizedObj = {};
    const salt = crypto.randomBytes(32).toString('base64');

    sanitizedObj.email = obj.email.trim();
    sanitizedObj.nome = obj.nome.trim();
    sanitizedObj.data_criacao = Date.now();
    sanitizedObj.salt = salt;
    sanitizedObj.senha = encryptPassword(salt, obj.senha);
    sanitizedObj.ultimo_login = Date.now();

    const newUser = new this.User(sanitizedObj);
    newUser.token = issueToken(newUser._id);
    return newUser;
  }

  checkEmailIsInUse(req, res, next) {
    this.User.findOne({ email: req.body.email }, (err, doc) => {
      if (doc) {
        return next(new BadRequest('E-mail já existente'));
      }
      next(err);
    });
  }

  create(req, res, next) {
    const user = this.prepareNewUserObject(req.body);

    user.save((err, user) => {
      if (err) return next(err);
      return res.json({ success: true, user });
    });
  }
}

module.exports = RegisterResource;
