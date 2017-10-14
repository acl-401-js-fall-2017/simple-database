const assert = require('assert');
const promisify = require('util').promisify;
const MakeDB = require('../lib/make-db');
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = promisify(require('rimraf'));
const {readdir} = require('../lib/fsp');
const Store = require('../lib/store');



describe('make dB and stores', () => {
    let store = null;
    
    
    
    // beforeEach( done => {
        //     rimraf(rootDirectory, err => {
            //         if (err) return done(err);
            //         DB.createStore('testerSHane', (err, theStore) => { 
                //             if (err) return done(err);
                //             store = theStore;
                //             done();
                //         });
                //     });
                // });
                
    beforeEach( () => {
        return rimraf(rootDirectory)
            .then (() => {
                return DB.createStore('testerSHane');
            })
            .then ((theStore) => {
                store = theStore;
            });
    });
                
                
    // let testObject = {
    //     name: 'dog'
    // };
    // let testObject2 = {
    //     name: 'cat'
    // };
    // let testObject3 = {
    //     name: 'horse'
    // };
                
    it('should get saved object', () => {
        const testObject = {
            name: 'dog'
        };
        return store.save(testObject) 
            .then ((testObject) => {
                assert.ok(testObject._id);
                assert.equal(testObject.name, 'dog');

                return store.get(testObject._id) 
                    .then ((gottestObject) => {
                        assert.deepEqual(gottestObject, testObject);
                    });      
            });
    });
            


    // it('should get saved object', done => {
    //     store.save(testObject,(err, savedtestObject) => {
    //         if (err) return done(err);
    //         assert.ok(savedtestObject._id);
    //         assert.equal(savedtestObject.name, testObject.name);
    //         store.get(savedtestObject._id, (err, gottestObject) => {
    //             if (err) return done(err);
    //             assert.deepEqual(gottestObject, savedtestObject);
    //             done();
    //         });
    //     }); 
    // });


    it('should get "bad id" return null', () => {
        return store.get('bad id')
            .then ((noItem) => {
                assert.deepEqual(noItem, null);
            });
    });


    it('should remove object with id', () => {
        let id = '';
        let testObject = {
            name: 'dog'
        };
        return store.save(testObject)
            .then ((testObject) => {
                id = testObject._id;
                return store.remove(id); 
            })
            .then ((status) => {
                assert.deepEqual(status, { removed: true });
            })

            .then (() => {
                return store.get(id);
            })
            .then ((gotObj) => { 
                assert.deepEqual(gotObj, null);
            });               
    });    


    // it('should remove object with id', done => {
    //     store.save(testObject, (err, savedtestObject) => {
    //         store.remove(savedtestObject._id, (err, bool) => {
    //             if (err) return done(err);
    //             assert.deepEqual(bool, { removed: true });
    //             store.get(savedtestObject._id, (err, data) => {
    //                 if (err) return done(err);
    //                 assert.deepEqual(data, null);
    //                 done();
    //             });               
    //         });
    //     });    
    // });

    it('should return remove false when passed bad id', () => {
        return store.remove('bad id')
            .then ((noItem) => {
                assert.deepEqual(noItem, {removed: false});
            });
    });


    it('getAll() should return an empty array for a newly created store', () => {
        // let data = [];
        return store.getAll()
            .then ((data) => {
                assert.deepEqual(data, []);
            });
    });

    // it('getAll() should return an empty array for a newly created store', done => {
    //     store.getAll((data, err)=>{
    //         if (err) return done(err);
    //         assert.deepEqual(data, []);
    //         done();
    //     });
    // });

            

    it('should return an array of all objects in the directoy.', () => {
        const testObjects = [
            {name: 'dog'},  
            {name: 'cat'},
            {name: 'horse'}
        ];
        let savedData = null;
        return Promise.all(testObjects.map(obj => store.save(obj)))
            .then((_savedData) => {
                savedData = _savedData;
                savedData = savedData.map(obj => obj.name);
                return store.getAll();
            })
            .then ((all) => {
                all = all.map(obj => obj.name);
                assert.deepEqual(all.sort(), savedData.sort());
            });
    });

    // store.save(testObject, (err, data)=>{
    //     if (err) return done(err);
    //     let savedObj1 = data;
//         store.save(testObject2, (err, data)=>{
//             if (err) return done(err);
//             let savedObj2 = data;
//             store.save(testObject3, (err, data)=>{
//                 if (err) return done(err);
//                 let savedObj3 = data;
//                 store.getAll((data, err) =>{
//                     if (err) return done(err);
//                     let sortedData = data.map((obj)=>{
//                         return obj.name;
//                     });
//                     assert.deepEqual(sortedData.sort(), [savedObj1.name, savedObj2.name, savedObj3.name].sort());
//                     done();
//                 });
//             });               
//         });
//     });
// });



    it('getStore should return an instance of the store', () => {
        return DB.getStore('animals')
            .then((newStore) => {
                assert(newStore instanceof Store);
                assert.deepEqual(newStore.directory, path.join(rootDirectory, 'animals'));
            });
    });

    
    


    it('should create two store instances on unique paths', () => {
        return DB.getStore('michele')
            .then(() => {
                return readdir(DB.rootDir)
                    .then((dirNames) => {
                        assert.deepEqual(dirNames, ['michele', 'testerSHane']);
                    });
            });
    });
});

