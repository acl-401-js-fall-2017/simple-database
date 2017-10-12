const assert = require('assert');
const path = require('path');

const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

const Store = require('../lib/store');
const Database = require('../lib/makeDb');




// const rootDirectory = path.join(__dirname, 'data') //replace data when needed


describe('simple database', () => {
    
    const root = path.join(__dirname, 'root');
    let store = null;

    beforeEach(() => {
        return rimraf(root)
            .then(()=>{
                return mkdirp(root);
            })
            .then(()=>{
                return store = new Store(root);
            });
    });
   
    


    describe('saves', () => {
    
        it('gets a saved object', () => {
            const puppy = { name: 'fido' };

            return store.save(puppy)
                .then((savedObj) => {
                    assert.ok(savedObj._id);
                    assert.equal(savedObj.name, puppy.name);
                });        
        });
    });
   


    describe('gets', () => {
        
        it('retrieves saved object with given id', () => {
            const puppy = { name: 'fido' };
            let saved =null;
            return store.save(puppy)
                .then((savedObj) => {
                    saved =savedObj;
                    return store.get(savedObj._id);
                })
                .then((fetchedObj) => {
                    assert.deepEqual(fetchedObj, saved);
                });
        });
        
        it('returns null with false id', () => {
            const puppy = { name: 'fido' };
    
            return store.save(puppy)
                .then(() => {
                    return store.get('bad_id');
                })
                .then((fetchedObj) => {
                    assert.equal(fetchedObj, null); 
                });
        });
    });
        
    

    describe('removes', () => {
        
        it('removes the file of the object with that id', () => {
            const puppy = { name: 'fido' };
        
            return store.save(puppy)
                .then((savedObj) => {
                    return store.remove(savedObj._id);
                })
                .then((status) => {
                    assert.deepEqual(status, { removed: true});
                });
        });
        

        it('returns {removed: false} for invalid id', () => {
            const puppy = { name: 'fido' };
            
            return store.save(puppy)
                .then((savedObj) => {
                    return store.remove('bad_id');
                })
                .then((status) => {
                    assert.deepEqual(status, { removed: false});
                });
        });
    });


    xdescribe('getsAll', () =>{

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

     
    xdescribe('Db', () => {
        const dbTestRoot = path.join(__dirname, 'dbTestRoot');
        let db = null;

        beforeEach( () => {
            return rimraf(dbTestRoot)
                .then(() =>{
                    return db = new Database(dbTestRoot);
                });
                
        });
        

        it('checks the directory name exist in Db rootdir', () => {
            return db.getStore('testName')
                .then(() => {
                    assert.ok(store instanceof Store); 
                    assert.equal(store.root, path.join(dbTestRoot, 'testName') );
                });
        });
    });
});

