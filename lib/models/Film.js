const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('../util/mongoose-helpers');

const schema = new Schema({ 
    title: RequiredString,
    studio: RequiredNumber,
    released: RequiredNumber,
    cast: [Object]
});

module.exports = mongoose.model('Film', schema);