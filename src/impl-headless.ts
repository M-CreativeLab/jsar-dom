import * as BABYLON from 'babylonjs';
import { DOMParser, NativeDocument, NativeEngine, RequestManager, ResourceLoader, UserAgent, UserAgentInit } from './impl-interfaces';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';

class HeadlessEngine extends EventTarget implements NativeEngine { }

class HeadlessUserAgent implements UserAgent {
  defaultStylesheet: string;
  devicePixelRatio: number;
  domParser: DOMParser;
  resourceLoader: ResourceLoader;
  requestManager: RequestManager;

  constructor(init: UserAgentInit) {
    this.defaultStylesheet = init.defaultStylesheet;
    this.devicePixelRatio = init.devicePixelRatio;
    this.resourceLoader = null;
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
