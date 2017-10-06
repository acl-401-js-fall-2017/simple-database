const assert = require('assert');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');
const path = require('path');

describe('create storeDir name', () => {
    // eslint-disable-next-line
    const testDir = path.join(__dirname, 'data');
    let store = null;

    beforeEach(done => {
        rimraf(testDir, err => {
            if (err) return done(err);
            mkdirp(testDir, err => {
                if (err) return done(err);
                // eslint-disable-next-line
                store = new Store(testDir);
                done();
            });
        });
    });

    it('gets a saved obj', done => {
        const obj1 = {name: 'Zac'};
        store.save(obj1, (err, savedObj1) => {
            if(err) return done(err);
            assert.ok(savedObj1._id);
            assert.equal(savedObj1.name, obj1.name);

            store.get(savedObj1._id, (err, gotObj1) => {
                if(err) return done(err);
                assert.deepEqual(gotObj1, savedObj1);
                done();
            });
        });
    });
});