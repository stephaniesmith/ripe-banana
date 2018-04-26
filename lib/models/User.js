const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt.js');
const { RequiredString } = require('./required-types');

const schema = new Schema({
    email: RequiredString,
    hash: RequiredString
});


Schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, this.hash);
    }
};


module.exports = mongoose.model('User', schema);