import { parseIntoDocument } from './agent/parser';
import { BaseWindowImpl, WindowOrDOMInit, createWindow } from './agent/window';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';

const windowSymbol = Symbol('window');

export class JSARDOM {
  [windowSymbol]: BaseWindowImpl;

  constructor(markup = '', init: WindowOrDOMInit) {
    this[windowSymbol] = createWindow(init);
    parseIntoDocument(markup, this.document);
  }

  get window() {
    return this[windowSymbol];
  }

  get document(): SpatialDocumentImpl {
    return this[windowSymbol].document as SpatialDocumentImpl;
  }
}
