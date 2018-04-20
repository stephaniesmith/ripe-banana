const router = require('express').Router();
const Actor = require('../models/Actor');
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
        Actor.findById(req.params.id)
            .lean()
            .then(actor => { 
                check404(actor, req.params.id);
                res.json(actor);
            })
            .catch(next);

    })

    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Actor.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });

    
