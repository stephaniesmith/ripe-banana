const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('ensure auth middleware', () => {
    const user = { _id: 'qwerty' };
    let token = token;

    beforeEach(() => token = tokenService.sign(user));

    const ensureAuth = createEnsureAuth();

    it('adds a payload as req.user upon success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };
        const next = () => {
            assert.equal(req.user.id, user._id);
            done();
        };
        ensureAuth(req, null, next);
    });
});