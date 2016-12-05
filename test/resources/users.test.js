/* eslint-env mocha */
const sinon = require('sinon');
const { User } = require('../../app/models');
const UsersResource = require('../../app/resources/users');

require('../helpers/sinon-mongoose');

describe('resources/Users', () => {
  it('should list user', () => {
    const req = { params: { id: 'user-id' }, token: 'jwt-token' };
    const res = { json: () => {} };
    const next = sinon.stub();

    const userDoc = new User({
      nome: 'John',
      email: 'john@foo.com',
      token: 'jwt-token'
    });
    const UserMock = sinon.mock(User);
    UserMock.expects('findOne').yields(null, userDoc);

    const users = new UsersResource(User);
    users.index(req, res, next);

    UserMock.verify();
    UserMock.restore();
    sinon.assert.notCalled(next);
  });

  it('should not list user with wrong token', () => {
    const req = { params: { id: 'user-id' }, token: 'wrong token' };
    const res = { json: () => {} };
    const next = sinon.stub();

    const userDoc = new User({
      nome: 'John',
      email: 'john@foo.com',
      token: 'jwt-token'
    });
    const UserMock = sinon.mock(User);
    UserMock.expects('findOne').yields(null, userDoc);

    const users = new UsersResource(User);
    users.index(req, res, next);

    UserMock.verify();
    UserMock.restore();
    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
  });
});
