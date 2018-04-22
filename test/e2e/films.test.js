const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Film = require('../../lib/models/Film');

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

    before(() => dropCollection('actors'));
    before(() => dropCollection('films'));

    before(() => {
        return request.post('/actors')
            .send(emma)
            .then(({ body }) => {
                emma = body;
            });
    });

    it.only('saves a film', () => {
        sense.cast = [{ part: 'Elinor Dashwoor', actor: emma._id }];
        console.log('S&S!!', sense);
        return new Film(sense).save()
            .then(saved => {
                saved = saved.toJSON();
                const { _id } = saved;
                // console.log(saved);
                assert.ok(_id);
            });
    });

});