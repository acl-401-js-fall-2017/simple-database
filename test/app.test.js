
const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');
const path = require('path');
const Store = require('../lib/Store');

const {promisify} = require('util');
const readFileAsync = promisify(require('fs').readFile);

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
        beforeEach(() => {
            newStore = new Store(storeDir);
            lionKing = { title: 'the Lion King', year: '1994' };
            mulan = { title: 'Mulan', year: '1998' };
            moana = { title: 'Moana', year: '2016'};
        });

        describe('save method', () => {
            it('gives the object an _id/filename and saves it to a file', () => {
                const jungleBook = { title: 'the Jungle Book', year: '1967' };
                newStore.save(jungleBook)
                    .then(savedObj => {
                        const expectedObj = { title: 'the Jungle Book', year: '1967', _id: savedObj._id };
                        assert.deepEqual(savedObj, expectedObj);
                        assert.ok(savedObj !== jungleBook);
                        console.log(path.join(newStore.path, savedObj._id));
                        return readFileAsync(path.join(newStore.path, savedObj._id), 'utf8')
                            .then((data, err) => {
                                if(err) throw err;
                                assert.deepEqual(JSON.parse(data), expectedObj);
                            });
                    });
            });
        });
    });

});