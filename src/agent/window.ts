import * as taffy from '@bindings/taffy';
import DOMExceptionImpl from '../living/domexception';
import { MediaPlayerBackend, NativeDocument, ResourceLoader } from '../impl-interfaces';
import { AssetsBundle } from './resources/AssetsBundle';
import type { ElementImpl } from '../living/nodes/Element';
import type { SpatialElement } from '../living/nodes/SpatialElement';
import type CSSSpatialStyleDeclaration from '../living/cssom/CSSSpatialStyleDeclaration';
import { CustomElementRegistryImpl } from '../living/custom-elements/CustomElementRegistry';
import { getDeclarationForElement } from '../living/helpers/style-rules';
import { PerformanceImpl } from '../living/hr-time/Performance';
import { GlobalEventHandlersImpl } from '../living/nodes/GlobalEventHandlers';
import { SpatialDocumentImpl } from '../living/nodes/SpatialDocument';
import { NavigatorImpl } from './navigator';
import { createAudioConstructor } from '../living/audiocontext/Audio';
import { clearTimer, stopAllTimers, timerInitializationSteps } from './timers';
import { getInterfaceWrapper } from '../living/interfaces';

// Global interface types.
import type NoiseImpl from '../living/crypto/Noise';
import type XRPoseImpl from '../living/xr/XRPose';
import type XRRigidTransformImpl from '../living/xr/XRRigidTransform';
import type XRSessionImpl from '../living/xr/XRSession';
import type DOMPointReadOnlyImpl from '../living/geometry/DOMPointReadOnly';
import type DOMPointImpl from '../living/geometry/DOMPoint';
import type DOMRectReadOnlyImpl from '../living/geometry/DOMRectReadOnly';
import type DOMRectImpl from '../living/geometry/DOMRect';
import { CdpServerImplementation } from './cdp/cdp-implementation';
import { createConsole } from './console';

export type WindowOrDOMInit<T extends NativeDocument> = {
  url?: string;
  nativeDocument: T;
  referrer?: string;
  contentType?: string;
  storageQuota?: number;
  runScripts?: 'dangerously' | 'outside-only' | 'never';
  id?: string;
};

/**
 * A `BaseWindowImpl` which implements the window interfaces, and will be the global object to be used
 * in the XSML TypeScript.
 */
export interface BaseWindowImpl<T extends NativeDocument = NativeDocument> extends EventTarget, GlobalEventHandlersImpl { };
export class BaseWindowImpl<T extends NativeDocument = NativeDocument> extends EventTarget implements Window {
  #document: SpatialDocumentImpl<T>;
  #nativeDocument: NativeDocument;
  #performanceInstance: Performance = null;
  #resourceLoader: ResourceLoader;
  #assetsBundles: Map<string, AssetsBundle> = new Map();
  #listOfActiveTimers: Map<number, number> = new Map();
  #listOfAudioPlayers: Set<MediaPlayerBackend> = new Set();
  #audioConstructor: typeof Audio;
  /**
   * NOTE: This is only available when the NativeDocument implements `cdpTransport`.
   */
  _cdpImplementation: CdpServerImplementation | null = null;

  URL = globalThis.URL;
  Blob = globalThis.Blob;

  /**
   * Web Crypto
   */
  Noise: typeof NoiseImpl;

  /**
   * DOM Geometry Interfaces
   */
  DOMRect: typeof DOMRectImpl;
  DOMRectReadOnly: typeof DOMRectReadOnlyImpl;
  DOMPoint: typeof DOMPointImpl;
  DOMPointReadOnly: typeof DOMPointReadOnlyImpl;

  /**
   * WebXR Device API
   */
  XRPose: typeof XRPoseImpl;
  XRRigidTransform: typeof XRRigidTransformImpl;
  XRSession: typeof XRSessionImpl;

