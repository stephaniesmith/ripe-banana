const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Actor = require('../../lib/models/Actor');

describe('Actor API', () => {
    before(() => dropCollection('actors'));

    let emma = {
        name: 'Emma Thompson',
        dob: new Date(1959, 3, 15),
        pob: 'London, UK'
    };

    let paul = {
        name: 'Paul Newman',
        dob: new Date(1925, 0, 26),
        pob: 'Shaker Heights, OH, USA'
    };

    it('saves and gets an actor', () => {
        return new Actor(emma).save()
            .then(saved => {
                saved = saved.toJSON();
                const { _id, __v } = saved;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(saved, { _id, __v, ...emma });
                emma = saved;
                return Actor.findById(saved._id).lean();
            })
            .then(found => {
                assert.deepEqual(found, emma);
            });
    });
});

