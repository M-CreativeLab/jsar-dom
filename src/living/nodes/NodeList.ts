import { NativeDocument } from '../../impl-interfaces';
import { NodeImpl } from './Node';

export class NodeListImpl<T extends Node> implements NodeList {
  #list: T[] = [];
  #isLive: boolean;
  #version: number = -1;
  #element: NodeImpl;
  _hostObject: NativeDocument;
  #query: () => T[];

  constructor(
    hostObject: NativeDocument,
    _args: any[],
    privateData: {
      query?: () => T[];
      element?: NodeImpl;
      nodes?: T[];
    }
  ) {
    this._hostObject = hostObject;
    if (privateData.nodes) {
      this.#list = [...privateData.nodes];
      for (let i = 0; i < this.#list.length; i++) {
        this[i] = this.#list[i];
      }
      this.#isLive = false;
    } else {
      this.#list = [];
      this.#isLive = true;
      this.#version = -1;
      this.#element = privateData.element;
      this.#query = privateData.query;
      this._update();
    }
  }

  [index: number]: T;
  get length() {
    this._update();
    return this.#list.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#list[Symbol.iterator]();
  }

  item(index: number): T {
    this._update();
    return this.#list[index] || null;
  }

  forEach(callbackfn: (value: T, key: number, parent: NodeListImpl<T>) => void, thisArg?: any): void {
    this._update();
    this.#list.forEach((value, index) => callbackfn(value, index, this), thisArg);
  }

  entries(): IterableIterator<[number, T]> {
    return this.#list.entries();
  }

  keys(): IterableIterator<number> {
    return this.#list.keys();
  }

  values(): IterableIterator<T> {
    return this.#list.values();
  }

  _update() {
    if (this.#isLive) {
      if (this.#version < this.#element._version) {
        const snapshot = this.#query();
        for (let i = 0; i < snapshot.length; i++) {
          this.#list[i] = snapshot[i];
          this[i] = snapshot[i];
        }
        this.#list.length = snapshot.length;
        this.#version = this.#element._version;
      }
    }
  }
}
