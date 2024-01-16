import { ITransport } from './agent/cdp';
import type ImageDataImpl from './living/image/ImageData';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';
import XRInputSourceArrayImpl from './living/xr/XRInputSourceArray';

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

export type MediaPlayerConstructor = new () => MediaPlayerBackend;
export interface MediaPlayerBackend {
  load(buffer: ArrayBuffer | ArrayBufferView, onloaded: () => void): void;
  play(when?: number): void;
  pause(): void;
  canPlayType(type: string): CanPlayTypeResult;
  dispose(): void;

  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loop: boolean;
  onended: () => void;
}

export const xrFeatures = [
  'anchors',
  'bounded-floor',
  'depth-sensing',
  'dom-overlay',
  'hand-tracking',
  'hit-test',
  'layers',
  'light-estimation',
  'local',
  'local-floor',
  'secondary-views',
  'unbounded',
  'viewer',
] as const;
export type XRFeature = typeof xrFeatures[number];
export type XRSessionBackendInit = {
  immersiveMode: XRSessionMode;
  requiredFeatures?: XRFeature[];
  optionalFeatures?: XRFeature[];
};
export interface XRSessionBackend {
  get enabledFeatures(): readonly XRFeature[];
  get inputSources(): XRInputSourceArrayImpl;
  get visibilityState(): XRVisibilityState;
  request(): Promise<void>;
  requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace | XRBoundedReferenceSpace>;
  end(): Promise<void>;
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
 * Represents a user agent, which is responsible for interacting with the user and managing resources in a web application.
 */
export interface UserAgent {
  /**
   * The version string of the user agent.
   */
  versionString: string;
  /**
   * The vendor name of the user agent.
   */
  vendor: string;
  /**
   * The vendor subname of the user agent.
   */
  vendorSub: string;
  /**
   * The language of the user agent.
   */
  language: string;
  /**
   * The supported languages of the user agent.
   */
  languages: readonly string[];
  /**
   * See `options.defaultStylesheet`.
   */
  defaultStylesheet: string;
  /**
   * See `options.devicePixelRatio`.
   */
  devicePixelRatio: number;

  /**
   * The approximate amount of device memory in gigabytes.
   */
  deviceMemory?: number,

  /**
   * A `DOMParser` instance is used to parse and load the given XML text content.
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
   * Sends an alert message to the user. The implementor should display the message in a dialog.
   * @param message The message to alert.
   */
  alert(message?: string): void;
  /**
   * Instructs the user agent to display a dialog with an optional message, and to wait until the user either confirms or cancels the dialog.
   * @param message The message to confirm.
   * @returns A boolean indicating whether OK (true) or Cancel (false) was selected.
   */
  confirm(message?: string): boolean;
  /**
   * Instructs the user agent to display a dialog with an optional message prompting the user to input some text, and to wait until the user either submits the text or cancels the dialog.
   * @param message A string of text to display to the user. Can be omitted if there is nothing to show in the prompt window.
   * @param defaultValue A string containing the default value displayed in the text input field.
   * @returns A string containing the text entered by the user, or `null`.
   */
  prompt(message?: string, defaultValue?: string): string;

  /**
   * Implement the vibrate() method to pulses the vibration hardware on the device.
   */
  vibrate?(pattern: VibratePattern): boolean;

  /**
   * It returns a `WebSocket` constructor, which is used to create a WebSocket connection.
   */
  getWebSocketConstructor?(): typeof WebSocket;

  /**
   * It returns a `MediaPlayer` constructor, which is used to play audio or video as the backend of HTMLMediaElement.
   */
  getMediaPlayerConstructor?(): MediaPlayerConstructor;

  /**
   * It creates a `XRSessionBackend` instance, which is used to create a XRSession and related instances.
   */
  createXRSessionBackend?(init?: XRSessionBackendInit): XRSessionBackend;

  /**
   * Returns if the given `XRSessionMode` is supported.
   * @param mode 
   */
  isXRSessionSupported?(mode: XRSessionMode): Promise<boolean>;
}

export interface NativeEngine extends BABYLON.Engine { }

/**
 * The entry point that implementation must provide to the native engine.
 */
export interface NativeDocument extends EventTarget {
  engine: NativeEngine | BABYLON.Engine;
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
   * It returns a `XRPose` which represents the pose of the viewer in space.
   */
  getViewerPose?(): XRPose;

  /**
   * It returns a map of preloaded meshes.
   * 
   * When loading a XSML document, the implementation should preload the specific meshes.
   */
  getPreloadedMeshes(): Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>>;

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
   * It creates a `ImageBitmap` from the given image buffer.
   * @param image 
   */
  createImageBitmap(image: ArrayBuffer | ArrayBufferView): Promise<ImageBitmap>;

  /**
   * It decodes a given `ImageBitmap` with the expected size, then returns a promise of ImageData which contains the decoded pixels.
   * 
   * @param image The image buffer to decode.
   * @param sizes The size of the image in width and height.
   */
  decodeImage(bitmap: ImageBitmap, size?: [number, number]): Promise<ImageDataImpl>

  /**
   * This stops further resource loading in the current context.
   */
  stop(): void;

  /**
   * This closes this document, the implementor should release all resources and
   * mark the document's `closed` flag to `true`.
   */
  close(): void;

  /**
   * The transport used by the CDP.
   */
  cdpTransport?: ITransport;
}
