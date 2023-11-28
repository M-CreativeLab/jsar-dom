import * as BABYLON from 'babylonjs';
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

class HeadlessEngine extends EventTarget implements NativeEngine { }
class HeadlessResourceLoader implements ResourceLoader {
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'string'): Promise<string>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'json'): Promise<object>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'arraybuffer'): Promise<ArrayBuffer>;
  fetch<T = string | object | ArrayBuffer>(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<T>;
  fetch(url: string, options: unknown, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<object> | Promise<ArrayBuffer> | Promise<string> {
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

export class HeadlessNativeDocument implements NativeDocument {
  engine: NativeEngine;
  userAgent: UserAgent;
  baseURI: string;
  console: Console;
  attachedDocument: SpatialDocumentImpl;
  closed: boolean = false;

  constructor() {
    this.engine = new HeadlessEngine();
    this.userAgent = new HeadlessUserAgent({
      defaultStylesheet: '',
      devicePixelRatio: 1,
    });
    this.console = globalThis.console;
  }

  getNativeScene(): BABYLON.Scene {
    throw new Error('Method not implemented.');
  }
  getContainerPose(): XRPose {
    throw new Error('Method not implemented.');
  }
  getPreloadedMeshes(): Map<string, BABYLON.AbstractMesh[]> {
    throw new Error('Method not implemented.');
  }
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]> {
    throw new Error('Method not implemented.');
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

if (require.main === module) {
  const entrypoint = process.argv[2];
  if (!entrypoint) {
    console.error('Usage: ts-node ./src/impl-headless.ts <entrypoint>');
    process.exit(1);
  }

  Promise.all([
    import('./index'),
    import('node:fs/promises'),
  ]).then(async ([{ JSARDOM }, fsPromises]) => {
    const textContent = await fsPromises.readFile(entrypoint, 'utf8');
    const nativeDocument = new HeadlessNativeDocument();
    const dom = new JSARDOM(textContent, {
      url: 'https://example.com',
      nativeDocument,
    });
    await dom.load();
  });
}
