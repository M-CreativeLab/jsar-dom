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
  /**
   * The method to fetch the given url with the given options.
   * 
   * @param url the request url.
   * @param options the request options.
   */
  fetch(url: string, options: ResourceFetchOptions, returnsAs: 'string'): Promise<string>;
  fetch(url: string, options: ResourceFetchOptions, returnsAs: 'json'): Promise<object>;
  fetch(url: string, options: ResourceFetchOptions, returnsAs: 'arraybuffer'): Promise<ArrayBuffer>;
  fetch<T = string | object | ArrayBuffer>(url: string, options: ResourceFetchOptions, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<T>;
}

export interface RequestManager {
  new(): RequestManager;
  add(req);
  remove(req);
  close();
  size();
}

export type UserAgentInit = {
  /**
   * Default stylesheet to use for the document.
   */
  defaultStylesheet: string;
  /**
   * The `devicePixelRatio` returns the ratio of the resolution in physical pixels to the 
   * resolution in CSS pixels for the current display device.
   */
  devicePixelRatio: number;
};

/**
 * A `UserAgent` represents the client of executing XSML document.
 */
export interface UserAgent {
  /**
   * See `options.defaultStylesheet`.
   */
  defaultStylesheet: string;
  /**
   * See `options.devicePixelRatio`.
   */
  devicePixelRatio: number;

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

  /**
   * It sends an alert message to the user, implementor should display the message in a dialog.
   * @param message the message to alert.
   */
  alert(message?: string): void;
  /**
   * This method instructs the user agent to display a dialog with an optional message, and to wait 
   * until the user either confirms or cancels the dialog.
   * @param message the message to confirm.
   * @returns A boolean indicating whether OK (true) or Cancel (false) was selected.
   */
  confirm(message?: string): boolean;
  /**
   * It instructs the user agent to display a dialog with an optional message prompting the user to 
   * input some text, and to wait until the user either submits the text or cancels the dialog.
   * @param message A string of text to display to the user. Can be omitted if there is nothing to 
   *                show in the prompt window.
   * @param defaultValue A string containing the default value displayed in the text input field.
   * @returns A string containing the text entered by the user, or `null`.
   */
  prompt(message?: string, defaultValue?: string): string;
}

export interface NativeEngine extends EventTarget {
  addEventListener(type: 'DOMContentLoaded', listener: (event: Event) => void): void;
}

type LayoutResult = {
  childCount: number;
  child(i: number): LayoutResult;
  unref(): void;
} & DOMRect;

export interface LayoutNode {
  new(style: CSSStyleSheet): LayoutNode;

  setStyle(newStyle: CSSStyleSheet): void;
  appendChild(child: LayoutNode): void;
  removeChild(child: LayoutNode): void;
  computeLayout(targetDescriptor: { height: number; width: number }): LayoutResult;
  dispose(): void;
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
   * A flag to indicate whether the document is closed.
   */
  closed: boolean;

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
  /**
   * This stops further resource loading in the current context.
   */
  stop(): void;
  /**
   * This closes this document, the implementor should release all resources and
   * mark the document's `closed` flag to `true`.
   */
  close(): void;
}
