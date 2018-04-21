const router = require('express').Router();
const Studio = require('../models/Studio');
//const { updateOptions } = require('../util/mongoose-helpers');



module.exports = router
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    });



