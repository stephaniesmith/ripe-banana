
module.exports = function(requiredRole) {
    return (req, res, next) => {

        const role = req.get('Authorization');

        if(role !== requiredRole) {
            next({
                status: 403,
                error: `requires ${requiredRole} role`
            });
        }
        else next();
    };
};