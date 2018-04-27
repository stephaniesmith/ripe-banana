const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Reviewer API', () => {
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('films'));

    let token = '';
    
    let coolHandLuke = {
        title: 'Cool Hand Luke',
        studio: Types.ObjectId(),
        released: 1967,
        cast: []
    };

    before(() => {
        return request.post('/films')
            .send(coolHandLuke)
            .then(({ body }) => {
                coolHandLuke = body;
            });
    });

    let siskel = {
        name: 'Gene Siskel',
        company: 'genesiskel.com',
        email: 'gene@genesiskel.com',
        password: 'abc'
    };

    let ebert = {
        name: 'Roger Ebert',
        company: 'rogerebert.com',
        email: 'rober@ebert.com',
        password: '123'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => {
        return request.post('/auth/signup')
            .send(siskel)
            .then(({ body }) => {
                token = body.token;
            });
    });

    const getFields = ({ _id, name, company }) => ({ _id, name, company });

    it('gets all reviewers', () => {
        return request.post('/auth/signup')
            .send(ebert)
            .then(checkOk)
            .then(() => {
                return request.get('/reviewers');
            })
            .then(({ body }) => {
                siskel._id = body[0]._id;
                ebert._id = body[1]._id;
                assert.ok(body[0]._id);
                assert.ok(body[1]._id);
                assert.deepEqual(body.map(getFields), [siskel, ebert].map(getFields));
            });
    });

    it('gets a reviewer by id, including an array of their reviews', () => {
        let lukeReview = {
            rating: 5,
            review: 'It is a great film. On that most of us can agree.',
            reviewer: ebert._id,
            film: coolHandLuke._id
        };
    
        return request.post('/reviews')
            .set('Authorization', token)
            .send(lukeReview)
            .then(({ body }) => {
                lukeReview = body;
                return request.get(`/reviewers/${ebert._id}`);
            })
            .then(({ body }) => {
                const selected = getFields(ebert);
                assert.deepEqual(body, {
                    ...selected,
                    reviews: [{ 
                        _id: lukeReview._id,
                        rating: lukeReview.rating,
                        review: lukeReview.review, 
                        film: {
                            _id: coolHandLuke._id,
                            title: coolHandLuke.title 
                        }
                    }]
                });
            });
    });
});