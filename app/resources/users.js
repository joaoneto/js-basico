const { Unauthorized } = require('../lib/exceptions');

class UsersResource {
  constructor(User) {
    this.User = User;
  }

  index(req, res, next) {
    this.User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) return next(err);
      if (!user || req.token !== user.token) return next(new Unauthorized('Não autorizado'));

      res.json({ success: true, user: user });
    });
  }
}
module.exports = UsersResource;
