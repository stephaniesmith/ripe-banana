const { assert } = require('chai');
const tokenService = require('../../lib/util/ensure-auth');

describe('ensure auth middleware', () => {

    const reviewer = { _id: 123 };
    let token = '';
    beforeEach(() => token = tokenService.sign(reviewer));

    it('adds payload as req.reviewer on success', done => {

    });

});