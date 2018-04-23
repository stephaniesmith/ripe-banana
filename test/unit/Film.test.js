const { assert } = require('chai');
const Film = require('../../lib/models/Film');
const Actor = require('../../lib/models/Actor');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

describe('Film model', () => {

    const sarah = {
        name: 'Sarah Vowell'
    };

    const pixar = {
        name: 'Pixar'
    };

    const actor = new Actor(sarah);
    const studio = new Studio(pixar);

    it.only('valid good model', () => {

        const data = {
            title: 'The Incredibles',
            studio: studio._id,
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

    it.only('checks actor id', () => {

        const data = {
            title: 'The Incredibles',
            studio: studio._id,
            released: 2004,
            cast: [{
                part: 'Violet Parr',
                actor: actor._id
            }]
        };

        const film = new Film(data);

        assert.deepEqual(actor._id, film.cast[0].actor);
        assert.isUndefined(film.validateSync());
    });

});