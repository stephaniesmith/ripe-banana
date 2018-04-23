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

    it('includes validation for a minimum value', () => {
        const review = new Review({
            rating: 0,
            reviewer: Types.ObjectId(),            
            review: 'test',
            film: Types.ObjectId(),            
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.strictEqual(errors.rating.kind, 'min');
    });

    it('includes validation for maximum values', () => {
        const review = new Review({
            rating: 10,
            reviewer: Types.ObjectId(),            
            review: ' Think about it a little and, my god, it\'s about you. Whoever you are. Here is how life is supposed to work. We come out of ourselves and unfold into the world. We try to realize our desires. We fold back into ourselves, and then we die.',
            film: Types.ObjectId(),            
        });
        const errors = getErrors(review.validateSync(), 2);
        assert.strictEqual(errors.rating.kind, 'max');
        assert.strictEqual(errors.review.kind, 'maxlength');
    });
});