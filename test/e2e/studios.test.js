const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Studio = require('../../lib/models/Studio');


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

    /*let pixar = {
        name: 'Pixar',
        address: {
            city: 'Emeryville',
            state: 'California',
            country: 'USA'
        },
    };*/

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));
    //const getFields = ({ _id, name }) => ({ _id, name }); 

    it('saves a studio', () => {
        return request.post('/studios')
            .send(paramount)
            .then(({ body }) => {
                const { _id
                } = body;
                assert.ok(_id);
                assert.equal();
                assert.deepEqual(body, {
                    ...paramount,
                    _id
                });
                paramount = body; 
            });
    });

    it('gets all studios', () => {
        return Studio.create(paramount).then(roundTrip)
            .then(saved => {
                paramount = saved;
                return request.get('/studios');
            });
        /*.then(({ body }) => {
                assert.deepEqual(body, [paramount, pixar].map(getFields));
            });*/
    });

    it('returns 404', () => {
        return request.get(`/studios/${paramount._id}`)
            .then(response => {
                assert.equal(response.status, 404);
            });
    });
});