const assert = require('assert');
const Db = require('../lib/make-db');
const rimraf = require('rimraf');
const path = require('path');
const Store = require('../lib/store');

describe('create root directories', () => {
    let db = null;
    const testRootDir = path.join(__dirname, 'data');

    beforeEach(done => {
        rimraf(testRootDir, err => {
            if(err) return done(err);
            db = new Db(testRootDir);
            done();

        });
    });

    it('checks for instances of Store', done => {
        db.getStore('storeName', (err, checkedStore) => {
            if (err) return (err);
            assert.ok(checkedStore instanceof Store);
            done();
        });
    });
});
