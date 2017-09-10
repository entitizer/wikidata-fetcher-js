
import { Query, QueryOptions } from './query';
import { HumanQuery } from './human-query';
import { PlaceQuery } from './place-query';

export class QueryBuilder {
    private _query: Query

    constructor(private _queryOptions: QueryOptions) {
        this._query = new Query(_queryOptions);
    }

    query() {
        return this._query;
    }

    // add(condition: string): this {
    //     this._query.add(condition);
    //     return this;
    // }
    // languageCode(lang: string): this {
    //     this._query.languageCode(lang);
    //     return this;
    // }
    // itemProperty(prop: string, value: string, filter?: "NOT_EXISTS"): this {
    //     this._query.itemProperty(prop, value, filter);
    //     return this;
    // }
    // instanceOf(value: string): this {
    //     this._query.instanceOf(value);
    //     return this;
    // }
    // subclassOf(id: string) {
    //     return this._query.itemProperty('P279', id);
    // }

    human() {
        return new HumanQuery(this._query);
    }

    populatedPlace() {
        return new PlaceQuery(this._query).add('');
    }

    country() {
        return new PlaceQuery(this._query).instanceOf('Q6256');
    }

    capital() {
        return new PlaceQuery(this._query).instanceOf('Q5119');
    }

    bigCity() {
        return new PlaceQuery(this._query).instanceOf('Q1549591');
    }

    city() {
        return new PlaceQuery(this._query).instanceOf('Q515');
    }

    town() {
        return new PlaceQuery(this._query).instanceOf('Q3957');
    }

    village() {
        return new PlaceQuery(this._query).instanceOf('Q532');
    }

    seatVillage() {
        return new PlaceQuery(this._query).instanceOf('Q4413925');
    }

}
