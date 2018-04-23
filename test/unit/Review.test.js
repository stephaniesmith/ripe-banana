const { assert } = require('chai');
const { Types } = require('mongoose');
const Review = require('../../lib/models/Review');
const { getErrors } = require('./helpers');

describe('Review model', () => {
    it('is a good, valid model', () => {
        const info = {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Think about it a little and, my god, it\'s about you. Whoever you are.',
            film: Types.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const review = new Review(info);

        info._id = review._id;
        assert.deepEqual(review.toJSON(), info);
        assert.isUndefined(review.validateSync());
    });

    it('has required fields', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);
        assert.strictEqual(errors.rating.kind, 'required');
        assert.strictEqual(errors.reviewer.kind, 'required');
        assert.strictEqual(errors.review.kind, 'required');
        assert.strictEqual(errors.film.kind, 'required');
    });
});