  /**
   * Event handlers
   */
  onafterprint: (this: WindowEventHandlers, ev: Event) => any;
  onbeforeprint: (this: WindowEventHandlers, ev: Event) => any;
  onbeforeunload: (this: WindowEventHandlers, ev: BeforeUnloadEvent) => any;
  ongamepadconnected: (this: WindowEventHandlers, ev: GamepadEvent) => any;
  ongamepaddisconnected: (this: WindowEventHandlers, ev: GamepadEvent) => any;
  onhashchange: (this: WindowEventHandlers, ev: HashChangeEvent) => any;
  onlanguagechange: (this: WindowEventHandlers, ev: Event) => any;
  onmessage: (this: WindowEventHandlers, ev: MessageEvent<any>) => any;
  onmessageerror: (this: WindowEventHandlers, ev: MessageEvent<any>) => any;
  onoffline: (this: WindowEventHandlers, ev: Event) => any;
  ononline: (this: WindowEventHandlers, ev: Event) => any;
  onpagehide: (this: WindowEventHandlers, ev: PageTransitionEvent) => any;
  onpageshow: (this: WindowEventHandlers, ev: PageTransitionEvent) => any;
  onpopstate: (this: WindowEventHandlers, ev: PopStateEvent) => any;
  onrejectionhandled: (this: WindowEventHandlers, ev: PromiseRejectionEvent) => any;
  onunhandledrejection: (this: WindowEventHandlers, ev: PromiseRejectionEvent) => any;
  onstorage: (this: WindowEventHandlers, ev: StorageEvent) => any;
  onunload: (this: WindowEventHandlers, ev: Event) => any;

  constructor(init: WindowOrDOMInit<T>) {
    super();

    this.#nativeDocument = init.nativeDocument;
    if (this.#nativeDocument.cdpTransport) {
      this._cdpImplementation = new CdpServerImplementation(this.#nativeDocument.cdpTransport, this);
    }

    this.#setup(init);
    this._customElementRegistry = new CustomElementRegistryImpl(this.#nativeDocument);

    const windowInitialized = performance.now();
    this.#resourceLoader = this.#nativeDocument.userAgent.resourceLoader;
    this.#document = new SpatialDocumentImpl(this.#nativeDocument, {
      // TODO
    }, {
      options: {
        url: init.url,
        contentType: init.contentType,
        encoding: 'utf-8',
        scriptingDisabled: init.runScripts === 'never',
        xsmlVersion: '1.0',
        defaultView: this,
      },
    });
    this.#document._defaultView = this;
    this.#nativeDocument.attachedDocument = this.#document;
    if (this._cdpImplementation) {
      this._cdpImplementation.document = this.#document;
    }
    this.navigator = new NavigatorImpl(this.#nativeDocument, []);

    // Create the performance instance.
    this.#performanceInstance = new PerformanceImpl(this.#nativeDocument, [], {
      timeOrigin: performance.timeOrigin + windowInitialized,
      nowAtTimeOrigin: windowInitialized,
    });

