
export type QueryCondition = string;

export interface IQuery {
    toString(incrementPage?: boolean): string
    readonly itemName: string
    readonly pagesize: number
}

export class Query implements IQuery {
    private offset = 0
    private conditions: string[] = []

    get itemName() {
        return this.options.itemName;
    }
    get pagesize() {
        return this.options.pagesize;
    }

    constructor(private options?: { prefixes?: string, pagesize?: number, itemName?: string, queryBody?: string }) {
        this.options = Object.assign({ pagesize: 50, itemName: 'item' }, options || {});
    }

    country(id: string) {
        return this.itemProperty('P27', id);
    }

    languageCode(lang: string) {
        return this.itemProperty('rdfs:label', '?' + this.itemName + 'Label')
            .add('FILTER((LANG(?itemLabel)) = "' + lang + '").');
    }

    add(condition: QueryCondition) {
        if (this.options.queryBody) {
            throw new Error(`Can't add new conditions if queryBody options is present`);
        }
        condition && this.conditions.push(condition);
        return this;
    }

    itemProperty(prop: string, value: string, filter?: 'NOT_EXISTS') {
        let triple = ['?' + this.itemName,
        prop[0] === 'P' ? 'wdt:' + prop : prop,
        value[0] === 'Q' ? 'wd:' + value : value].join(' ') + ' .';

        if (filter) {
            switch (filter) {
                case 'NOT_EXISTS':
                    triple = 'FILTER NOT EXISTS { ' + triple + '}';
                    break;
            }
        }

        return this.add(triple);
    }

    instanceOf(value: string) {
        return this.itemProperty('P31', value);
    }

    toString(incrementPage?: boolean) {
        const lines: string[] = ['SELECT', '?' + this.options.itemName, 'WHERE', '{'];
        lines.push(this.options.queryBody || this.conditions.join(' '));
        lines.push('}');
        lines.push('LIMIT');
        lines.push(this.options.pagesize.toString());
        if (this.offset) {
            lines.push('OFFSET');
            lines.push(this.offset.toString());
        }

        if (incrementPage) {
            this.offset += this.options.pagesize;
        }

        if (this.options.prefixes) {
            return this.options.prefixes + '\n' + lines.join(' ')
        }

        return lines.join(' ');
    }
}
