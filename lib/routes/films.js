const router = require('express').Router();
const Film = require('../models/Film');
// const { updateOptions } = require('../util/mongoose-helpers');

// const check404 = (actor, id) => {
//     if(!actor) {
//         throw {
//             status:404,
//             error: `Actor id ${id} does not exist`
//         };
//     }
// };

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    });