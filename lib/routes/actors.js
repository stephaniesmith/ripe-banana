const router = require('express').Router();
const Actor = require('../models/Actor');

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
            .then(actor => res.json(actor))
            .catch(next);

    });

    
