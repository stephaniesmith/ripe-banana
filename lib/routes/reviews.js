const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .lean()
            .sort({ createdAt: -1 })
            .limit(100)
            .select('rating review')
            .populate({
                path: 'film',
                select: 'title'
            })
            .then(reviews => res.json(reviews))
            .catch(next);
    });