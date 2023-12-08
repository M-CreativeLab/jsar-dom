// Apply patches for BabylonJS.
import './living/helpers/babylonjs/patches';

import 'babylonjs';
import * as taffy from '@bindings/taffy';

import { parseIntoDocument } from './agent/parser';
import { BaseWindowImpl, WindowOrDOMInit, createWindow } from './agent/window';
import { loadImplementations as loadDOMInterfaceImplementations } from './living/interfaces';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';

const windowSymbol = Symbol('window');

export class JSARDOM {
  [windowSymbol]: BaseWindowImpl;

  constructor(private _markup: string, init: WindowOrDOMInit) {
    this[windowSymbol] = createWindow(init);
  }

  get window() {
    return this[windowSymbol];
  }

  get document(): SpatialDocumentImpl {
    return this[windowSymbol].document as unknown as SpatialDocumentImpl;
  }

  async load() {
    await this._beforeLoad();

    parseIntoDocument(this._markup, this.document);
    this.document._start();
    return new Promise<void>(resolve => {
      this.document.addEventListener('load', (event) => {
        resolve();
      });
    });
  }

  async unload() {
    this.document._stop();
    this.window.close();
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

    // prepare the window
    this[windowSymbol]._prepare();
  }
}

export * from './impl-interfaces';
export {
  SpatialDocumentImpl
}
