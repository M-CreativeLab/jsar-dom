import './living/helpers/babylonjs/patches';
import './living/helpers/babylonjs/loaders/gLTF/index';
import viewportParser from 'metaviewport-parser';
import * as taffy from '@bindings/taffy';
import * as noise from '@bindings/noise';

import { parseIntoDocument } from './agent/parser';
import { BaseWindowImpl, WindowOrDOMInit, createWindow } from './agent/window';
import * as cdpImplementation from './agent/cdp/cdp-implementation';
import * as cdpTransport from './agent/cdp/transport';
import * as nodetype from './living/node-type';
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
    return this[windowSymbol].document as unknown as SpatialDocumentImpl<T>;
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
      try {
        markup = await this._nativeDocument.userAgent.resourceLoader.fetch(urlOrPath, {}, 'string');
      } catch (err) {
        throw new Error(`Failed to load ${urlOrPath}: ${err}`);
      }
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

  /**
   * The event "spaceReady" is a new event introduced by JSAR, which means the space initialization is finished.
   * Calling this method will return a promise which will be resolved when the "spaceReady" event is fired.
   */
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
   * This method is a shortcut to fetch the basic information of a loaded document.
   */
  async createDocumentManifest() {
    /**
     * The document manifest is to describe the basic information of a document.
     */
    const manifest: Partial<{
      /**
       * The version of the document spec, defined by <xsml version="{version}" >.
       */
      specVersion: string;
      /**
       * The url of the document.
       */
      url: string;
      /**
       * The title of the document, defined by <title>{title}</title>.
       */
      title: string;
      /**
       * The charset of the document, defined by <meta charset="{charset}" >.
       */
      charset: string;
      /**
       * The description of the document, defined by <meta name="description" content="{description}" >.
       */
      description: string;
      /**
       * The author of the document, defined by <meta name="author" content="{author}" >.
       */
      author: string;
      /**
       * The keywords of the document, defined by <meta name="keywords" content="{keywords}" >.
       */
      keywords: string;
      /**
       * The rating of the document, defined by <meta name="rating" content="{rating}" >.
       */
      rating: string;
      /**
       * The license of the document, defined by <meta name="license" content="{license}" >.
       */
      license: string;
      /**
       * The license url of the document, defined by <meta name="license-url" content="{licenseUrl}" >.
       */
      licenseUrl: string;
      /**
       * The viewport of the document, defined by <meta name="viewport" content="{viewport}" >.
       */
      viewport: {
        initialScale: number;
        maximumScale?: number;
        minimumScale?: number;
      }
    }> = {};

    manifest.specVersion = this.document.querySelector('xsml')?.getAttribute('version') || '1.0';
    manifest.url = this.document.URL;
    manifest.title = this.document.title;

    const charsetMeta = this.document.querySelector('meta[charset]');
    if (charsetMeta) {
      manifest.charset = charsetMeta.getAttribute('charset') || '';
    }
    manifest.description = this.document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    manifest.author = this.document.querySelector('meta[name="author"]')?.getAttribute('content') || '';
    manifest.keywords = this.document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    manifest.rating = this.document.querySelector('meta[name="rating"]')?.getAttribute('content') || '';
    manifest.license = this.document.querySelector('meta[name="license"]')?.getAttribute('content') || '';
    manifest.licenseUrl = this.document.querySelector('meta[name="license-url"]')?.getAttribute('content') || '';

    const viewport = this.document.querySelector('meta[name="viewport"]');
    if (viewport && viewport.hasAttribute('content')) {
      const result = viewportParser.parseMetaViewPortContent(viewport.getAttribute('content'));
      if (result?.validProperties && Object.keys(result.validProperties).length > 0) {
        manifest.viewport = {
          initialScale: result.validProperties['initial-scale'],
          maximumScale: result.validProperties['maximum-scale'],
          minimumScale: result.validProperties['minimum-scale'],
        };
      }
    }
    return manifest;
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
    await Promise.all([
      taffy.loadTaffy(),
      noise.loadNoise(),
    ]);

    // prepare the window such as create layout/render context and load window's global interfaces.
    this[windowSymbol]._prepare();
  }
}

export * from './impl-interfaces';
export {
  SpatialDocumentImpl,
  JSARInputEvent,
}

export namespace nodes {
  export const NodeTypes = nodetype.default;
  export const isElementNode = nodetype.isElementNode;
  export const isAttributeNode = nodetype.isAttributeNode;
  export const isTextNode = nodetype.isTextNode;
  export const isHTMLElement = nodetype.isHTMLElement;
  export const isSpatialElement = nodetype.isSpatialElement;
}

export namespace cdp {
  export import ITransport = cdpTransport.ITransport;
  export import LoopbackTransport = cdpTransport.LoopbackTransport;
  export import createRemoteClient = cdpImplementation.createRemoteClient;
}
