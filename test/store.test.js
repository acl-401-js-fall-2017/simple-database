const assert = require('assert');

class Store {
    constructor() {
        this.list = [];
    }
}
let store = null;
describe('make store', () => {

    beforeEach(function() {
        store = new Store();
    });

    it('should make a new store', () => {
        assert.ok(store);
    });
});