# wikidata-fetcher

A nodejs module for fetching wikidata entities.

## Usage

```js

import { Query, Fetcher } from 'wikidata-fetcher';

const query = new Query();
// instance of human
query.instaceOf('Q5');
// has an English label
query.languageCode('en');

const fetcher = new Fetcher(query);

fetcher.on('item', (id, done) => {
    console.log('got human id', id);
    done();
});

fetcher.start();

```
