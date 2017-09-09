
export type QueryCondition = string;

export class Query {
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

    add(condition: QueryCondition) {
        if (this.options.queryBody) {
            throw new Error(`Can't add new conditions if queryBody options is present`);
        }
        condition && this.conditions.push(condition);
        return this;
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
