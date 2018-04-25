const getParam = (req, res, next, value, name) => {
    req[name] = value;
    next();
};

const respond = asyncFn => {
    return (req, res, next) => {
        asyncFn(req)
            .then(data => {
                if(req.id && !data) {
                    throw {
                        status: 404,
                        error: `id ${req.id} does not exist`
                    };
                }
                else res.json(data);
            })
            .catch(next);
    };
};

module.exports = {
    getParam,
    respond
};