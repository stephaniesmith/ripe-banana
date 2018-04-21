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
    //const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));
    //const getFields = ({ _id, name }) => ({_id, name }); 

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
    it('returns 404', () => {
        return request.get(`/studio/${paramount._id}`)
            .then(response => {
                assert.equal(response.status, 404);
            });
    });
});