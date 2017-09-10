
import { Query, QueryWrapper } from './query';

export class HumanQuery extends QueryWrapper {
    constructor(query: Query) {
        super(query);
        this.instanceOf('Q5');
    }

    country(id: string) {
        return this.itemProperty('P27', id);
    }

    alive() {
        return this.itemProperty('P570', '?dateOfDeath', 'NOT_EXISTS')
            .itemProperty('P20', '?placeOfDeath', 'NOT_EXISTS');
    }

    dead() {
        return this.itemProperty('P570', '?dateOfDeath');
    }
}
