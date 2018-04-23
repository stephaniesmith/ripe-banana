const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer'
    },
    review: {
        ...RequiredString,
        maxlength: 140,
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', schema);