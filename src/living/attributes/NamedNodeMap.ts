import { NativeDocument } from '../../impl-interfaces';
import { ElementImpl } from '../nodes/Element';
import * as attributes from '../attributes';

export default class NamedNodeMapImpl implements NamedNodeMap {
  [index: number]: Attr;

  _nativeDocument: NativeDocument;
  _element: ElementImpl;

  constructor(
    nativeDocument: NativeDocument,
    args: Array<any>,
    privateData: {
      element: ElementImpl;
    }
  ) {
    this._nativeDocument = nativeDocument;
    this._element = privateData.element;
  }

  private get _attributeList() {
    return this._element._attributeList;
  }

  get length() {
    return this._attributeList.length;
  }

  getNamedItem(qualifiedName: string): Attr {
    return attributes.getAttributeByName(this._element, qualifiedName);
  }

  getNamedItemNS(namespace: string, localName: string): Attr {
    return attributes.getAttributeByNameNS(this._element, namespace, localName);
  }

  item(index: number): Attr {
    if (index >= this._attributeList.length) {
      return null;
    }
    return this._attributeList[index];
  }

  removeNamedItem(qualifiedName: string): Attr {
    throw new Error('Method not implemented.');
  }
  removeNamedItemNS(namespace: string, localName: string): Attr {
    throw new Error('Method not implemented.');
  }
  setNamedItem(attr: Attr): Attr {
    throw new Error('Method not implemented.');
  }
  setNamedItemNS(attr: Attr): Attr {
    throw new Error('Method not implemented.');
  }
  [Symbol.iterator](): IterableIterator<Attr> {
    throw new Error('Method not implemented.');
  }
}