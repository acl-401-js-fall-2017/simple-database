const assert = require('assert');
const Store = require('../lib/store.js');
const fs = require('fs');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const dbName = (__dirname + '/db');
const storeName = (dbName + '/myStore');
const deepequal = require('deep-equal');
const { readdir } = require('../lib/fsp');
const { writeFile } = require('../lib/fsp');
const mkdirp = promisify(require('mkdirp'));
const Db = require('../lib/db.js');




describe('Stores', () => {
    
    let myStore = null;
    const thing = { name : 'thing', description : 'a thing'};
    let thingId = null;
    const mountain = { name : 'hood', state : 'Oregon'};

    //2 describes because get all is not crud;

    describe('CRUD', () => {
        beforeEach( () => {
            return rimraf(storeName)
                .then(() =>{
                    return mkdirp(storeName);
                })
                .then(() => {
                    return writeFile('/myStore');
                });

            // freshDB = new Db(__dirname, done)
            // if (fs.existsSync(storeName)) {
            //     rimraf(storeName, () => {
            //         myStore = new Store(storeName);
            //     });
            // } else {
            //     myStore = new Store(storeName);
            // }
        });


        it('saves a new object and assigns it an ID', () => {
            let saved = null;
            myStore.save(mountain)
                .then(_saved =>{
                    saved = _saved;
                    assert.equal(saved.name, 'hood');
                    return myStore.get(saved._id);
                })
                .then( item =>{
                    assert.equal(item, saved);
                });
        });

        it('gets the object with thing ID', done =>{
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let gotten = null;
                myStore.get(thingId, (error, newObj) =>{
                    if(error){
                        return done(error);
                    }
                    gotten = newObj;
                    assert.deepEqual(gotten, {  name: 'thing', description: 'a thing' , _id: gotten._id });
                    done();
                });
            });
        });

        it('removes object with given ID {removed : true}', done =>{
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let removed = null;
    
                myStore.remove(thingId, (error,status) => {
                    if (error) {
                        return done(error);
                    }
                    removed = status;
                    assert.deepEqual(removed, {removed : true});
                    done();
                });
            });

        });

        it('removes object with given ID { removed: false }', done => {
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let removed = null;
                myStore.remove('bad ID', (error, status) => {
                    if (error) {
                        return done(error);
                    }
                    removed = status;
                    assert.deepEqual(removed, { removed: false });
                    done();
                });
            });
        });
    });

    describe('Get all', () => {

        beforeEach(() => {
            if (fs.existsSync(storeName)) {
                rimraf(storeName, () => {
                    myStore = new Store(storeName);
                });
            } else {
                myStore = new Store(storeName);
            }
        });

        it('gets all of the object files in the store', done =>{
            let allObjArr=[];

            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thing._id= newObj._id;
                myStore.save(mountain, (err, newObj) => {
                    if (err) console.error(err);
                    mountain._id = newObj._id;

                    myStore.getAll((err,allObj) =>{
                        if (err) {
                            return done(err);
                        }
                        allObjArr = allObj;
                        assert.ok(
                            deepequal(allObjArr, [ thing, mountain]) ||
                            deepequal(allObjArr, [mountain, thing] ) 
                            
                        );
                        done();
                    });
                });
            });
        });
    });
});