const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

// const rootDirectory = path.join(__dirname, 'data') //replace data when needed

describe('simple database', () => {
    
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

    describe('saves', () => {
    
        it('gets a saved object', (done) => {
            const puppy = { name: 'fido' };

            store.save(puppy, (err, savedObj) => {
                if(err) return done(err);
                assert.ok(savedObj._id);
                assert.equal(savedObj.name, puppy.name);
                done();
            });
        });
    });

    describe('gets', () => {
        
        it('retrieves saved object with given id', (done) => {
            const puppy = { name: 'fido' };
    
            store.save(puppy, (err, savedObj) => {
                if(err) return done(err);
                
                store.get(savedObj._id, (err, fetchedObj) => {
                    if(err) return done(err);
                    assert.deepEqual(fetchedObj, savedObj); //deepEqual because comparing objects
                    done();
                });
            });
        });

        it('returns null with false id', (done) => {
            const puppy = { name: 'fido' };
    
            store.save(puppy, (err, savedObj) => {
                if(err) return done(err);
                
                store.get('bad_id', (err, fetchedObj) => {
                    if(err) return done(err);
                    assert.equal(fetchedObj, null);
                    done();
                });
            });
        });

        it.skip('fetches all files', (done) => {
            store.getAll();
        });

    });

    describe('removes', () => {
        
        it('removes the file of the object with that id', (done) => {
            const puppy = { name: 'fido' };
        
            store.save(puppy, (err, savedObj) => {
                if(err) return done(err);
                
                store.remove(savedObj._id, (err, status) => {
                    if (err) return done(err);
                    assert.deepEqual(status, { removed: true}); //deepEqual because comparing objects
                    done();
                });
            });
        });

        it('returns {removed: false} for invalid id', (done) => {
            const puppy = { name: 'fido' };
        
            store.save(puppy, (err, savedObj) => {
                if(err) return done(err);
                
                store.remove('bad_id', (err, status) => {
                    if (err) return done(err);
                    assert.deepEqual(status, { removed: false}); //deepEqual because comparing objects
                    done();
                });
            });
        });

        
    });
});

