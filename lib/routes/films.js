const router = require('express').Router();
const Film = require('../models/Film');
const Review = require('../models/Review');
const check404 = require('./check-404');

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
        const { id } = req.params;

        Promise.all([
            Film.findById(id)
                .lean()
                .select('title studio released cast')
                .populate({
                    path: 'cast.actor',
                    select: 'name'
                })
                .populate({
                    path: 'studio',
                    select: 'name'
                }),

            Review.find({ film: id })
                .lean()
                .select('rating review reviewer')
                .populate({
                    path: 'reviewer',
                    select: 'name'
                })
        ])
            .then(([film, reviews]) =>  {
                check404(film, id);
                film.reviews = reviews;
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