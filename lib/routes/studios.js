const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');
const check404 = require('./check-404');
const ensureRole = require('../util/ensure-role');

module.exports = router
    .post('/', ensureRole('admin'), (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Studio.findById(id)
                .lean(),

            Film.find({ studio: id })
                .lean()
                .select('title')
        ])
            .then(([studio, films]) => {
                check404(studio, id);
                studio.films = films;
                res.json(studio);
            })
            .catch(next);
    })

    .delete('/:id', ensureRole('admin'), (req, res, next) => {
        const { id } = req.params;

        Film.find({ studio: id })
            .count()
            .then(count => {
                if(count) throw {
                    status: 400,
                    error: 'cannot delete studio with films'
                };
                return Studio.findByIdAndRemove(id);
            })
            .then(removed => res.json({ removed }))
            .catch(next);
    });





