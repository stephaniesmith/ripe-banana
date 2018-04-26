const assert = require('assert');
const User = require('../../lib/models/User');


describe('User model', () => {
    const data = {
        email: 'myname@me.com',
    
    };
    const password = 'qwerty';
    let user = null;
    beforeEach(() => {
        user = new User(data);
        user.generateHash(password);
    });

    it('creates a hash from password', () => {
        //const user = newUser(data);
        //user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });
});