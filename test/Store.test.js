
const Store = require('../lib/Store');
const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const rimrafAsync = promisify(require('rimraf'));
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);

const storeDir = path.join(__dirname, 'testStore');


describe('Store:', () => {
    describe('constructor', () => {
        it('creates a new store object', () => {
            const newStore = new Store(storeDir);
            assert.ok(newStore instanceof Store);
        });
    });
    
    describe('store methods', () => {
        
        let newStore = null;
        let lionKing = null;
        let mulan = null;
        let moana = null;

        before(() => {
            newStore = new Store(storeDir);
        });
        
        beforeEach(() => {
            const savePromiseArr = [
                newStore.save({ title: 'the Lion King', year: '1994' }),
                newStore.save({ title: 'Mulan', year: '1998' }),
                newStore.save({ title: 'Moana', year: '2016'})
            ];
            return Promise.all(savePromiseArr)
                .then(savedArr => {
                    lionKing = savedArr[0];
                    mulan = savedArr[1];
                    moana = savedArr[2];
                });
        });
        
        afterEach(() => {
            return rimrafAsync(newStore.path)
                .then(() => {
                    mkdirAsync(newStore.path);
                });
        });

        describe('save method', () => {
            it('gives the object an _id/filename and saves it to a file', () => {
                const jungleBook = { title: 'the Jungle Book', year: '1967' };
                newStore.save(jungleBook)
                    .then(savedObj => {
                        const expectedObj = { title: 'the Jungle Book', year: '1967', _id: savedObj._id };
                        assert.deepEqual(savedObj, expectedObj);
                        assert.ok(savedObj !== jungleBook);
                        return readFileAsync(path.join(newStore.path, savedObj._id) + '.json', 'utf8')
                            .then((data, err) => {
                                if(err) throw err;
                                assert.deepEqual(JSON.parse(data), expectedObj);
                            });
                    });
            });
        });

        describe('get method', () => {
            it('returns the object with the given extant id', () => {
                return newStore.get(lionKing._id)
                    .then(obj => {
                        assert.deepEqual(obj, lionKing);    // to check that the objects are equivalent
                        assert.notEqual(obj, lionKing);     // but not the same reference
                    });
            });
            
            it('returns null when given a bad id', () => {
                return newStore.get('bad id!')
                    .then(obj => {
                        assert.equal(obj, null);   
                    });
            });
        });

        describe('remove method', () => {
            it('returns {removed: true} when given extant id', () => {
                return newStore.remove(lionKing._id)
                    .then(obj => {
                        assert.deepEqual(obj, {removed: true});
                    });
            });
            
            it('returns {removed: false} when given bad id', () => {
                return newStore.remove('bad id!')
                    .then(obj => {
                        assert.deepEqual(obj, {removed: false});
                    });
            });
        });

        describe('get all method', () => {
            it('returns an array of all objects in the file system', () => {
                return newStore.getAll()
                    .then(output => {
                        assert.equal(output.length, 3);
                        assert.deepInclude(output, lionKing);
                        assert.deepInclude(output, mulan);
                        assert.deepInclude(output, moana);
                    });
            });
        });
    });
});