const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth API', () => {
    beforeEach(() => dropCollection('reviewers'));

    let token = null;

    beforeEach(() => {
        return request
            .post('/auth/signup')
            .send({
                name: 'Roger Ebert',
                company: 'rogerebert.com',
                email: 'rober@ebert.com',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('signin', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'rober@ebert.com',
                password: 'abc'
            })
            .then(({ body }) => {
                assert.ok(body.token, token);
            });
    });
});