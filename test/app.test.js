'use strict';

const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');
const Store = require('../lib/Store');

const storeDir = __dirname + '/testStore';


describe('Store:', () => {
    describe('constructor', () => {
        it('creates a new store object', () => {
            const newStore = new Store(storeDir);
            assert.ok(newStore instanceof Store);
        });
    });

    describe('save method', () => {
        
    });
});