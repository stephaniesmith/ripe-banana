const { assert } = require('chai');
const request = require('./request');
const { dropCollections } = require('./db');

describe('Auth API', () => {
    beforeEach(() => dropCollections('reviewers'));

    let token = null;

    beforeEach(() => {
        return request
            .post('api/auth/signup')
            .send({
                name: 'Roger Ebert',
                company: 'rogerebert.com',
                email: 'rober@ebert.com',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {

    });
});