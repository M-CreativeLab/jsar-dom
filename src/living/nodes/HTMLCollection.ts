import { NativeDocument } from '../../impl-interfaces';
import { HTML_NS } from '../helpers/namespaces';
import { NodeImpl } from './Node';

export default class HTMLCollectionImpl implements HTMLCollection {
  _version: number = -1;
  _element: NodeImpl;
  _query: () => HTMLElement[];
  private _list: HTMLElement[] = [];

  constructor(
    _nativeDocument: NativeDocument,
    _args,
    privateData: {
      element: NodeImpl;
      query: () => HTMLElement[];
    }) {
    this._element = privateData.element;
    this._query = privateData.query;
    this._update();
  }

  item(index: number): Element {
    this._update();
    return this[index] || null;
  }

  namedItem(name: string): Element {
    if (name === '') {
      return null;
    }
    this._update();
    for (const element of this) {
      if (element.getAttributeNS(null, 'id') === name) {
        return element;
      }
      if (element.namespaceURI === HTML_NS) {
        if (name === element.getAttributeNS(null, 'name')) {
          return element;
        }
      }
    }
    return null;
  }

  [index: number]: Element;
  get length(): number {
    this._update();
    return this._list.length;
  }

  [Symbol.iterator](): IterableIterator<HTMLElement> {
    this._update();
    return this._list[Symbol.iterator]();
  }

  entries(): IterableIterator<[number, HTMLElement]> {
    this._update();
    return this._list.entries();
  }

  filter<S extends HTMLElement>(predicate: (value: HTMLElement, index: number, array: HTMLElement[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: HTMLElement, index: number, array: HTMLElement[]) => unknown, thisArg?: any): HTMLElement[];
  filter(predicate: unknown, thisArg?: unknown): HTMLElement[] | HTMLElement[] {
    this._update();
    return this._list.filter(predicate as any, thisArg);
  }

  map<U>(callbackfn: (value: HTMLElement, index: number, array: HTMLElement[]) => U, thisArg?: any): U[] {
    this._update();
    return this._list.map(callbackfn, thisArg);
  }

  indexOf(searchElement: HTMLElement, fromIndex?: number): number {
    this._update();
    return this._list.indexOf(searchElement, fromIndex);
  }

  /**
   * @internal
   */
  _update() {
    if (this._version < this._element._version) {
      const snapshot = this._query();
      for (let i = 0; i < snapshot.length; i++) {
        this[i] = snapshot[i];
      }
      this._version = this._element._version;
      this._list.length = snapshot.length;
    }
  }
}
