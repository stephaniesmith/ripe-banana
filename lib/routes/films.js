const router = require('express').Router();
const Film = require('../models/Film');

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
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(films =>  res.json(films))
            .catch(next);
            
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .select('title studio released cast')
            .populate({
                path: 'cast.actor',
                select: 'name'
            })
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(film =>  {
                check404(film, req.params.id);
                res.json(film);
            })
            .catch(next);
            
    })

    .delete('/:id', (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(removed =>  {
                res.json({ removed });
            })
            .catch(next);
            
    });