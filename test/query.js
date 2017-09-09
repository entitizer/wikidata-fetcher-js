
const { Query } = require('../lib/query');
const assert = require('assert');

describe('Query', function () {
    it('should create a new Query with no params', function () {
        let query = new Query();
        assert.ok(query);
        assert.equal(50, query.pagesize);
        query = new Query(null);
        assert.ok(query);
        assert.equal(50, query.pagesize);
        quer = new Query({});
        assert.ok(query);
        assert.equal(50, query.pagesize);
    });

    it('should create a new Query with params', function () {
        let query = new Query({ pagesize: 21 });
        assert.ok(query);
        assert.equal(21, query.pagesize);
    });

    it('should fail set condition if exists queryBody', function () {
        let query = new Query({ queryBody: 'query' });
        assert.ok(query);
        assert.throws(function () { query.add('condition') });
    });

    it('should build query', function () {
        let query = new Query();
        assert.ok(query);
        query.add('?item wdt:P31 wd:Q6256')
        let sq = query.toString();
        assert.ok(sq);
        // console.log(sq);
    });
});

