const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const { updateOptions } = require('../util/mongoose-helpers');
const check404 = require('./check-404');

module.exports = router
    .post('/', (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });