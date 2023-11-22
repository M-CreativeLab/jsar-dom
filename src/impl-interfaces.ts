import type BABYLON from 'babylonjs';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';

export interface DOMParser {
  new(document: NativeDocument): DOMParser;
  createDocument(): void;
  createDocumentFragment(): void;
}

type ResourceFetchOptions = {
  /**
   * Accept: The Accept request HTTP header advertises which content types, 
   *         expressed as MIME types, the client is able to understand.
   */
  accept?: string;
  /**
   * CookieJar: A CookieJar instance to use for this request.
   */
  cookieJar?: any;
  /**
   * Referrer: The referrer of the request.
   */
  referrer?: string;
};

/**
 * A `ResourceLoader` is used to load resources, such as scripts, models, textures, audio, etc.
 */
export interface ResourceLoader {
  new(strictSSL: boolean): ResourceLoader;
  /**
   * The method to fetch the given url with the given options.
   * 
   * @param url the request url.
   * @param options the request options.
   */
  fetch(url: string, options: ResourceFetchOptions): Promise<any>;
}

export interface RequestManager {
  new(): RequestManager;
  add(req);
  remove(req);
  close();
  size();
}

type UserAgentInit = {
  /**
   * Default stylesheet to use for the document.
   */
  defaultStylesheet: string;
};

/**
 * A `UserAgent` represents the client of executing XSML document.
 */
export interface UserAgent {
  new(init: UserAgentInit): UserAgent;

  /**
   * A `DOMParser` instance is used to parse and load the given XSML text content.
   */
  domParser: DOMParser;
  /**
   * `ResourceLoader` instance is used to load resources, such as scripts, models, textures, audio, etc.
   */
  resourceLoader: ResourceLoader;
  /**
   * `RequestManager` instance is used to manage the network requests.
   */
  requestManager: RequestManager;
}

export interface NativeEngine extends EventTarget {
  addEventListener(type: 'DOMContentLoaded', listener: (event: Event) => void): void;
}

/**
 * The entry point that implementation must provide to the native engine.
 */
export interface NativeDocument {
  engine: NativeEngine;
  /**
   * The UserAgent instance that represents the client of executing XSML document.
   */
  userAgent: UserAgent;
  /**
   * The base URI of the document.
   */
  baseURI: string;
  /**
   * A virtual console to log messages, which should be an instance of Console.
   */
  console: Console;
  /**
   * A native document should be attached to a SpatialDocument/Document.
   */
  attachedDocument: SpatialDocumentImpl;

  /**
   * It returns the underlying native scene instance, currently it's a Babylon.js scene object.
   */
  getNativeScene(): BABYLON.Scene;
  /**
   * It returns a `XRPose` which represents the pose of the container of the document in space.
   */
  getContainerPose(): XRPose;

  /**
   * It returns a map of preloaded meshes.
   * 
   * When loading a XSML document, the implementation should preload the specific meshes.
   */
  getPreloadedMeshes(): Map<string, BABYLON.AbstractMesh[]>;
  /**
   * It returns a map of preloaded animation groups.
   */
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]>;

  /**
   * To receive given input event from the native engine, the caller should call this method to observe
   * the specific input events.
   * 
   * @param name The name of the input event to observe.
   */
  observeInputEvent(name?: string): void;
  /**
   * It creates a TransformNode as a bouding box of the given mesh.
   * 
   * @param nameOrId the name or id of this bouding box.
   */
  createBoundTransformNode(nameOrId: string): BABYLON.TransformNode;
}
