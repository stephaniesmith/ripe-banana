const { assert } = require('chai');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

describe('Studio model', () => {

    it('valid good model', () => {
        const data = {
            name: 'Paramount Studios',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        };
        const studio = new Studio(data);
        data._id = studio._id;
        assert.deepEqual(studio.toJSON(), data);
        assert.isUndefined(studio.validateSync());

    });

    it('required fields', () => {
        const studio = new Studio({});
        const errors = getErrors(studio.validateSync(), 1);
        assert.Equal(errors.name.kind, 'required');
    });
});
