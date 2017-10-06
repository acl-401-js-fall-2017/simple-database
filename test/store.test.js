const assert = require('assert');
const shortid = require('shortid');

class Store {
    constructor() {
        this.list = [];
    }
    save(obj) {
        obj._id = shortid.generate();
    }
}
let store = null;
let obj1 = null;
describe('make store', () => {

    beforeEach(function() {
        store = new Store();
        obj1 = {
            name: 'dog'
        };
    });

    it('should make a new store', () => {
        assert.ok(store);
    });

    it('should create an id property for the object', () => {
        store.save(obj1);
        assert.deepEqual(typeof obj1._id, 'string');
    });

    it('should get saved object', done => {
        store.save(obj1,(err, savedObj1) => {
            if (err) return done(err);
            assert.ok(savedObj1._id);
            assert.equal(savedObj1.name, obj1.name);

            store.get(savedObj1._id, (err, gotObj1) => {
                if (err) return done(err);
                assert.deepEqual(gotObj1, savedObj1);
                done();
            });
        }); 
    });
});