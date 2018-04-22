const router = require('express').Router();
const Studio = require('../models/Studio');
//const { updateOptions } = require('../util/mongoose-helpers');


/*const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio id ${id} does not exist`
        };
    }
};*/

module.exports = router
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    });




