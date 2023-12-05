import fsPromises from 'node:fs/promises';
import url from 'node:url';

import 'babylonjs';
import path from 'path';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';
import {
  DOMParser,
  NativeDocument,
  NativeEngine,
  RequestManager,
  ResourceLoader,
  UserAgent,
  UserAgentInit
} from './impl-interfaces';
import { canParseURL } from './living/helpers/url';

interface HeadlessEngine extends BABYLON.NullEngine, EventTarget { }
class HeadlessEngine extends BABYLON.NullEngine implements NativeEngine {
  // TODO
}

class HeadlessResourceLoader implements ResourceLoader {
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'string'): Promise<string>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'json'): Promise<object>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'arraybuffer'): Promise<ArrayBuffer>;
  fetch<T = string | object | ArrayBuffer>(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<T>;
  fetch(url: string, options: unknown, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<object> | Promise<ArrayBuffer> | Promise<string> {
    if (!canParseURL(url)) {
      throw new TypeError('Invalid URL');
    }
    const urlObj = new URL(url);
    if (urlObj.protocol === 'file:') {
      /** Check if the data should be string or json? */
      const isStringOrJson = (data: string | Buffer): data is string => {
        return returnsAs === 'string' || returnsAs === 'json';
      };

      let readOptions: Parameters<typeof fsPromises.readFile>[1] = {};
      if (returnsAs === 'string' || returnsAs === 'json') {
        readOptions.encoding = 'utf8';
      }

      let { pathname } = urlObj;
      if (process.platform === 'win32' && pathname[0] === '/') {
        /**
         * The Node.js URL parses the Windows path to append a leading "/" on the `pathname`.
         * This manually removes the leading "/" to avoid related issues.
         */
        pathname = pathname.slice(1);
      }
      return fsPromises.readFile(pathname, readOptions)
        .then((data) => {
          if (isStringOrJson(data)) {
            if (returnsAs === 'string') {
              return data;
            } else if (returnsAs === 'json') {
              return JSON.parse(data);
            }
          } else {
            return data.buffer;
          }
        });
    } else {
      return fetch(url, options)
        .then((resp) => {
          if (returnsAs === 'string') {
            return resp.text();
          } else if (returnsAs === 'json') {
            return resp.json();
          } else if (returnsAs === 'arraybuffer') {
            return resp.arrayBuffer();
          }
        });
    }
  }
}

class HeadlessUserAgent implements UserAgent {
  versionString: string = '1.0';
  vendor: string = '';
  vendorSub: string = '';
  language: string = 'zh-CN';
  languages: readonly string[] = [
    'zh-CN',
    'en-US',
  ];
  defaultStylesheet: string;
  devicePixelRatio: number;
  domParser: DOMParser;
  resourceLoader: ResourceLoader;
  requestManager: RequestManager;

  constructor(init: UserAgentInit) {
    this.defaultStylesheet = init.defaultStylesheet;
    this.devicePixelRatio = init.devicePixelRatio;
    this.resourceLoader = new HeadlessResourceLoader();
    this.requestManager = null;
  }
  alert(message?: string): void {
    throw new Error('Method not implemented.');
  }
  confirm(message?: string): boolean {
    throw new Error('Method not implemented.');
  }
  prompt(message?: string, defaultValue?: string): string {
    throw new Error('Method not implemented.');
  }
}

export class HeadlessNativeDocument extends EventTarget implements NativeDocument {
  engine: NativeEngine;
  userAgent: UserAgent;
  baseURI: string;
  console: Console;
  attachedDocument: SpatialDocumentImpl;
  closed: boolean = false;

  private _scene: BABYLON.Scene;
  private _preloadMeshes: Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> = new Map();
  private _preloadAnimationGroups: Map<string, BABYLON.AnimationGroup[]> = new Map();

  constructor(private _startLoop: boolean = false) {
    super();

    this.engine = new HeadlessEngine();
    this.userAgent = new HeadlessUserAgent({
      defaultStylesheet: '',
      devicePixelRatio: 1,
    });
    this.console = globalThis.console;
    this._scene = new BABYLON.Scene(this.engine);

    new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      5,
      BABYLON.Vector3.Zero(),
      this._scene
    );

    if (this._startLoop) {
      this.engine.runRenderLoop(() => {
        this._scene.render();
      });
    }
  }

  getNativeScene(): BABYLON.Scene {
    return this._scene;
  }
  getContainerPose(): XRPose {
    throw new Error('Method not implemented.');
  }
  getPreloadedMeshes(): Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> {
    return this._preloadMeshes;
  }
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]> {
    return this._preloadAnimationGroups;
  }
  observeInputEvent(name?: string): void {
    throw new Error('Method not implemented.');
  }
  createBoundTransformNode(nameOrId: string): BABYLON.TransformNode {
    throw new Error('Method not implemented.');
  }
  stop(): void {
    // TODO
  }
  close(): void {
    // TODO
  }
}

function main() {
  const entrypoint = process.argv[2];
  if (!entrypoint) {
    console.error('Usage: ts-node ./src/impl-headless.ts <entrypoint>');
    process.exit(1);
  }

  // Error.stackTraceLimit = Infinity;
  Promise.all([
    import('./index'),
    import('node:fs/promises'),
  ]).then(async ([{ JSARDOM }, fsPromises]) => {
    let startLoop: boolean = false;
    const extraParameter = process.argv[3];
    if (extraParameter === '--keep-alive') {
      startLoop = true;
    }
    const textContent = await fsPromises.readFile(entrypoint, 'utf8');
    const nativeDocument = new HeadlessNativeDocument(startLoop);
    const dom = new JSARDOM(textContent, {
      nativeDocument,
      url: `file://${path.resolve(entrypoint)}`,
    });
    await dom.load();
    console.log('Title:', dom.document.title);
  });
}

if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    // Run as a script.
    main();
  }
}
