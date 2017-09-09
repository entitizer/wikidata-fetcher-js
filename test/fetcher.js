
const { Query, Fetcher, HumanQuery } = require('../lib');
const assert = require('assert');

describe('Fetcher', function () {
    it('should not create without query argument', function () {
        assert.throws(function () { new Fetcher() })
        assert.throws(function () { new Fetcher(null) })
        assert.throws(function () { new Fetcher({}) })
    });
    it('should throw error: no listeners', function () {
        const query = new Query();
        const fetcher = new Fetcher(query);
        assert.throws(function () { fetcher.start() })
    });
    it('should throw error on invalid query', function (done) {
        this.timeout(1000 * 60);
        const query = new Query();
        query.add('dfdfd');
        const fetcher = new Fetcher(query);
        fetcher.on('error', function (error) {
            // console.log('log error', error);
            done();
        });
        fetcher.on('item', (id) => console.log(id));

        fetcher.start();
    });

    it('should get countries', function (done) {
        this.timeout(1000 * 60);
        const query = new Query();
        query.add('?item wdt:P31 wd:Q6256.');
        query.add('?item rdfs:label ?itemLabel.');
        query.add('FILTER((LANG(?itemLabel)) = "ro")');
        const fetcher = new Fetcher(query);

        fetcher.on('error', done);
        fetcher.on('end', done);

        fetcher.on('item', (id, cb) => {
            // console.log(id)
            cb()
        });

        fetcher.start();
    });

    it('should get humans from country: md', function (done) {
        this.timeout(1000 * 60);
        const query = new HumanQuery();
        query.country('Q217')
            .languageCode('ro')
            .dead();
        const fetcher = new Fetcher(query);

        fetcher.on('error', done);
        fetcher.on('end', done);

        fetcher.on('item', (id, cb) => {
            console.log('human', id)
            cb()
        });

        fetcher.start();
    });
});

