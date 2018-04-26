const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET || 'changesme';

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            //roles
        };
        return jwt.sign(payload, APP_SECRET);
    },
    verify(token) {
        //this returns the payload, or doesn't
        return jwt.verify(token, APP_SECRET);    
    }
};
