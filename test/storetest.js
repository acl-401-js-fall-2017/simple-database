const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const mkdirp = require('mkdirp');
const Store = require('../lib/store');
const db = require('../lib/db');


// const rootDirectory = path.join(__dirname, 'data') //replace data when needed


describe('simple database', () => {
    
    const test_dir = path.join(__dirname, 'test-data');
    // let store = null;
    let animals = null;
    let buildings = null;

    beforeEach(() => rimraf(test_dir));

    beforeEach(() => {
        db.rootDir = test_dir;
        return db.createTable('animals')
            .then(db => animals = db);
    })
            
    


    describe('saves', () => {
    
        it('gets a saved object', () => {
            let newAnimal = { name: 'fido', type: 'puppy' };

            return animals.save(newAnimal)
                .then(animal => {
                    assert.equal(animal.name, newAnimal.name);

                });
        });
    });

    describe('gets', () => {
        
        it('gets saved object with given id', () => {
            let newAnimal = { name: 'fido' };
            
            return animals.save(newAnimal)
                .then(animal => animals.get(animal._id))
                .then(animal => {
                    assert.equal(animal.name, newAnimal.name);
                });



            // store.save(puppy, (err, savedObj) => {
            //     if(err) return done(err);
                
            //     store.get(savedObj._id, (err, fetchedObj) => {
            //         if(err) return done(err);
            //         assert.deepEqual(fetchedObj, savedObj); //deepEqual because comparing objects
            //         done();
            //     });
            // });
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
                
                store.save(kitty, (err) => {
                    if(err) return done(err); 

                    store.getAll((err, filesArr) =>{
                        if(err) return done(err);
                        assert.equal(filesArr.length, 2);
                        done();
                    });
                }); 
            });
        });
    });

     
    describe('Db', () => {
        const dbTestRoot = path.join(__dirname, 'dbTestRoot');
        let db = null;

        beforeEach(done =>{
            rimraf(dbTestRoot,err =>{
                if(err) return done(err);
                db = new Database(dbTestRoot);
                done();
            });
        });

        it('checks the directory name exist in Db rootdir', (done) => {
            db.getStore('testName', (err, store) => {
                if(err) return done(err);
                assert.ok(store instanceof Store);
                assert.equal(store.root, path.join(dbTestRoot, 'testName') );
                done();
            });
        });

    });

});

