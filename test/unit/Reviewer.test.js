const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');

describe.only('Reviewer model', () => {

    const info = {
        name: 'Roger Ebert',
        company: 'rogerebert.com',
        email: 'rober@ebert.com'
    };

    const password = 'abc';

    it('generates hash from password', () => {
        const reviewer = new Reviewer(info);
        reviewer.generateHash(password);
        assert.ok(reviewer.hash);
        assert.notEqual(reviewer.hash, password);
    });

    it('compares password to hast', () => {
        const reviewer = new Reviewer(info);
        reviewer.generateHash(password);
        assert.isOk(reviewer.comparePassword(password));
    });

    it('is a good, valid model', () => {
        const reviewer = new Reviewer(info);
        reviewer.generateHash(password);
        console.log('INFO!!!', info);
        console.log('REV!!!', reviewer);
        info._id = reviewer._id;
        info.hash = reviewer.hash;
        assert.deepEqual(reviewer.toJSON(), info);
        assert.isUndefined(reviewer.validateSync());
    });

    it('has required fields', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.strictEqual(errors.name.kind, 'required');
        assert.strictEqual(errors.company.kind, 'required');
        assert.strictEqual(errors.email.kind, 'required');
        assert.strictEqual(errors.hash.kind, 'required');
    });
});