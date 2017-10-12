
const app = require('../lib/app');
const {promisify} = require('util');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');
const path = require('path');
const Store = require('../lib/Store');

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
                        assert.deepEqual(savedObj, { title: 'the Jungle Book', year: '1967', id: savedObj._id });
                    });
            });
        });
    });

});