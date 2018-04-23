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
        released: 1995,
        cast: []
    };

    let incredibles = {
        title: 'The Incredibles',
        released: 2004,
        cast: []
    };

    let pixar = {
        name: 'Pixar'
    };

    let columbia = {
        name: 'Columbia Pictures'
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
        return request.post('/studios')
            .send(pixar)
            .then(({ body }) => {
                pixar = body;
            });
    });

    before(() => {
        return request.post('/studios')
            .send(columbia)
            .then(({ body }) => {
                columbia = body;
            });
    });

    before(() => {
        incredibles.studio = pixar._id;
        return request.post('/films')
            .send(incredibles)
            .then(({ body }) => {
                incredibles = body;
            });
    });


    it.only('saves a film', () => {
        sense.cast = [{ part: 'Elinor Dashwood', actor: emma._id }];
        sense.studio = columbia._id;
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

    it.only('gets all films', () => {
        sense.studio = { _id: columbia._id, name: columbia.name };
        incredibles.studio = { _id: pixar._id, name: pixar.name };
        return request.get('/films')
            .then(({ body }) => {
                assert.deepEqual(body, [incredibles, sense].map(getAllFields));
            });
    });

    const getOneField = ({ _id, title, studio, released, cast }) => {
        return { 
            _id, title, studio, released, cast
        };
    };

    it.only('get film by id', () => {
        sense.cast[0].actor = { _id: emma._id, name: emma.name };
        return request.get(`/films/${sense._id}`)
            .then(({ body }) => {
                const selected = getOneField(sense);
                assert.deepEqual(body, selected);
            });
    });

    it.only('deletes film by id', () => {
        return request.delete(`/films/${incredibles._id}`)
            .then(() => {
                return request.get(`/films/${incredibles._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});