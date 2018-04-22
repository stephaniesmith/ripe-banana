const router = require('express').Router();
const Film = require('../models/Film');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status:404,
            error: `Actor id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title studio released')
            .then(films =>  res.json(films))
            .catch(next);
            
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .select('title studio released cast')
            .populate({
                path: 'cast',
                select: { path: 'actor' }
            })
            .then(film =>  {
                check404(film, req.params.id);
                res.json(film);
            })
            .catch(next);
            
    });