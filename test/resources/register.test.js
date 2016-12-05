/* eslint-env mocha */
const sinon = require('sinon');
const { assert } = require('chai');
const { User } = require('../../app/models');
const RegisterResource = require('../../app/resources/register');
const { encryptPassword } = require('../../app/lib/security');

require('../helpers/sinon-mongoose');

describe('resources/Register', () => {
  it('should register new user', (done) => {
    const req = { body: { nome: 'John', email: 'john@foo.com', senha: '111' } };
    const res = {
      json: (data) => {
        assert.isOk(data.success);
        User.prototype.save.restore();
        done();
      }
    };
    const next = sinon.stub();

    const register = new RegisterResource(User);
    const userDoc = new User(register.prepareNewUserObject(req.body));

    sinon.stub(User.prototype, 'save').yields(null, userDoc);

    register.create(req, res, next);

    sinon.assert.notCalled(next);
  });

  it('should pass email is in use', () => {
    const req = { body: { nome: 'John', email: 'john@foo.com', senha: '111' } };
    const res = {};
    const next = sinon.stub();

    const UserMock = sinon.mock(User);
    UserMock.expects('findOne')
      .withArgs({ email: req.body.email })
      .yields(null);

    const register = new RegisterResource(User);

    register.checkEmailIsInUse(req, res, next);

    UserMock.verify();
    UserMock.restore();
    sinon.assert.calledOnce(next);
  });

  it('should not pass email is in use', () => {
    const req = { body: { nome: 'John', email: 'john@foo.com', senha: '111' } };
    const res = {};
    const next = sinon.stub();

    const UserMock = sinon.mock(User);
    UserMock.expects('findOne')
      .withArgs({ email: req.body.email })
      .yields(null, new User(req.body));

    const register = new RegisterResource(User);

    register.checkEmailIsInUse(req, res, next);

    UserMock.verify();
    UserMock.restore();
    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should pass validation', () => {
    const req = { body: { nome: 'John', email: 'john@foo.com', senha: '111' } };
    const res = {};
    const next = sinon.stub();

    const register = new RegisterResource({});

    register.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next);
  });

  it('should not pass validation blank `nome` field', () => {
    const req = { body: { nome: ' ', email: 'john@foo.com', senha: '111' } };
    const res = {};
    const next = sinon.spy();

    const register = new RegisterResource({});

    register.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should not pass validation blank `senha` field', () => {
    const req = { body: { nome: 'John', email: 'john@foo.com', senha: '   ' } };
    const res = {};
    const next = sinon.spy();

    const register = new RegisterResource({});

    register.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should not pass validation blank `email` field', () => {
    const req = { body: { nome: 'John', email: '  ', senha: '111' } };
    const res = {};
    const next = sinon.spy();

    const register = new RegisterResource({});

    register.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should not pass validation bad `email` field', () => {
    const req = { body: { nome: 'John', email: ' bad email ', senha: '111' } };
    const res = {};
    const next = sinon.spy();

    const register = new RegisterResource({});

    register.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should prepare new user object', () => {
    const password = '111';
    const userObj = { nome: 'John', email: 'john@foo.com', senha: password };
    const register = new RegisterResource(User);

    const newUserObj = register.prepareNewUserObject(userObj);

    assert.equal(newUserObj.senha, encryptPassword(newUserObj.salt, password));
  });
});
