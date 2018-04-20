const { assert } = require('chai');
const Actor = require('../../lib/models/Actor');
const { getErrors } = require('./helpers');

describe('Actor model', () => {

    it('valid good model', () => {
        const data = {
            name: 'Paul Newman',
            dob: new Date(1925, 0, 26),
            pob: 'Shaker Heights, OH'
        };
        const actor = new Actor(data);
        data._id = actor._id;
        assert.deepEqual(actor.toJSON(), data);
        assert.isUndefined(actor.validateSync());
    });

    it('required fields', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
    
});

