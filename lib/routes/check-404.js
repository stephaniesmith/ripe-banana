module.exports = (doc, id) => {
    if(!doc) {
        throw {
            status: 404,
            error: `id ${id} not found`
        };
    }
};