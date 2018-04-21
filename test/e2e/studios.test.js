const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
//const Studio = require('../../lib/models/Studio');


describe('Studio API', () => {
    before(() => dropCollection('studios'));

    let paramount = {
        name: 'Paramount Pictures',
        address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'USA'
        },
    };


    it('saves a studio', () => {
        return request.post('/studios')
            .send(paramount)
            .then(({ body }) => {
                const { _id, _v
                } = body;
                assert.ok(_id);
                assert.equal(_v, 0);
                assert.deepEqual(body, {
                    ...paramount,
                    _id,
                    _v
                });
                paramount = body; 
            });
    });
    



});