    // Set the references.
    this.window = this as any;
  }

  #setup(init: WindowOrDOMInit<T>) {
    const { runScripts } = init;
    if (runScripts === 'outside-only' || runScripts === 'dangerously') {
      // Setup for executing scripts.
    }
  }

  #disposeAudioPlayers() {
    for (const player of this.#listOfAudioPlayers) {
      player.dispose();
    }
    this.#listOfAudioPlayers.clear();
  }

  /**
   * Internals access
   */

  /**
   * @internal
   * 
   * Prepare some fields internally.
   */
  _prepare() {
    this._taffyAllocator = new taffy.Allocator();

    // Set the DOM & Web interfaces
    this.Noise = getInterfaceWrapper('Noise');
    this.DOMRect = getInterfaceWrapper('DOMRect');
    this.DOMRectReadOnly = getInterfaceWrapper('DOMRectReadOnly');
    this.DOMPoint = getInterfaceWrapper('DOMPoint');
    this.DOMPointReadOnly = getInterfaceWrapper('DOMPointReadOnly');
    this.XRPose = getInterfaceWrapper('XRPose');
    this.XRRigidTransform = getInterfaceWrapper('XRRigidTransform');
    this.XRSession = getInterfaceWrapper('XRSession');
  }

  /**
   * @internal
   * 
   * This creates a new assets bundle from the given assets.
   * 
   * @param id 
   * @param assets 
   * @param isGltf 
   */
  _createAssetsBundle(id: string, assets: BABYLON.ISceneLoaderAsyncResult, isGltf: boolean) {
    this.#assetsBundles.set(id, new AssetsBundle(assets, isGltf, this.#document));
  }

  /**
   * @internal
   * 
   * This returns if the assets bundle with the given id exists.
   * 
   * @param id 
   * @returns 
   */
  _hasAssetsBundle(id: string): boolean {
    return this.#assetsBundles.has(id);
  }

  /**
   * @internal
   * 
   * This returns the assets bundle with the given id.
   * 
   * @param id 
   * @returns 
   */
  _getAssetsBundle(id: string): AssetsBundle {
    return this.#assetsBundles.get(id);
  }

  /**
   * @internal
   */
  _customElementRegistry: CustomElementRegistryImpl;

  /**
   * @internal
   */
  get _nativeDocument(): NativeDocument {
    return this.#nativeDocument;
  }

  /**
   * @internal
   */
  get _listOfAudioPlayers(): Set<MediaPlayerBackend> {
    return this.#listOfAudioPlayers;
  }

  /**
   * @internal
   * 
   * The Layout library shared allocator.
   */
  _taffyAllocator: taffy.Allocator;

  [index: number]: Window;
  get length(): number {
    return 0;
  }

  get clientInformation(): Navigator {
    throw new Error('`window.clientInformation` has been deprecated.');
  }
  get closed(): boolean {
    return this.#nativeDocument.closed;
  }
  get customElements(): CustomElementRegistry {
    throw new Error('`window.customElements` is not supported.');
  }
  get devicePixelRatio(): number {
    return this.#nativeDocument.userAgent.devicePixelRatio;
  }
  get document(): Document {
    return this.#document;
  }
  get event(): Event {
    throw new Error('`window.event` has been deprecated.');
  }
  get external(): External {
    throw new Error('`window.external` has been deprecated.');
  }
  get frameElement(): Element {
    throw new Error('`window.frameElement` is not supported.');
  }
  get frames(): Window {
    throw new Error('`window.frames` is not supported.');
  }
  get history(): History {
    throw new Error('`window.history` is not supported.');
  }
  get innerHeight(): number {
    throw new Error('`window.innerHeight` is not available in XSML.');
  }
  get innerWidth(): number {
    throw new Error('`window.innerWidth` is not available in XSML.');
  }
  get location(): Location {
    return this.document.location;
  }
  set location(href: Location) {
    this.document.location = href;
  }
  get locationbar(): BarProp {
    throw new Error('`window.locationbar` is not supported yet.');
  }
  get menubar(): BarProp {
    throw new Error('`window.menubar` is not supported yet.');
  }
  get name(): string {
    return '';
  }
  navigator: Navigator;
  ondevicemotion: (this: Window, ev: DeviceMotionEvent) => any;
  ondeviceorientation: (this: Window, ev: DeviceOrientationEvent) => any;
  onorientationchange: (this: Window, ev: Event) => any;
  get opener(): Window {
    throw new Error('`window.opener` is not supported.');
  }
  get orientation(): number {
    throw new Error('`window.orientation` has been deprecated.');
  }
  get outerHeight(): number {
    throw new Error('`window.outerHeight` is not available in XSML.');
  }
  get outerWidth(): number {
    throw new Error('`window.outerWidth` is not available in XSML.');
  }
  get pageXOffset(): number {
    throw new Error('`window.pageXOffset` is not available in XSML.');
  }
  get pageYOffset(): number {
    throw new Error('`window.pageYOffset` is not available in XSML.');
  }
  get parent(): Window {
    throw new Error('`window.parent` is not supported.');
  }
  get personalbar(): BarProp {
    throw new Error('`window.personalbar` is not supported yet.');
  }
  get screen(): Screen {
    throw new Error('`window.screen` is not supported.');
  }
  get screenLeft(): number {
    throw new Error('`window.screenLeft` is not supported.');
  }
  get screenTop(): number {
    throw new Error('`window.screenTop` is not supported.');
  }
  get screenX(): number {
    throw new Error('`window.screenX` is not supported.');
  }
  get screenY(): number {
    throw new Error('`window.screenY` is not supported.');
  }
  get scrollX(): number {
    throw new Error('`window.scrollX` is not supported.');
  }
  get scrollY(): number {
    throw new Error('`window.scrollY` is not supported.');
  }
  get scrollbars(): BarProp {
    throw new Error('`window.scrollbars` is not supported yet.');
  }
  get self(): Window & typeof globalThis {
    throw new Error('`window.self` is not supported.');
  }
  get speechSynthesis(): SpeechSynthesis {
    throw new Error('`window.speechSynthesis` is not supported.');
  }
  get status(): string {
    throw new Error('`window.status` has been deprecated.');
  }
  get statusbar(): BarProp {
    throw new Error('`window.statusbar` is not supported yet.');
  }
  get toolbar(): BarProp {
    throw new Error('`window.toolbar` is not supported yet.');
  }
  get top(): Window {
    throw new Error('`window.top` is not supported.');
  }
  get console(): Console {
    return createConsole(this.#nativeDocument.console, this);
  }
  visualViewport: VisualViewport;
  window: Window & typeof globalThis;

  alert(message?: any): void {
    this.#nativeDocument.userAgent.alert(message);
  }
  blur(): void {
    throw new Error('`window.blur()` is not supported.');
  }
  cancelIdleCallback(handle: number): void {
    throw new Error('`window.cancelIdleCallback()` is not supported.');
  }
  captureEvents(): void {
    throw new Error('`window.captureEvents()` has been deprecated.');
  }
  close(): void {
    stopAllTimers();
    this.#disposeAudioPlayers();
    this.#nativeDocument.close();

    // Dispose self after the native document is closed.
    this._taffyAllocator.free();
    this._taffyAllocator = null;
  }
  confirm(message?: string): boolean {
    return this.#nativeDocument.userAgent.confirm(message);
  }
  focus(): void {
    throw new Error('`window.focus()` is not supported.');
  }

  /**
   * Returns the computed style of an element.
   * @param elt - The element to get the computed style for.
   * @param pseudoElt - Optional. A string specifying the pseudo-element to get the computed style for.
   * @returns The computed style of the element.
   * @throws Error if `window.getComputedStyle()` is not supported.
   */
  getComputedStyle(elt: Element, pseudoElt?: string): CSSStyleDeclaration {
    if (pseudoElt !== undefined && pseudoElt !== null && pseudoElt !== '') {
      throw new Error('`window.getComputedStyle()` is not supported for pseudo element.');
    }
    return getDeclarationForElement(elt as ElementImpl);
  }

  getComputedSpatialStyle(elt: SpatialElement, pseudoElt?: string): CSSSpatialStyleDeclaration {
    if (pseudoElt !== undefined && pseudoElt !== null && pseudoElt !== '') {
      throw new Error('`window.getComputedStyle()` is not supported for pseudo element.');
    }
    return getDeclarationForElement(elt);
  }

  getSelection(): Selection {
    throw new Error('`window.getSelection()` is not supported.');
  }
  matchMedia(query: string): MediaQueryList {
    throw new Error('`window.matchMedia()` is not supported.');
  }
  moveBy(x: number, y: number): void {
    throw new Error('`window.moveBy()` is not allowed in XSML.');
  }
  moveTo(x: number, y: number): void {
    throw new Error('`window.moveTo()` is not allowed in XSML.');
  }
  open(url?: string | URL, target?: string, features?: string): Window {
    throw new Error('`window.open()` is not allowed in XSML.');
  }
  postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
  postMessage(message: any, options?: WindowPostMessageOptions): void;
  postMessage(message: unknown, targetOrigin?: unknown, transfer?: unknown): void {
    throw new Error('`window.postMessage()` is not allowed in XSML.');
  }
  /**
   * TODO: in XSML, the `print()` method could be used to take a picture based on the current
   * viewer pose.
   */
  print(): void {
    throw new Error('`window.print()` is not supported.');
  }
  prompt(message?: string, _default?: string): string {
    return this.#nativeDocument.userAgent.prompt(message, _default);
  }
  /**
   * @deprecated
   */
  releaseEvents(): void {
    throw new Error('`window.releaseEvents()` has been deprecated.');
  }
  requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
    throw new Error('`window.requestIdleCallback()` is not supported.');
  }
  resizeBy(x: number, y: number): void {
    throw new Error('`window.resizeBy()` is not allowed in XSML.');
  }
  resizeTo(width: number, height: number): void {
    throw new Error('`window.resizeTo()` is not allowed in XSML.');
  }
  scroll(options?: ScrollToOptions): void;
  scroll(x: number, y: number): void;
  scroll(x?: unknown, y?: unknown): void {
    throw new Error('`window.scroll()` is not allowed in XSML.');
  }
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: unknown, y?: unknown): void {
    throw new Error('`window.scrollBy()` is not allowed in XSML.');
  }
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: unknown, y?: unknown): void {
    throw new Error('`window.scrollTo()` is not allowed in XSML.');
  }
  stop(): void {
    this.#nativeDocument.stop();
  }
  get mozIndexedDB(): IDBFactory {
    throw new Error('`window.mozIndexedDB` is not supported.');
  }
  get webkitIndexedDB(): IDBFactory {
    throw new Error('`window.webkitIndexedDB` is not supported.');
  }
  get msIndexedDB(): IDBFactory {
    throw new Error('`window.msIndexedDB` is not supported.');
  }

  mozRequestAnimationFrame(callback: FrameRequestCallback): number {
    throw new Error('`window.mozRequestAnimationFrame()` is not allowed in XSML.');
  }
  oRequestAnimationFrame(callback: FrameRequestCallback): number {
    throw new Error('`window.oRequestAnimationFrame()` is not allowed in XSML.');
  }
  get WebGLRenderingContext(): WebGLRenderingContext {
    throw new Error('`window.WebGLRenderingContext` is not supported.');
  }
  get CANNON(): any {
    return null;
  }
  get Audio(): typeof Audio {
    if (!this.#audioConstructor) {
      this.#audioConstructor = createAudioConstructor(this.#nativeDocument);
    }
    return this.#audioConstructor;
  }
  get AudioContext(): AudioContext {
    throw new Error('`window.AudioContext` is not supported.');
  }
  get webkitAudioContext(): AudioContext {
    throw new Error('`window.webkitAudioContext` is not supported.');
  }

  cancelAnimationFrame(handle: number): void {
    throw new Error('`window.cancelAnimationFrame()` is not allowed in XSML, please use `XRSession.requestAnimationFrame()` instead.');
  }
  requestAnimationFrame(callback: FrameRequestCallback): number {
    throw new Error('`window.requestAnimationFrame()` is not allowed in XSML, please use `XRSession.cancelAnimationFrame()` instead.');
  }

  get localStorage(): Storage {
    throw new Error('`window.localStorage` is not supported.');
  }
  get sessionStorage(): Storage {
    throw new Error('`window.sessionStorage` is not supported.');
  }
  get caches(): CacheStorage {
    throw new Error('`window.caches` is not supported.');
  }
  get crossOriginIsolated(): boolean {
    return false;
  }
  get crypto(): Crypto {
    throw new Error('`window.crypto` is not supported.');
  }
  get indexedDB(): IDBFactory {
    throw new Error('`window.indexedDB` is not supported.');
  }
  get isSecureContext(): boolean {
    return false;
  }
  get origin(): string {
    return '';
  }
  get performance(): Performance {
    return this.#performanceInstance;
  }

  atob(data: string): string {
    try {
      return globalThis.atob(data);
    } catch (e) {
      throw new DOMExceptionImpl(
        'The string to be decoded contains invalid characters.',
        'INVALID_CHARACTER_ERR'
      );
    }
  }

  btoa(data: string): string {
    try {
      return globalThis.btoa(data);
    } catch (e) {
      throw new DOMExceptionImpl(
        'The string to be decoded contains invalid characters.',
        'INVALID_CHARACTER_ERR'
      );
    }
  }

  createImageBitmap(image: ImageBitmapSource, options?: ImageBitmapOptions): Promise<ImageBitmap>;
  createImageBitmap(image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, options?: ImageBitmapOptions): Promise<ImageBitmap>;
  createImageBitmap(image: unknown, sx?: unknown, sy?: unknown, sw?: unknown, sh?: unknown, options?: unknown): Promise<ImageBitmap> {
    throw new Error('`window.createImageBitmap()` is not supported.');
  }

  fetch(input: URL | RequestInfo, init?: RequestInit): Promise<Response> {
    return globalThis.fetch(input, init);
  }

  queueMicrotask(callback: VoidFunction): void {
    return globalThis.queueMicrotask(callback);
  }

  reportError(e: any): void {
    throw new Error('`window.reportError()` is not supported.');
  }

  setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number {
    if (typeof handler !== 'function') {
      throw new DOMExceptionImpl(
        'The callback provided as parameter 1 is not a function.', 'TYPE_MISMATCH_ERR');
    }
    return timerInitializationSteps(
      handler,
      timeout,
      args,
      {
        hostObject: this.#nativeDocument,
        methodContext: this,
        repeat: false,
      }
    );
  }

  setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number {
    if (typeof handler !== 'function') {
      throw new DOMExceptionImpl(
        'The callback provided as parameter 1 is not a function.', 'TYPE_MISMATCH_ERR');
    }
    return timerInitializationSteps(
      handler,
      timeout,
      args,
      {
        hostObject: this.#nativeDocument,
        methodContext: this,
        repeat: true,
      }
    );
  }

  clearInterval(id: number): void {
    clearTimer(id);
  }

  clearTimeout(id: number): void {
    clearTimer(id);
  }

  structuredClone<T = any>(value: T, options?: StructuredSerializeOptions): T {
    throw new Error('`window.structuredClone()` is not supported.');
  }

  /**
   * FIXME(Yorkie): The below properties are added by Babylon.js, we don't need to implement them but we keep them
   * here for TypeScript to pass the type checking.
   */
  PointerEvent: any;
  Math: Math;
  Uint8Array: Uint8ArrayConstructor;
  Float32Array: Float32ArrayConstructor;
  webkitURL: {
    new(url: string | URL, base?: string | URL): URL;
    prototype: URL;
    canParse(url: string | URL, base?: string): boolean;
    createObjectURL(obj: Blob | MediaSource): string;
    revokeObjectURL(url: string): void;
  }
  mozURL: {
    new(url: string | URL, base?: string | URL): URL;
    prototype: URL;
    canParse(url: string | URL, base?: string): boolean;
    createObjectURL(obj: Blob | MediaSource): string;
    revokeObjectURL(url: string): void;
  };
  msURL: {
    new(url: string | URL, base?: string | URL): URL;
    prototype: URL;
    canParse(url: string | URL, base?: string): boolean;
    createObjectURL(obj: Blob | MediaSource): string;
    revokeObjectURL(url: string): void;
  };
  DracoDecoderModule: any;
  setImmediate(handler: (...args: any[]) => void): number {
    throw new Error("Method not implemented.");
  }
}

export function createWindow<T extends NativeDocument>(init: WindowOrDOMInit<T>) {
  return new BaseWindowImpl(init);
}
