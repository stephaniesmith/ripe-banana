const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Actor = require('../../lib/models/Actor');
const { Types } = require('mongoose');

describe('Actor API', () => {
    before(() => dropCollection('actors'));
    before(() => dropCollection('reviewers'));

    let siskel = {
        name: 'Gene Siskel',
        company: 'genesiskel.com',
        email: 'gene@genesiskel.com',
        password: 'abc',
        roles: 'admin'
    };

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

    before(() => {
        return request.post('/auth/signup')
            .send(siskel)
            .then(({ body }) => {
                siskel._id = body._id;
                siskel.roles = body.roles;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));
    const getFields = ({ _id, name }) => ({ _id, name });

    it('saves an actor', () => {
        return request.post('/actors')
            .set('Authorization', siskel.roles)
            .send(emma)
            .then(({ body }) => {
                const { _id, __v
                } = body;
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
    it('gets an actor by id and their films', () => {
        let sense = {
            title: 'Sense and Sensibility',
            studio: Types.ObjectId(),
            released: 1995,
            cast: [{
                part: 'Elinor Dashwood',
                actor: emma._id
            }]
        };
        return request.post('/films')
            .set('Authorization', siskel.roles)
            .send(sense)
            .then(({ body }) => {
                sense = body;
                return request.get(`/actors/${emma._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, { 
                    ...emma,
                    films: [{
                        _id: sense._id,
                        title: sense.title,
                        released: sense.released
                    }] 
          
                }); 
            });
    });
    it('updates an actor', () => {
        emma.pob = 'Paddington, London, England';

        return request.put(`/actors/${emma._id}`)
            .set('Authorization', siskel.roles)
            .send(emma)
            .then(({ body }) => {
                assert.deepEqual(body, emma);
            });

    });
    it('will not delete an actor in a film', () => {
        
        return request.delete(`/actors/${emma._id}`)
            .set('Authorization', siskel.roles)
            .then(response => {
                assert.strictEqual(response.status, 400);
                assert.include(response.body.error,  'cannot');
            });
    });
    it('deletes an actor by id', () => {
        return request.delete(`/actors/${paul._id}`)
            .set('Authorization', siskel.roles)
            .then(() => {
                return request.get(`/actors/${paul._id}`);
            })
            .then(res => {
                assert.strictEqual(res.status, 404);
            });
    });

    it('returns 404', () => {
        return request.get(`/actors/${paul._id}`)
            .then(response => {
                assert.equal(response.status, 404);
            });

    });

});

