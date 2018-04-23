const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Reviewer API', () => {
    before(() => dropCollection('reviwers'));

    let siskel = {
        name: 'Gene Siskel',
        company: 'genesiskel.com'
    };

    let ebert = {
        name: 'Roger Ebert',
        company: 'rogerebert.com'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a reviewer', () => {
        return request.post('/reviewers')
            .send(siskel)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.deepEqual(body, {
                    ...siskel,
                    _id,
                    __v
                });
                siskel = body;
            });
    });
});