const { BadRequest, Unauthorized } = require('../lib/exceptions');
const { isEmail } = require('../lib/validators');
const { issueToken, verifyUserPassword } = require('../lib/security');

class LoginResource {
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

    if (!body.senha || body.senha.trim() === '') {
      return next(new BadRequest('Senha não pode ser nula'));
    }

    next();
  }

  create(req, res, next) {
    const { email, senha } = req.body;

    this.User.findOne({ email: email }, (err, user) => {
      if (err) return next(err);

      if (!user) {
        return next(new Unauthorized('E-mail ou senha inválida'));
      }

      if (verifyUserPassword(senha, user)) {
        user.token = issueToken(user._id);
        user.ultimo_login = Date.now();
        user.save((err) => {
          if (err) return next(err);
          res.json({ success: true, user });
        });
      } else {
        next(new Unauthorized('E-mail ou senha inválida'));
      }
    });
  }
}

module.exports = LoginResource;
