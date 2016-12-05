/* eslint-env mocha */
const sinon = require('sinon');
const { assert } = require('chai');
const { User } = require('../../app/models');
const LoginResource = require('../../app/resources/login');
const { encryptPassword } = require('../../app/lib/security');

require('../helpers/sinon-mongoose');

describe('resources/Login', () => {
  it('should login user', (done) => {
    const userSalt = 'abc';
    const userSenha = '111';
    const userSenhaHash = encryptPassword(userSalt, userSenha);

    const givenSenha = '111';
    const req = { body: { email: 'john@foo.com', senha: givenSenha } };
    const res = {
      json: (data) => {
        assert.isOk(data.success);
        UserMock.restore();
        UserDocMock.restore();
        done();
      }
    };
    const next = sinon.stub();

    const userDoc = new User({
      email: 'john@foo.com',
      salt: userSalt,
      senha: userSenhaHash
    });
    const UserMock = sinon.mock(User);
    UserMock.expects('findOne').yields(null, userDoc);

    const UserDocMock = sinon.mock(userDoc);
    UserDocMock.expects('save').yields();

    const login = new LoginResource(User);

    login.create(req, res, next);

    UserMock.verify();
    UserDocMock.verify();
    sinon.assert.notCalled(next);
  });


  it('should pass validation', () => {
    const req = { body: { email: 'john@foo.com', senha: '111' } };
    const res = {};
    const next = sinon.stub();

    const login = new LoginResource({});

    login.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next);
  });

  it('should not pass validation bad `email`', () => {
    const req = { body: { email: ' bad email ', senha: '111' } };
    const res = {};
    const next = sinon.spy();

    const login = new LoginResource({});

    login.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should not pass validation blank `email` field', () => {
    const req = { body: { email: '  ', senha: '111' } };
    const res = {};
    const next = sinon.spy();

    const login = new LoginResource({});

    login.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

  it('should not pass validation blank `senha` field', () => {
    const req = { body: { email: 'john@foo.com', senha: '   ' } };
    const res = {};
    const next = sinon.spy();

    const login = new LoginResource({});

    login.validate(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });

});
