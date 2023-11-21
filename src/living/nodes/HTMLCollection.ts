import { NativeDocument } from '../../impl-interfaces';
import { HTML_NS } from '../helpers/namespaces';
import { HTMLElementImpl } from './HTMLElement';
import { NodeImpl } from './Node';

export default class HTMLCollectionImpl extends Array<HTMLElement> implements HTMLCollection {
  _version: number;
  _element: NodeImpl;
  _query: () => HTMLElement[];

  constructor(
    _nativeDocument: NativeDocument,
    _args,
    privateData: {
      element: NodeImpl;
      query: () => HTMLElement[];
    }) {
    super();

    this._element = privateData.element;
    this._query = privateData.query;
  }

  namedItem(name: string): Element {
    if (name === "") {
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

  item(index: number): Element {
    this._update();
    return this[index] || null;
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
      this.length = snapshot.length;
      this._version = this._element._version;
    }
  }
}
