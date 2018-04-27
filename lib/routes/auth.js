const router = require('express').Router();
const { respond } = require('./route-helper');
const Reviewer = require('../models/Reviewer');
const { sign } = require('../util/token-service');
const createEnsureAuth = require('../util/ensure-auth');


const hasEmailAndPassword = ({ body }, res, next) => {
    const { email, password } = body;
    if(!email || !password) {
        throw {
            status: 401,
            error: 'Email and password required'
        };
    }
    next();
};

module.exports = router
    .get('/verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ))

    .post('/signup', hasEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.exists({ email })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'Email exists'
                        };
                    }

                    const reviewer = new Reviewer(body);
                    reviewer.generateHash(password);
                    return reviewer.save();
                })
                .then(reviewer => {
                    return { 
                        token: sign(reviewer),
                        _id: reviewer._id,
                        roles: reviewer.roles
                    };
                });
        }
    ))

    .post('/signin', hasEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return Reviewer.findOne({ email })
                .then(reviewer => {
                    if(!reviewer || !reviewer.comparePassword(password)) {
                        throw {
                            status: 401,
                            error: 'Invalid email or password'
                        };
                    }
                    return { token: sign(reviewer) };
                });
        }
    ));