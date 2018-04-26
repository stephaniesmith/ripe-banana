const router = require('express').Router();
const { respond } = require('./route-helpers');
//const User = require('../models/User');
//const { sign } = require('../util/ensure-auth');
const createEnsureAuth = require('../util/ensure-auth');

module.exports = router

    .get('verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ));

