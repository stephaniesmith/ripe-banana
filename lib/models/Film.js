const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('../util/mongoose-helpers');

const schema = new Schema({ 
    title: RequiredString,
    studio: RequiredNumber,
    released: RequiredNumber,
    cast: [{
        part: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            require: true
        }
    }]
});

module.exports = mongoose.model('Film', schema);