const router = require('express').Router();
const { respond } = require('./route-helpers');
const User = require('../models/User');
const { sign } = require('../util/ensure-auth');
const createEnsureAuth = require('../util/ensure-auth');

module.exports = router

    .get('verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ))

    .post('/signup', respond(
        req => {
            const { email, password } = req.body;
            delete req.body.password;

            return User.exists({ email })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'email already exists'
                        };
                    }

                    const user = new User(req.body);
                    user.generateHash(password);
                    return user.save();

                })
                .then(user => {
                    return { token: sign(user) };
                });
        }
    ));


