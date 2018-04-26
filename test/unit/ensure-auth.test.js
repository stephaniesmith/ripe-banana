const { assert } = require('chai');
const tokenService = require('../../lib/util/token-service');
const ensureAuth = require('../../lib/util/ensure-auth');

describe('ensure auth middleware', () => {

    const reviewer = { _id: 123 };
    let token = '';
    beforeEach(() => token = tokenService.sign(reviewer));

    const ensureAuth = createEnsureAuth();

    it('adds payload as req.reviewer on success', done => {
        const req = {
            get() {

            }
        };
        const next = () => {
            assert.equal(req.reviewer.id, reviewer._id);
            done();
        };
    });

});