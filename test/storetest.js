const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const readdir = promisify(fs.readdir);
const mkdirp = require('mkdirp');
const Store = require('../lib/store');
const MakeDB = require('../lib/MakeDB');
const rootDir = path.join(__dirname, 'data');
const DB = new MakeDB(rootDir);


// const rootDirectory = path.join(__dirname, 'data') //replace data when needed


describe('simple database', () => {
    
    const test_dir = path.join(__dirname, 'test-data');
    // let store = null;
    let animals = null;
    let buildings = null;

    beforeEach(() => rimraf(test_dir));

    beforeEach(() => {
        DB.rootDir = test_dir;
        return DB.createTable('animals')
            .then(db => animals = db);
    });
            
    
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
        });

        it('returns null with false id', () => {
            return animals.get('bad-id')
                .then(animal => {
                    assert.equal(animal, null);
                });
        });
    


    });

    describe('removes', () => {
        
        it('removes the file of the object with that id', () => {
            let newAnimal = { name: 'fido'};

            return animals.save(newAnimal)
                .then(animal => animals.remove(animal._id))
                .then( status => {
                    assert.deepEqual(status, { removed: true }   );
                    
                });
            
        });

        it('returns {removed: false} for invalid id', () => {
            let newAnimal = { name: 'fido' };

            return animals.save(newAnimal)
                .then(animal => animals.remove(animal))
                .then( status => {
                    assert.deepEqual( status, { removed: false } );
                });
        
        
        }); 
    });


    describe('getsAll', () =>{

        it('gets all files created', () => {
            let newAnimal1 = { name: 'fido' }; 
            let newAnimal2 = { name: 'meow' };

            return animals.save(newAnimal1)
                .then(animals.save(newAnimal2))
                .then(animals.getAll( files => {
                    assert.equal(files.length, 2);
                }));

        });
    });


    it('getStore should return an instance of store', () => {
        return DB.getStore('animals')
            .then((data) => {
                readdir(data.directory, 'utf8')
                    .then((dir) => {
                        assert.deepEqual(dir, []);
                        assert.deepEqual(data.root, path.join(dir, 'animals'));
                    });
            });
    });

    it('should create two store instances on unique paths', () => {
        DB.getStore('Chris')
            .then(() => {
                return readdir(DB.rootDir)
                    .then((data) => {
                        assert.deepEqual(data.sort(), ['Chris', 'test']);
                    });
            });
    });

});


