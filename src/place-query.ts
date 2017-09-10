
import { Query, QueryWrapper } from './query';

export class PlaceQuery extends QueryWrapper {
    constructor(query: Query) {
        super(query);
        // located in the administrative territorial entity
        // this.itemProperty('P131', '?p131');
    }

    locatedInAdm(id: string) {
        return this.itemProperty('P131', id);
    }
}
