const assert = require('assert');
const Store = require('../lib/store.js');
const Db = require('../lib/db.js');

// console.log('DIRNAME', __dirname);
// console.log('FILENAME', __filename);

describe('DataBase', () =>{

    it('returns an DB object',() =>{
        const freshDB = new  Db(__dirname);
        assert.ok(freshDB instanceof  Db);
    });

});