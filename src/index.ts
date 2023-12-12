// Apply patches for BabylonJS.
import './living/helpers/babylonjs/patches';

import 'babylonjs';
import * as taffy from '@bindings/taffy';

import { parseIntoDocument } from './agent/parser';
import { BaseWindowImpl, WindowOrDOMInit, createWindow } from './agent/window';
import { loadImplementations as loadDOMInterfaceImplementations } from './living/interfaces';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';
import type { JSARInputEvent } from './input-event';
import type { NativeDocument } from './impl-interfaces';

const windowSymbol = Symbol('window');
let globalId = 0;

/**
 * It represents a JSAR DOM instance.
 */
export class JSARDOM<T extends NativeDocument> {
  id: string;
  [windowSymbol]: BaseWindowImpl<T>;

  private _nativeDocument: T;

  constructor(private _markup: string, init: WindowOrDOMInit<T>) {
    this.id = init.id || `${globalId++}`;
    this._nativeDocument = init.nativeDocument;
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

    parseIntoDocument(this._markup, this.document);
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

    // load babylonjs loaders.
    // await import('@babylonjs/loaders');
    const { GLTFFileLoader } = await import('@babylonjs/loaders/glTF/index');
    /**
     * Register the gltf loader to support the script to load gltf/glb files.
     */
    if (BABYLON.SceneLoader) {
      BABYLON.SceneLoader.RegisterPlugin(new GLTFFileLoader() as any);
    }

    // load native bindings
    await taffy.loadTaffy();

    // prepare the window such as create layout/render context and load window's global interfaces.
    this[windowSymbol]._prepare();
  }
}

export * from './impl-interfaces';
export {
  SpatialDocumentImpl,
}
