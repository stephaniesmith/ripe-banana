const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Review API', () => {
    before(() => dropCollection('reviews'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('films'));
    
    let ebert = {
        name: 'Roger Ebert',
        company: 'rogerebert.com'
    };

    before(() => {
        return request.post('/reviewers')
            .send(ebert)
            .then(({ body }) => {
                ebert = body;
            });
    });

    let coolHandLuke = {
        title: 'Cool Hand Luke',
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

    let lukeReview = {
        rating: 5,
        review: 'It is a great film. On that most of us can agree.'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a review', () => {
        lukeReview.reviewer = ebert._id;
        lukeReview.film = coolHandLuke._id;
        return request.post('/reviews')
            .send(lukeReview)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, createdAt, updatedAt } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.ok(createdAt);
                assert.ok(updatedAt);
                assert.deepEqual(body, {
                    ...lukeReview,
                    _id, __v, createdAt, updatedAt
                });
                lukeReview = body;
            });
    });

    const getFields = ({ _id, rating, review, film }) => ({ _id, rating, review, film });

    it('gets (100 most recent) reviews, including film title', () => {
        return request.get('/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    ...lukeReview,
                    film: {
                        _id: coolHandLuke._id,
                        title: coolHandLuke.title
                    }
                }].map(getFields));
            });

    });
});
