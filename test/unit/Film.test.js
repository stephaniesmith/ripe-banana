const { assert } = require('chai');
const Film = require('../../lib/models/Film');
const { getErrors } = require('./helpers');

describe('Film model', () => {

    it.only('valid good model', () => {

        const data = {
            title: 'The Incredibles',
            studio: 1234546,
            released: 2004,
            cast: []
        };

        const film = new Film(data);
        data._id = film._id;
        assert.deepEqual(film.toJSON(), data);

        assert.isUndefined(film.validateSync());
    });

    it.only('required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 3);
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
    });

});