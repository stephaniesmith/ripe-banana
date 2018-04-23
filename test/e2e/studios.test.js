const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
//const Studio = require('../../lib/models/Studio');


describe('Studio API', () => {

    let paramount = {
        name: 'Paramount Pictures',
        address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'USA'
        },
    };

    let pixar = {
        name: 'Pixar',
        address: {
            city: 'Emeryville',
            state: 'California',
            country: 'USA'
        },
    };

    before(() => dropCollection('studios'));

    before(() => {
        return request.post('/studios')
            .send(paramount)
            .then(({ body }) => {
                paramount = body;
            });
    });
    
    it('saves a studio', () => {
        return request.post('/studios')
            .send(paramount)
            .then(({ body }) => {
                const { _id, _v
                } = body;
                paramount[0]._id = body[0]._id;
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

    const getFields = ({ _id, name }) => {
        return {
            _id, name
        };
    };
         

    it('gets all studios', () => {
        return request.get('/studios') /*Studio.create(paramount).then(roundTrip)
            .then(saved => {
        paramount = saved;
        return request.get('/studios/');
    })*/
        .then(({ body }) => {
            assert.Equal(body, [paramount, pixar].map(getFields));
        });

    it('gets particular studio by id', () => { return request.get(`/studios/${name._id}`)
        .then(({ body }) => {
            assert.deepEqual(body, paramount);
        });

    });

    it('deletes studio by id', () => {
        return request.delete(`/studios/${paramount._id}`)
            .then(() => {
                return request.get(`/studios/${paramount._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            })
        }
    )};
});