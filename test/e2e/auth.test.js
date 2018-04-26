const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');


describe('Authorization API', () => {

    beforeEach(() => 
        dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request.post('api/auth/signup')
            .send({
                email:'myname@me.com',
                password: 'qwerty'
            })
            .then(({ body }) => token = body.token);

    });
    
    it('signup', () => {
        assert.ok(token);
    });

    //it verifies

    //});

});