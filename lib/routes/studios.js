const router = require('express').Router();
const Studio = require('../models/Studio');
const Film = require('../models/Film');

const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
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

    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });





