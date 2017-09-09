
import { Query } from './query';

export class HumanQuery extends Query {
    constructor(options?: { prefixes?: string, pagesize?: number, itemName?: string }) {
        super(options);
        this.instanceOf('Q5');
    }

    alive() {
        return this.itemProperty('P570', '?dateOfDeath', 'NOT_EXISTS')
            .itemProperty('P20', '?placeOfDeath', 'NOT_EXISTS');
    }

    dead() {
        return this.itemProperty('P570', '?dateOfDeath');
    }
}
