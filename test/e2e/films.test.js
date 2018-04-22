const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// const Film = require('../../lib/models/Film');

describe('films API', () => {

    let emma = {
        name: 'Emma Thompson',
        dob: new Date(1959, 3, 15).toJSON(),
        pob: 'London, UK'
    };

    let sense = {
        title: 'Sense and Sensibility',
        studio: 1234546,
        released: 1995,
        cast: []
    };

    let incredibles = {
        title: 'The Incredibles',
        studio: 3940382,
        released: 2004,
        cast: []
    };

    before(() => dropCollection('actors'));
    before(() => dropCollection('films'));

    before(() => {
        return request.post('/actors')
            .send(emma)
            .then(({ body }) => {
                emma = body;
            });
    });

    before(() => {
        return request.post('/films')
            .send(incredibles)
            .then(({ body }) => {
                incredibles = body;
            });
    });

    it('saves a film', () => {
        sense.cast = [{ part: 'Elinor Dashwood', actor: emma._id }];
        return request.post('/films')
            .send(sense)
            .then(({ body }) => {
                const { _id, __v } = body;
                sense.cast[0]._id = body.cast[0]._id;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...sense,
                    _id,
                    __v,
                });
                sense = body;
            });
    });

    const getAllFields = ({ _id, title, studio, released }) => {
        return { 
            _id, title, studio, released
        };
    };

    it('gets all films', () => {
        return request.get('/films')
            .then(({ body }) => {
                assert.deepEqual(body, [incredibles, sense].map(getAllFields));
            });
    });

    const getOneField = ({ title, studio, released }) => {
        return { 
            title, studio, released, cast: [{ _id: sense.cast[0]._id, part: sense.cast[0].part, actor: { _id: emma._id, name: emma.name } }]
        };
    };

    it('get film by id', () => {
        return request.get(`/films/${sense._id}`)
            .then(({ body }) => {
                console.log('CAST!!', body.cast);
                assert.deepEqual(body, getOneField(sense));
            });
    });

    it('deletes film by id', () => {
        return request.delete(`/films/${incredibles._id}`)
            .then(() => {
                return request.get(`/films/${incredibles._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});