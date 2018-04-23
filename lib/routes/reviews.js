const router = require('express').Router();
const Review = require('../models/Review');
const { updateOptions } = require('../util/mongoose-helpers');
const check404 = require('./check-404');

module.exports = router
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });