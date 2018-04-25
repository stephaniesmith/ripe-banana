const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
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
            .select('name company')
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Reviewer.findById(id)
                .lean()
                .select('name company'),

            Review.find({ reviewer: id })
                .lean()
                .select('rating review')
                .populate({
                    path: 'film',
                    select: 'title'
                })
        ])
            .then(([reviewer, reviews]) => {
                check404(reviewer, id);
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });