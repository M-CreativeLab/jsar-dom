import CSSStyleSheetImpl from '../cssom/CSSStyleSheet';
import StyleSheetListImpl from '../cssom/StyleSheetList';
import DOMExceptionImpl from '../domexception';
import { nodeRoot } from '../helpers/node';
import { NodeImpl } from './Node';

export default class DocumentOrShadowRootImpl implements DocumentOrShadowRoot {
  _styleSheets: StyleSheetListImpl;
  _adoptedStyleSheets: CSSStyleSheetImpl[];

  /**
   * It returns the inline stylesheets of this document or shadow root.
   * 
   * @readonly
   */
  get styleSheets(): StyleSheetList {
    if (!this._styleSheets) {
      this._styleSheets = new StyleSheetListImpl();
    }
    return this._styleSheets;
  }

  get adoptedStyleSheets(): CSSStyleSheet[] {
    return this._adoptedStyleSheets;
  }
  set adoptedStyleSheets(sheets: CSSStyleSheet[]) {
    this._adoptedStyleSheets = sheets as CSSStyleSheetImpl[];
  }

  get fullscreenElement(): Element {
    throw new DOMExceptionImpl('fullscreenElement is not supported.', 'NOT_SUPPORTED_ERR');
  }
  pictureInPictureElement: Element;
  pointerLockElement: Element;

  elementFromPoint(x: number, y: number): Element {
    throw new Error('Method not implemented.');
  }
  elementsFromPoint(x: number, y: number): Element[] {
    throw new Error('Method not implemented.');
  }

  getAnimations(): Animation[] {
    throw new Error('Method not implemented.');
  }

  get activeElement() {
    if (!(this instanceof NodeImpl)) {
      return null;
    }

    const candidate = this._ownerDocument._lastFocusedElement || this._ownerDocument.body;
    if (nodeRoot(candidate) !== this) {
      return this;
    }
    if (candidate.nodeType !== NodeImpl.DOCUMENT_NODE) {
      return candidate;
    }
    if (candidate instanceof Document && candidate.body !== null) {
      return candidate.body;
    }
    return null;
  }
}
