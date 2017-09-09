
const debug = require('debug')('wikidata-fetcher');
import { request } from './request';
import { IQuery } from './query';
import * as EventEmitter from 'events';
const AsyncEventEmitter: EventEmitter = require('async-eventemitter');

// export interface FetcherOptions {
//     readonly query: string
// }

export class Fetcher extends EventEmitter {
    private expired = false;
    private isStopped = true

    constructor(private query: IQuery) {
        super();
        if (!query || !query.pagesize) {
            throw new Error(`'query' argument is required`);
        }
    }

    start() {
        if (this.expired) {
            throw new Error(`this Fetcher is expired`);
        }
        if (!this.isStopped) {
            throw new Error(`Fetcher is running`);
        }
        if (this.listenerCount('item') === 0) {
            throw new Error(`No listeners for event: 'item'`);
        }
        this.isStopped = false;

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
                debug('got ids', ids);
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
                        this.onEnd();
                        return;
                    }
                    return this.next();
                });
            })
            .catch(error => this.onEnd(error));
    }

    private onEnd(error?: Error) {
        debug('on end');
        if (error) {
            this.onError(error);
        }
        this.expired = true;
        this.isStopped = true;

        return this.emit('end')
    }

    private onItem(id: string, done: () => void) {
        debug('in item', id);
        if (this.isStopped || this.listenerCount('item') === 0) {
            return done();
        }
        return this.emit('item', id, (error: Error) => {
            if (error) {
                this.stop();
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
