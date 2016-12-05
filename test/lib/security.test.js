/* eslint-env mocha */
const sinon = require('sinon');
const { assert } = require('chai');
const {
  encryptPassword,
  verifyUserPassword,
  issueToken,
  verifyToken
} = require('../../app/lib/security');

describe('lib/Security', () => {
  let clock;

  before(() => clock = sinon.useFakeTimers());
  after(() => clock.restore());

  it('should encrypt password with salt', () => {
    const salt = 'abc';
    const senha = '123';
    assert.isOk(encryptPassword(salt, senha));
  });

  it('should verify user password', () => {
    const salt = 'abc';
    const senha = '123';
    const user = {
      salt,
      senha: encryptPassword(salt, senha)
    };

    assert.isOk(verifyUserPassword(senha, user));
  });

  it('should not verify user password', () => {
    const salt = 'abc';
    const senha = '123';
    const diferentSenha = '1234';
    const user = {
      salt,
      senha: encryptPassword(salt, diferentSenha)
    };

    assert.isNotOk(verifyUserPassword(senha, user));
  });

  it('should pass header authorization token verification', () => {
    const tokenExpirationInSeconds = 30 * 60;
    const token = issueToken('123', tokenExpirationInSeconds);
    const req = {
      headers: {
        authorization: 'Bearer ' + token
      }
    };
    const next = sinon.stub();

    clock.tick(tokenExpirationInSeconds * 1000 - 1);
    verifyToken(req, tokenExpirationInSeconds, next);

    process.nextTick(() => {
      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next);
    });
    clock.restore();
  });

  it('should expired token not pass header authorization token verification', () => {
    const tokenExpirationInSeconds = 30 * 60;
    const token = issueToken('123', tokenExpirationInSeconds);
    const req = {
      headers: {
        authorization: 'Bearer ' + token
      }
    };
    const next = sinon.stub();

    clock.tick(tokenExpirationInSeconds * 1000 + 1);

    verifyToken(req, tokenExpirationInSeconds, next);

    process.nextTick(() => {
      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
    });
    clock.restore();
  });

  it('should not pass wrong header authorization token verification', () => {
    const tokenExpirationInSeconds = 30 * 60;
    const token = issueToken('123', tokenExpirationInSeconds);
    const req = {
      headers: {
        authorization: 'Foo ' + token
      }
    };
    const next = sinon.stub();

    clock.tick(tokenExpirationInSeconds * 1000 - 1);

    verifyToken(req, tokenExpirationInSeconds, next);

    process.nextTick(() => {
      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
    });
    clock.restore();
  });
});
