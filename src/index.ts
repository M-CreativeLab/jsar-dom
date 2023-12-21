import 'babylonjs';
import './living/helpers/babylonjs/patches';
import './living/helpers/babylonjs/loaders/gLTF/index';
import * as taffy from '@bindings/taffy';

import { parseIntoDocument } from './agent/parser';
import { BaseWindowImpl, WindowOrDOMInit, createWindow } from './agent/window';
import { loadImplementations as loadDOMInterfaceImplementations } from './living/interfaces';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';
import { canParseURL } from './living/helpers/url';
import { JSARInputEvent } from './input-event';
import type { NativeDocument } from './impl-interfaces';

const windowSymbol = Symbol('window');
let globalId = 0;

/**
 * It represents a JSAR DOM instance.
 */
export class JSARDOM<T extends NativeDocument> {
  id: string;
  [windowSymbol]: BaseWindowImpl<T>;

  private _markupOrUrl: string;
  private _nativeDocument: T;

  static get version(): string {
    return process.env.JSARDOM_VERSION;
  }

  constructor(markupOrUrl: string, init: WindowOrDOMInit<T>) {
    this.id = init.id || `${globalId++}`;
    this._markupOrUrl = markupOrUrl.trim();
    this._nativeDocument = init.nativeDocument;
    /**
     * When found the markupOrUrl is a url, and the init.url is not set, update the init.url.
     */
    if (this._markupOrUrl[0] !== '<' && !init.url) {
      init.url = this._markupOrUrl;
    }
    this[windowSymbol] = createWindow(init);
  }

  get window() {
    return this[windowSymbol];
  }

  get document(): SpatialDocumentImpl<T> {
    return this[windowSymbol].document as SpatialDocumentImpl<T>;
  }

  get nativeDocument(): T {
    return this._nativeDocument;
  }

  /**
   * It starts parsing the markup string and creating the document.
   */
  async load() {
    await this._beforeLoad();

    let markup: string;
    if (this._markupOrUrl[0] !== '<') {
      let urlOrPath = this._markupOrUrl;
      if (!canParseURL(urlOrPath)) {
        urlOrPath = `file://${urlOrPath}`;
      }
      markup = await this._nativeDocument.userAgent.resourceLoader.fetch(urlOrPath, {}, 'string');
    } else {
      markup = this._markupOrUrl;
    }

    parseIntoDocument(markup, this.document);
    this.document._start();
    return new Promise<void>(resolve => {
      this.document.addEventListener('load', (_event) => {
        resolve();
      });
    });
  }

  async waitForSpaceReady() {
    if (this.document._isSpaceReady === true) {
      return Promise.resolve();
    } else {
      return new Promise<void>(resolve => {
        this.document.addEventListener('spaceReady', () => resolve());
      });
    }
  }

  /**
   * Dispose the loaded document and close the window.
   */
  async unload() {
    this.document._stop();
    this.window.close();
  }

  /**
   * Dispatch the input events to document.
   * @param event 
   */
  dispatchInputEvent(event: JSARInputEvent): boolean {
    return this.document.dispatchEvent(event);
  }

  private async _beforeLoad() {
    // load dom interface implementations.
    await loadDOMInterfaceImplementations();

    // load native bindings
    await taffy.loadTaffy();

    // prepare the window such as create layout/render context and load window's global interfaces.
    this[windowSymbol]._prepare();
  }
}

export * from './impl-interfaces';
export {
  SpatialDocumentImpl,
  JSARInputEvent,
}
