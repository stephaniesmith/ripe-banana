const router = require('express').Router();
const { respond } = require('./route-helper');
const Reviewer = require('../models/Reviewer');

module.exports = router
    .post('/signup', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.exists({ email })
                .then(exists => {
                    const reviewer = new Reviewer(body);
                    reviewer.generateHash(password);
                    return reviewer.save();
                })
                .then(reviewer => {
                    return { token: reviewer._id };
                });
        }
    ));