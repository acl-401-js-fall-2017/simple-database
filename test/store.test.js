const assert = require('assert');
const promisify = require('util').promisify;
const MakeDB = require('../lib/make-db');
const path = require('path');
const rimraf = promisify(require('rimraf'));



describe('make stores', () => {
    
    
    const rootDirectory = path.join(__dirname, 'data');
    const DB = new MakeDB(rootDirectory);
    let store = null;
    beforeEach( () => {
        return rimraf(rootDirectory)
            .then (() => {
                return DB.getStore('testerSHane');
            })
            .then ((theStore) => {
                store = theStore;
            });
    });
                

                
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



    it('should return remove false when passed bad id', () => {
        return store.remove('bad id')
            .then ((noItem) => {
                assert.deepEqual(noItem, {removed: false});
            });
    });


    it('getAll() should return an empty array for a newly created store', () => {
        return store.getAll()
            .then ((data) => {
                assert.deepEqual(data, []);
            });
    });


            

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

});

