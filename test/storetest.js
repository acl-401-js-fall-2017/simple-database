const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

// const rootDirectory = path.join(__dirname, 'data') //replace data when needed

describe('saves file', () => {
    
    const dataDir = path.join(__dirname, 'dataDir');
    let store = null;

    beforeEach(done => {
        rimraf( dataDir, err => {
            if(err) return done(err);
            mkdirp(dataDir, err => {
                if(err) return done(err);
                store = new Store(dataDir);
                done();
            });
        });
    });

    it('gets a saved object', (done) => {
        const puppy = { name: 'fido' };

        store.save(puppy, (err, saved) => {
            if(err) return done(err);
            assert.ok(saved._id);
            assert.equal(saved.name, puppy.name);

            store.get(saved._id, (err, got) => {
                if(err) return done(err);
                assert.deepEqual(got, saved);
                
            });
        });
        done();
    });
});



