const tokenService = require('./token-service');

module.exports = function() {
    return (req, res, next) => {
        const token = req.get('Authorization');
        try {
            if(!token) return next({ status: 400, error: 'No token found' });

            const payload = tokenService.verify(token);

            req.reviewer = payload;

            next();
        }
        catch (err) {
            next({
                status: 401,
                error: 'Invalid token'
            });
        }
    };
};