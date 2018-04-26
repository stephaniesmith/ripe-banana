const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET || 'changemenow';

module.exports = {
    sign(reviewer) {
        const payload = {
            id: reviewer._id,
        };

        return jwt.sign(payload, APP_SECRET);
    },
    verify(token) {
        return jwt.verify(token, APP_SECRET);
    }
};