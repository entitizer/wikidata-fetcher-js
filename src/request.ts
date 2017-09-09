
require('es6-promise').polyfill();
require('isomorphic-fetch');

export function request(query: string, itemName: string = 'item'): Promise<string[]> {
    return fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query), { method: 'GET' })
        .then((response) => {
            const json: any = response.json();
            const data: string[] = json && json.results && json.results.bindings && json.results.bindings.map((item: any) => {
                let value = item[itemName].value;
                const result = /\/entity\/(Q\d+)$/.exec(value);
                if (result && result.length > 1) {
                    value = result[1];
                }
                return value;
            })
                || [];

            return data;
        });
}
