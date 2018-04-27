const router = require('express').Router();
const Actor = require('../models/Actor');
const { updateOptions } = require('../util/mongoose-helpers');
const Film = require('../models/Film');
const check404 = require('./check-404');
const ensureRole = require('../util/ensure-role');

module.exports = router
    .post('/', ensureRole('admin'), (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select('name')
            .then(actors =>  res.json(actors))
            .catch(next);
            
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Actor.findById(req.params.id)
                .lean(),
            Film.find({ 'cast.actor': req.params.id })
                .lean()
                .select('title released')
        ])
            .then(([actor, films]) => { 
                check404(actor, req.params.id);
                actor.films = films;
                res.json(actor);
            })
            .catch(next);
    })

    .put('/:id', ensureRole('admin'), (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .delete('/:id', ensureRole('admin'), (req, res, next) => {
        const { id } = req.params;
        Film.find({ 'cast.actor':id })
            .count()
            .then(count => {
                if(count) throw {
                    status: 400,
                    error: 'cannot delete'

                };
                return Actor.findByIdAndRemove(id);
            })
            .then(removed => res.json({ removed }))
            .catch(next);
    });

    
