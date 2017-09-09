
const debug = require('debug')('wikidata-fetcher');
import { request } from './request';
import { Query } from './query';
import * as EventEmitter from 'events';
const AsyncEventEmitter: EventEmitter = require('async-eventemitter');

// export interface FetcherOptions {
//     readonly query: string
// }

export class Fetcher extends EventEmitter {
    private isStopped = true

    constructor(private query: Query) {
        super();
    }

    start() {
        if (this.isStopped) {
            throw new Error(`Fetcher is stopped`);
        }
        if (this.listenerCount('item') === 0) {
            throw new Error(`No listeners for event: 'item'`);
        }
        this.next();

        return this;
    }

    stop() {
        this.isStopped = true;
        return this;
    }

    private next(): Promise<any> {
        if (this.isStopped) {
            return Promise.resolve();
        }

        const query = this.query.toString(true);

        debug('next query', query);

        return request(query, this.query.itemName)
            .then(ids => {
                const funcs = ids.map((id: string) => () => new Promise<any>((resolve) => {
                    if (this.isStopped) {
                        return Promise.resolve();
                    }
                    this.onItem(id, resolve);
                }));
                return serial(funcs).then(() => {
                    if (this.isStopped) {
                        return;
                    }
                    if (ids.length < this.query.pagesize) {
                        this.isStopped = true;
                        return;
                    }
                    return this.next();
                });
            })
            .catch(error => this.onError(error));
    }

    private onItem(id: string, done: () => void) {
        if (this.isStopped || this.listenerCount('item') === 0) {
            return done();
        }
        return this.emit('item', id, (error: Error) => {
            if (error) {
                return this.stop();
            }
            done();
        });
    }

    private onError(error: Error) {
        return this.emit('error', error);
    }
}

const serial: (fns: Function[]) => Promise<any[]> = (funcs: Function[]) =>
    funcs.reduce((promise, func) =>
        promise.then((result: any) => func()
            .then(Array.prototype.concat.bind(result))), Promise.resolve([]));
