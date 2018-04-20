const router = require('express').Router();
const Actor = require('../models/Actor');

module.exports = router
    .get('/', (req, res) => {
        console.log('request heard');
    });