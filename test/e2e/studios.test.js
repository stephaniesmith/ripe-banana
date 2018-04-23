const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

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
    before(() => dropCollection('films'));
    
    it('saves a studio', () => {
        return request.post('/studios')
            .send(paramount)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...paramount,
                    _id,
                    __v
                });
                paramount = body; 
            });
    });

    const getFields = ({ _id, name }) => ({ _id, name });         

    it('gets all studios', () => {
        return request.post('/studios')
            .send(pixar)
            .then(({ body }) => {
                pixar = body;
                return request.get('/studios');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [paramount, pixar].map(getFields));
            });
    });

    it('gets particular studio by id', () => {
        let up = {
            title: 'UP',
            studio: pixar._id,
            released: 2009,
            cast: []
        };
        
        return request.post('/films')
            .send(up)
            .then(({ body }) => {
                up = body;
                return request.get(`/studios/${pixar._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...pixar,
                    films: [{
                        _id: up._id,
                        title: up.title
                    }]
                });
            });
    });

    it('deletes studio by id', () => {
        return request.delete(`/studios/${paramount._id}`)
            .then(() => {
                return request.get(`/studios/${paramount._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
});