const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Actor = require('../../lib/models/Actor');

describe('Actor API', () => {
    before(() => dropCollection('actors'));

    let emma = {
        name: 'Emma Thompson',
        dob: new Date(1959, 3, 15).toJSON(),
        pob: 'London, UK'
    };

    let paul = {
        name: 'Paul Newman',
        dob: new Date(1925, 0, 26).toJSON(),
        pob: 'Shaker Heights, OH, USA'
    };

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));
    const getFields = ({ _id, name }) => ({ _id, name });

    it('saves an actor', () => {
        return request.post('/actors')
            .send(emma)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...emma,
                    _id,
                    __v
                });
                emma = body;
            });
    });


    it('get all actors', () => {
        return Actor.create(paul).then(roundTrip)
            .then(saved => {
                paul = saved;
                return request.get('/actors');

            })
            .then(({ body }) => {
                assert.deepEqual(body, [emma, paul].map(getFields));
            });

    });
    it('gets an actor by id', () => {
        return request.get(`/actors/${paul._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, paul); 
            });
    });
    it('updates an actor', () => {
        emma.pob = 'Paddington, London, England';

        return request.put(`/actors/${emma._id}`)
            .send(emma)
            .then(({ body }) => {
                assert.deepEqual(body, emma);
            });

    });
    it('deletes an actor', () => {
        return request.delete(`/actors/${emma._id}`)
            .then(() => {
                return Actor.findById(emma._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });
    it('returns 404', () => {
        return request.get(`/actors/${emma._id}`)
            .then(response => {
                assert.equal(response.status, 404);
            });

    });

});

