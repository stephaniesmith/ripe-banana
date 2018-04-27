const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('films API', () => {

    let token = '';

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

    let critic = {
        name: 'Steven',
        company: 'steven.com',
        email: 'steven@steven.com',
        password: 'abc',
        roles: 'admin'
    };

    let goodReview = {
        rating: 5,
        review: 'Really good!',
        createdAt: new Date(),
        updateAt: new Date()
    };

    let badReview = {
        rating: 1,
        review: 'Really bad!',
        createdAt: new Date(),
        updateAt: new Date()
    };


    before(() => dropCollection('actors'));
    before(() => dropCollection('films'));
    before(() => dropCollection('reviewers'));

    before(() => {
        return request.post('/auth/signup')
            .send(critic)
            .then(({ body }) => {
                token = body.token;
                critic._id = body._id;
                return request.get('/reviewers');
            });
    });

    before(() => {
        return request.post('/actors')
            .set('Authorization', critic.roles)
            .send(emma)
            .then(({ body }) => {
                emma = body;
            });
    });

    before(() => {
        return request.post('/studios')
            .send(pixar)
            .set('Authorization', critic.roles)
            .then(({ body }) => {
                pixar = body;
            });
    });

    before(() => {
        return request.post('/studios')
            .send(columbia)
            .set('Authorization', critic.roles)
            .then(({ body }) => {
                columbia = body;
            });
    });

    before(() => {
        incredibles.studio = pixar._id;
        return request.post('/films')
            .set('Authorization', critic.roles)
            .send(incredibles)
            .then(({ body }) => {
                incredibles = body;
            });
    });

    before(() => {
        goodReview.reviewer = critic._id;
        goodReview.film = incredibles._id;
        return request.post('/reviews')
            .set('Authorization', token)
            .send(goodReview)
            .then(({ body }) => {
                goodReview = body;
            });
    });

    before(() => {
        badReview.reviewer = critic._id;
        badReview.film = incredibles._id;
        return request.post('/reviews')
            .set('Authorization', token)
            .send(badReview)
            .then(({ body }) => {
                badReview = body;
            });
    });


    it('saves a film', () => {
        sense.cast = [{ part: 'Elinor Dashwood', actor: emma._id }];
        sense.studio = columbia._id;
        return request.post('/films')
            .set('Authorization', critic.roles)
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
        sense.studio = { _id: columbia._id, name: columbia.name };
        incredibles.studio = { _id: pixar._id, name: pixar.name };
        return request.get('/films')
            .then(({ body }) => {
                assert.deepEqual(body, [incredibles, sense].map(getAllFields));
            });
    });

    const getOneField = ({ _id, title, studio, released, cast }) => {
        return { 
            _id, title, studio, released, cast, reviews: []
        };
    };

    it('get film by id', () => {
        sense.cast[0].actor = { _id: emma._id, name: emma.name };
        return request.get(`/films/${sense._id}`)
            .then(({ body }) => {
                const selected = getOneField(sense);
                assert.deepEqual(body, selected);
            });
    });

    it('checks review populate on get film by id', () => {
        const incrdReview = [
            { 
                _id: goodReview._id, 
                rating: goodReview.rating, 
                review: goodReview.review,
                reviewer: { _id: critic._id, name: critic.name, }
            },
            { 
                _id: badReview._id, 
                rating: badReview.rating, 
                review: badReview.review, 
                reviewer: { _id: critic._id, name: critic.name }
            }
        ];

        return request.get(`/films/${incredibles._id}`)
            .then(({ body }) => {
                assert.deepEqual(body.reviews, incrdReview);
            });       
    });

    it('deletes film by id', () => {
        return request.delete(`/films/${incredibles._id}`)
            .set('Authorization', critic.roles)
            .then(() => {
                return request.get(`/films/${incredibles._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});