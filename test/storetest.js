const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

// const rootDirectory = path.join(__dirname, 'data') //replace data when needed

describe('simple database', () => {
    
    const root = path.join(__dirname, 'root');
    let store = null;

    beforeEach(done => {
        rimraf( root, err => {
            if(err) return done(err);
            mkdirp(root, err => {
                if(err) return done(err);
                store = new Store(root);
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

    describe('getsAll', () =>{

        it('gets all files created', (done) => {
            let puppy = { name: 'fido' }; 
            let kitty = { name: 'meow' };

            store.save(puppy, (err) => {
                if(err) return done(err);  
            });
            store.save(kitty, (err) => {
                if(err) return done(err); 
            });

            store.getAll((err, filesArr) =>{
                if(err) return done(err);
                assert.equal(filesArr.length, 2);
                done();
            });
            
        });
    });
});
