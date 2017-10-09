const MakeDb = require('../lib/db.js');
const Store = require('../lib/store');
const path = require('path');
const rimraf = require('rimraf');
const assert = require('assert');


describe('db test functions', () =>{
    let db = null;
    const testDir = path.join(__dirname, 'test-file');

    beforeEach( done => {
        rimraf( testDir, err => {
            if(err) return done(err);
            db = new MakeDb(testDir);
            done();
        });
    });

    it('checks for instances of stores', done => {

        db.getStore('StoreName', (err, createdStore) => {
            if(err) return done(err);
            assert.ok(createdStore instanceof Store);
            done();
        });
    });

});