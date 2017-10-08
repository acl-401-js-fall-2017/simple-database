const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

// const rootDirectory = path.join(__dirname, 'data') //replace data when needed

describe('database', () => {
    
    const test_dir = path.join(__dirname, 'test');
    let store = null;

    beforeEach(done => {
        rimraf( test_dir, err => {
            if(err) return done(err);
            mkdirp(test_dir, err => {
                if(err) return done(err);
                store = new Store(test_dir);
                done();
            });
        });
    });

    it.only('gets a saved object', (done) => {
        const puppy = { name: 'fido' };

        store.save(puppy, (err, saved) => {
            if(err) return done(err);
            assert.ok(saved._id);
            assert.equal(saved.name, puppy.name);

            store.get(saved._id, (err, got) => {
                if(err) return done(err);
                assert.deepEqual(got, saved);
                done();
            });
        });
    });

    it('returns null for a bad id',(done) => {
        const noId = {};

        store.get(noId, (err, got) => {
            if(err) return done(err);
            assert.equal(got, null);
        });
        done();
    });
    
    it('save an object and removes the object with given id', (done) => {
        const puppy = { name: 'fido' };
        
        store.save(puppy);
        store.remove(puppy._id, (err, removed) => {
            if(err) return done(err);
            assert.equal(removed, {removed: true});
        });
        done();
    });
});