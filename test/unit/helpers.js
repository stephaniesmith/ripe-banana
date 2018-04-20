const { assert } = require('chai');

const getErrors = (validation, expected) => {
    assert.isDefined(validation, 'expected validation errors');
    const { errors } = validation;
    assert.isDefined(errors);
    if(expected !== undefined) {
        assert.equal(Object.keys(errors).length, expected);
    }
    return errors;
};

module.exports = { getErrors };