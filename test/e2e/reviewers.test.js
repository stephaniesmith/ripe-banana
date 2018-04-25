const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Reviewer API', () => {
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('films'));
    
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
        hash: 'fake hash'
    };

    let ebert = {
        name: 'Roger Ebert',
        company: 'rogerebert.com',
        email: 'rober@ebert.com',
        hash: 'another fake hash'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a reviewer', () => {
        return request.post('/reviewers')
            .send(siskel)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.deepEqual(body, {
                    ...siskel,
                    _id,
                    __v
                });
                siskel = body;
            });
    });

    const getFields = ({ _id, name, company }) => ({ _id, name, company });

    it('gets all reviewers', () => {
        return request.post('/reviewers')
            .send(ebert)
            .then(checkOk)
            .then(({ body }) => {
                ebert = body;
                return request.get('/reviewers');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [siskel, ebert].map(getFields));
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

    
    it('updates a reviewer', () => {
        siskel.company = 'Chicago Tribune';

        return request.put(`/reviewers/${siskel._id}`)
            .send(siskel)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, siskel);
            });
    });
});