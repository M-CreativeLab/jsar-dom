import BABYLON from 'babylonjs';
import { Mixin } from 'ts-mixer';
import { NativeDocument } from '../../impl-interfaces';
import { DocumentTypeImpl } from './DocumentType';
import { SpatialObject } from './SpatialObject';
import { XSMLShadowRoot } from './ShadowRoot';
import { NodeImpl } from './Node';
import { HTMLElementImpl } from './HTMLElement';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../../symbols';
import { AttrImpl } from '../attributes/Attr';
import { domSymbolTree } from '../helpers/internal-constants';
import { TextImpl } from './Text';
import { UIEventImpl } from '../events/UIEvent';
import { MouseEventImpl } from '../events/MouseEvent';
import { RangeImpl } from '../range/Range';
import StyleSheetListImpl from '../cssom/StyleSheetList';
import DocumentOrShadowRootImpl from './DocumentOrShadowRoot';
import ParentNodeImpl from './ParentNode';
import nwsapi from 'nwsapi';

type DocumentInitOptions = {
  screenWidth: number;
  screenHeight: number;
};

const eventInterfaceTable = {
  customevent: CustomEvent,
  errorevent: ErrorEvent,
  event: Event,
  events: Event,
  focusevent: FocusEvent,
  hashchangeevent: HashChangeEvent,
  htmlevents: Event,
  keyboardevent: KeyboardEvent,
  messageevent: MessageEvent,
  mouseevent: MouseEventImpl,
  mouseevents: MouseEventImpl,
  popstateevent: PopStateEvent,
  progressevent: ProgressEvent,
  svgevents: Event,
  touchevent: TouchEvent,
  uievent: UIEventImpl,
  uievents: UIEventImpl,
};

/**
 * The `SpatialDocument` is a new Web API, it represents the document object in space computing.
 * It is the root of the document tree, and provides the primary access to the document's data.
 */
export class SpatialDocumentImpl extends Mixin(NodeImpl, DocumentOrShadowRootImpl, ParentNodeImpl) implements Document {
  #nativeDocument: NativeDocument;
  #screenWidth: number;
  #screenHeight: number;

  doctype: DocumentType;
  domain: string;
  contentType: string;

  onbeforexrselect: (this: GlobalEventHandlers, ev: XRSessionEvent) => any;
  get ownerDocument() {
    return null;
  }
  get URL() {
    return this._URL.toString();
  }
  get documentURI() {
    return this._URL.toString();
  }
  alinkColor: string;
  bgColor: string;
  body: HTMLElement;

  get charset(): string {
    return this._encoding;
  }
  get characterSet(): string {
    return this._encoding;
  }
  get inputEncoding(): string {
    return this._encoding;
  }
  get compatMode(): string {
    return this._parsingMode === 'xml' || this.doctype ? 'CSS1Compat' : 'BackCompat';
  }
  cookie: string;
  currentScript: HTMLOrSVGScriptElement;
  defaultView: Window & typeof globalThis;
  designMode: string;
  dir: string;
  documentElement: HTMLElement;
  fgColor: string;
  fullscreen: boolean;
  fullscreenEnabled: boolean;
  head: HTMLHeadElement;
  hidden: boolean;
  get images(): HTMLCollectionOf<HTMLImageElement> {
    throw new DOMException('document.images is not supported', 'NotSupportedError');
  }
  get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
    throw new DOMException('document.embeds is not supported', 'NotSupportedError');
  }
  get links(): HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement> {
    return null;
  }
  get forms(): HTMLCollectionOf<HTMLFormElement> {
    throw new DOMException('document.forms is not supported', 'NotSupportedError');
  }
  get scripts(): HTMLCollectionOf<HTMLScriptElement> {
    return null;
  }
  get anchors(): HTMLCollectionOf<HTMLAnchorElement> {
    throw new DOMException('document.anchors is not supported', 'NotSupportedError');
  }
  get applets(): HTMLCollection {
    throw new DOMException('document.applets is not supported', 'NotSupportedError');
  }
  get all(): HTMLAllCollection {
    throw new DOMException('document.all is not supported', 'NotSupportedError');
  }
  implementation: DOMImplementation;
  get lastModified(): string {
    return this._lastModified;
  }
  linkColor: string;
  get location(): Location {
    throw new Error('Method not implemented.');
  }
  set location(href: Location) {
    throw new Error('Method not implemented.');
  }

  get visibilityState(): DocumentVisibilityState {
    return 'visible';
  }

  onfullscreenchange: (this: Document, ev: Event) => any;
  onfullscreenerror: (this: Document, ev: Event) => any;
  onpointerlockchange: (this: Document, ev: Event) => any;
  onpointerlockerror: (this: Document, ev: Event) => any;
  onreadystatechange: (this: Document, ev: Event) => any;
  onvisibilitychange: (this: Document, ev: Event) => any;
  pictureInPictureEnabled: boolean;
  plugins: HTMLCollectionOf<HTMLEmbedElement>;
  readyState: DocumentReadyState;
  referrer: string;
  rootElement: SVGSVGElement;
  scrollingElement: Element;
  timeline: DocumentTimeline;
  title: string;
  vlinkColor: string;

  _parsingMode: string = 'xsml';
  _scriptingDisabled: boolean = false;
  _encoding: string;
  _URL: URL;

  _lastModified: string;
  _styleCache: any;
  _lastFocusedElement: Element | null;

  // CSS selectors
  _nwsapi: nwsapi.NWSAPI;
  _nwsapiDontThrow: nwsapi.NWSAPI;

  /** Used for spatial objects */
  _idsOfSpatialObjects: { [key: string]: SpatialObject } = {};
  private _guidSOfSpatialObjects: { [key: string]: SpatialObject } = {};

  constructor(
    nativeDocument: NativeDocument,
    options: DocumentInitOptions,
    privateData: {
      options: {
        url: string;
        contentType: string;
        encoding: string;
        scriptingDisabled?: boolean;
      }
    }
  ) {
    super(nativeDocument, [], null);

    this.#nativeDocument = nativeDocument;
    if (options) {
      this.#screenWidth = options.screenWidth;
      this.#screenHeight = options.screenHeight;
    }

    this.doctype = new DocumentTypeImpl(this.#nativeDocument, [], {
      name: 'xsml',
      publicId: '-//W3C//DTD XSML 1.0//EN',
      systemId: 'https://jsar.netlify.app/spec/xsml-1.0.dtd',
    }) as unknown as DocumentType;
    this.domain = '';
    this.contentType = privateData.options.contentType || 'application/xsml';

    this._attached = true;
    this._scriptingDisabled = privateData.options.scriptingDisabled;
    this._encoding = privateData.options.encoding || 'UTF-8';

    const urlOption = privateData.options.url === undefined ? 'about:blank' : privateData.options.url;
    if (URL.canParse(urlOption) === null) {
      throw new TypeError(`Could not parse ${urlOption} as a URL.`);
    }
    this._URL = new URL(urlOption);

    // Cache of computed element styles
    this._styleCache = null;

    // Bypass the GOMContentLoaded event from the XSML document.
    nativeDocument.engine.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent(new Event(event.type));
    });
  }

  adoptNode<T extends Node>(node: T): T {
    if (node.nodeType === NodeImpl.DOCUMENT_NODE) {
      throw new DOMException(
        'Cannot adopt a document node',
        'NotSupportedError'
      );
    } else if (node instanceof XSMLShadowRoot) {
      throw new DOMException(
        'Cannot adopt a shadow root',
        'HierarchyRequestError'
      );
    }

    this._adoptNode(node);
    return node;
  }

  captureEvents(): void {
    // TODO: implement this
  }

  caretRangeFromPoint(x: number, y: number): Range {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  close(): void {
    throw new Error('Method not implemented.');
  }

  createAttribute(localName: string): Attr {
    throw new Error('Method not implemented.');
  }

  createAttributeNS(namespace: string, qualifiedName: string): Attr {
    throw new Error('Method not implemented.');
  }

  createCDATASection(data: string): CDATASection {
    throw new DOMException('Method not implemented.', 'NotSupportedError');
  }

  createComment(data: string): Comment {
    throw new DOMException('Method not implemented.', 'NotSupportedError');
  }

  createDocumentFragment(): DocumentFragment {
    throw new Error('Method not implemented.');
  }

  createElementNS(namespaceURI: 'http://www.w3.org/1999/xhtml', qualifiedName: string): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: K): SVGElementTagNameMap[K];
  createElementNS(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): SVGElement;
  createElementNS<K extends keyof MathMLElementTagNameMap>(namespaceURI: 'http://www.w3.org/1998/Math/MathML', qualifiedName: K): MathMLElementTagNameMap[K];
  createElementNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', qualifiedName: string): MathMLElement;
  createElementNS(namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions): Element;
  createElementNS(namespace: string, qualifiedName: string, options?: string | ElementCreationOptions): Element;
  createElementNS(namespace: unknown, qualifiedName: unknown, options?: unknown): HTMLElement | Element | SVGElement | MathMLElement {
    throw new Error('Method not implemented.');
  }

  createEvent(eventInterface: 'AnimationEvent'): AnimationEvent;
  createEvent(eventInterface: 'AnimationPlaybackEvent'): AnimationPlaybackEvent;
  createEvent(eventInterface: 'AudioProcessingEvent'): AudioProcessingEvent;
  createEvent(eventInterface: 'BeforeUnloadEvent'): BeforeUnloadEvent;
  createEvent(eventInterface: 'BlobEvent'): BlobEvent;
  createEvent(eventInterface: 'ClipboardEvent'): ClipboardEvent;
  createEvent(eventInterface: 'CloseEvent'): CloseEvent;
  createEvent(eventInterface: 'CompositionEvent'): CompositionEvent;
  createEvent(eventInterface: 'CustomEvent'): CustomEvent<any>;
  createEvent(eventInterface: 'DeviceMotionEvent'): DeviceMotionEvent;
  createEvent(eventInterface: 'DeviceOrientationEvent'): DeviceOrientationEvent;
  createEvent(eventInterface: 'DragEvent'): DragEvent;
  createEvent(eventInterface: 'ErrorEvent'): ErrorEvent;
  createEvent(eventInterface: 'Event'): Event;
  createEvent(eventInterface: 'Events'): Event;
  createEvent(eventInterface: 'FocusEvent'): FocusEvent;
  createEvent(eventInterface: 'FontFaceSetLoadEvent'): FontFaceSetLoadEvent;
  createEvent(eventInterface: 'FormDataEvent'): FormDataEvent;
  createEvent(eventInterface: 'GamepadEvent'): GamepadEvent;
  createEvent(eventInterface: 'HashChangeEvent'): HashChangeEvent;
  createEvent(eventInterface: 'IDBVersionChangeEvent'): IDBVersionChangeEvent;
  createEvent(eventInterface: 'InputEvent'): InputEvent;
  createEvent(eventInterface: 'KeyboardEvent'): KeyboardEvent;
  createEvent(eventInterface: 'MIDIConnectionEvent'): MIDIConnectionEvent;
  createEvent(eventInterface: 'MIDIMessageEvent'): MIDIMessageEvent;
  createEvent(eventInterface: 'MediaEncryptedEvent'): MediaEncryptedEvent;
  createEvent(eventInterface: 'MediaKeyMessageEvent'): MediaKeyMessageEvent;
  createEvent(eventInterface: 'MediaQueryListEvent'): MediaQueryListEvent;
  createEvent(eventInterface: 'MediaStreamTrackEvent'): MediaStreamTrackEvent;
  createEvent(eventInterface: 'MessageEvent'): MessageEvent<any>;
  createEvent(eventInterface: 'MouseEvent'): MouseEvent;
  createEvent(eventInterface: 'MouseEvents'): MouseEvent;
  createEvent(eventInterface: 'MutationEvent'): MutationEvent;
  createEvent(eventInterface: 'MutationEvents'): MutationEvent;
  createEvent(eventInterface: 'OfflineAudioCompletionEvent'): OfflineAudioCompletionEvent;
  createEvent(eventInterface: 'PageTransitionEvent'): PageTransitionEvent;
  createEvent(eventInterface: 'PaymentMethodChangeEvent'): PaymentMethodChangeEvent;
  createEvent(eventInterface: 'PaymentRequestUpdateEvent'): PaymentRequestUpdateEvent;
  createEvent(eventInterface: 'PictureInPictureEvent'): PictureInPictureEvent;
  createEvent(eventInterface: 'PointerEvent'): PointerEvent;
  createEvent(eventInterface: 'PopStateEvent'): PopStateEvent;
  createEvent(eventInterface: 'ProgressEvent'): ProgressEvent<EventTarget>;
  createEvent(eventInterface: 'PromiseRejectionEvent'): PromiseRejectionEvent;
  createEvent(eventInterface: 'RTCDTMFToneChangeEvent'): RTCDTMFToneChangeEvent;
  createEvent(eventInterface: 'RTCDataChannelEvent'): RTCDataChannelEvent;
  createEvent(eventInterface: 'RTCErrorEvent'): RTCErrorEvent;
  createEvent(eventInterface: 'RTCPeerConnectionIceErrorEvent'): RTCPeerConnectionIceErrorEvent;
  createEvent(eventInterface: 'RTCPeerConnectionIceEvent'): RTCPeerConnectionIceEvent;
  createEvent(eventInterface: 'RTCTrackEvent'): RTCTrackEvent;
  createEvent(eventInterface: 'SecurityPolicyViolationEvent'): SecurityPolicyViolationEvent;
  createEvent(eventInterface: 'SpeechSynthesisErrorEvent'): SpeechSynthesisErrorEvent;
  createEvent(eventInterface: 'SpeechSynthesisEvent'): SpeechSynthesisEvent;
  createEvent(eventInterface: 'StorageEvent'): StorageEvent;
  createEvent(eventInterface: 'SubmitEvent'): SubmitEvent;
  createEvent(eventInterface: 'ToggleEvent'): ToggleEvent;
  createEvent(eventInterface: 'TouchEvent'): TouchEvent;
  createEvent(eventInterface: 'TrackEvent'): TrackEvent;
  createEvent(eventInterface: 'TransitionEvent'): TransitionEvent;
  createEvent(eventInterface: 'UIEvent'): UIEvent;
  createEvent(eventInterface: 'UIEvents'): UIEvent;
  createEvent(eventInterface: 'WebGLContextEvent'): WebGLContextEvent;
  createEvent(eventInterface: 'WheelEvent'): WheelEvent;
  createEvent(eventInterface: string): Event;
  createEvent(eventInterface: unknown): Event {
    const typeInLowercase = (eventInterface as string).toLowerCase();
    const EventConstructor = eventInterfaceTable[typeInLowercase] || null;

    if (!EventConstructor) {
      throw new DOMException(`The provided event type ("${eventInterface}") is invalid`,
        'NotSupportedError');
    }

    const event = new EventConstructor();
    return event;
  }

  createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter): NodeIterator {
    throw new Error('Method not implemented.');
  }

  createProcessingInstruction(target: string, data: string): ProcessingInstruction {
    throw new Error('Method not implemented.');
  }

  createRange(): Range {
    return new RangeImpl(this._hostObject, [], {
      start: { node: this, offset: 0 },
      end: { node: this, offset: 0 },
    });
  }

  createTextNode(data: string): Text {
    return new TextImpl(this._hostObject, [], {
      data,
    });
  }

  createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter): TreeWalker {
    throw new Error('Method not implemented.');
  }

  execCommand(commandId: string, showUI?: boolean, value?: string): boolean {
    throw new Error('Method not implemented.');
  }

  exitFullscreen(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  exitPictureInPicture(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  exitPointerLock(): void {
    throw new Error('Method not implemented.');
  }

  getElementById(elementId: string): HTMLElement {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  getElementsByName(elementName: string): NodeListOf<HTMLElement> {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(qualifiedName: unknown): HTMLCollectionOf<Element> {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1999/xhtml', localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/2000/svg', localName: string): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', localName: string): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespace: unknown, localName: unknown): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElement> | HTMLCollectionOf<SVGElement> | HTMLCollectionOf<MathMLElement> {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  getSelection(): Selection {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  hasFocus(): boolean {
    return Boolean(this._lastFocusedElement);
  }

  hasStorageAccess(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  importNode<T extends Node>(node: T, deep?: boolean): T {
    throw new Error('Method not implemented.');
  }

  open(unused1?: string, unused2?: string): Document;
  open(url: string | URL, name: string, features: string): Window;
  open(url?: unknown, name?: unknown, features?: unknown): Document | Window {
    throw new DOMException('Method not implemented.');
  }

  queryCommandEnabled(commandId: string): boolean {
    throw new Error('Method not implemented.');
  }
  queryCommandIndeterm(commandId: string): boolean {
    throw new Error('Method not implemented.');
  }
  queryCommandState(commandId: string): boolean {
    throw new Error('Method not implemented.');
  }
  queryCommandSupported(commandId: string): boolean {
    throw new Error('Method not implemented.');
  }
  queryCommandValue(commandId: string): string {
    throw new Error('Method not implemented.');
  }
  releaseEvents(): void {
    throw new Error('Method not implemented.');
  }
  requestStorageAccess(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  write(..._: string[]): void {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }
  writeln(..._: string[]): void {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }
  
  fonts: FontFaceSet;
  onabort: (this: GlobalEventHandlers, ev: UIEvent) => any;
  onanimationcancel: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationend: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationiteration: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationstart: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onauxclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onbeforeinput: (this: GlobalEventHandlers, ev: InputEvent) => any;
  onblur: (this: GlobalEventHandlers, ev: FocusEvent) => any;
  oncancel: (this: GlobalEventHandlers, ev: Event) => any;
  oncanplay: (this: GlobalEventHandlers, ev: Event) => any;
  oncanplaythrough: (this: GlobalEventHandlers, ev: Event) => any;
  onchange: (this: GlobalEventHandlers, ev: Event) => any;
  onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onclose: (this: GlobalEventHandlers, ev: Event) => any;
  oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  oncopy: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  oncuechange: (this: GlobalEventHandlers, ev: Event) => any;
  oncut: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  ondblclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  ondrag: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragend: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragenter: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragleave: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragover: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragstart: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondrop: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondurationchange: (this: GlobalEventHandlers, ev: Event) => any;
  onemptied: (this: GlobalEventHandlers, ev: Event) => any;
  onended: (this: GlobalEventHandlers, ev: Event) => any;
  onerror: OnErrorEventHandlerNonNull;
  onfocus: (this: GlobalEventHandlers, ev: FocusEvent) => any;
  onformdata: (this: GlobalEventHandlers, ev: FormDataEvent) => any;
  ongotpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  oninput: (this: GlobalEventHandlers, ev: Event) => any;
  oninvalid: (this: GlobalEventHandlers, ev: Event) => any;
  onkeydown: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onkeypress: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onkeyup: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onload: (this: GlobalEventHandlers, ev: Event) => any;
  onloadeddata: (this: GlobalEventHandlers, ev: Event) => any;
  onloadedmetadata: (this: GlobalEventHandlers, ev: Event) => any;
  onloadstart: (this: GlobalEventHandlers, ev: Event) => any;
  onlostpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onmousedown: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseenter: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseleave: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmousemove: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseout: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseover: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseup: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onpaste: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  onpause: (this: GlobalEventHandlers, ev: Event) => any;
  onplay: (this: GlobalEventHandlers, ev: Event) => any;
  onplaying: (this: GlobalEventHandlers, ev: Event) => any;
  onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onprogress: (this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any;
  onratechange: (this: GlobalEventHandlers, ev: Event) => any;
  onreset: (this: GlobalEventHandlers, ev: Event) => any;
  onresize: (this: GlobalEventHandlers, ev: UIEvent) => any;
  onscroll: (this: GlobalEventHandlers, ev: Event) => any;
  onscrollend: (this: GlobalEventHandlers, ev: Event) => any;
  onsecuritypolicyviolation: (this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any;
  onseeked: (this: GlobalEventHandlers, ev: Event) => any;
  onseeking: (this: GlobalEventHandlers, ev: Event) => any;
  onselect: (this: GlobalEventHandlers, ev: Event) => any;
  onselectionchange: (this: GlobalEventHandlers, ev: Event) => any;
  onselectstart: (this: GlobalEventHandlers, ev: Event) => any;
  onslotchange: (this: GlobalEventHandlers, ev: Event) => any;
  onstalled: (this: GlobalEventHandlers, ev: Event) => any;
  onsubmit: (this: GlobalEventHandlers, ev: SubmitEvent) => any;
  onsuspend: (this: GlobalEventHandlers, ev: Event) => any;
  ontimeupdate: (this: GlobalEventHandlers, ev: Event) => any;
  ontoggle: (this: GlobalEventHandlers, ev: Event) => any;
  ontouchcancel?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchend?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchmove?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchstart?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontransitioncancel: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionend: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionrun: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionstart: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  onvolumechange: (this: GlobalEventHandlers, ev: Event) => any;
  onwaiting: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationend: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationiteration: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationstart: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkittransitionend: (this: GlobalEventHandlers, ev: Event) => any;
  onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
  append(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  prepend(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K];
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K];
  querySelector<E extends Element = Element>(selectors: string): E;
  querySelector(selectors: unknown): Element {
    throw new Error('Method not implemented.');
  }
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll(selectors: unknown): NodeListOf<Element> {
    throw new Error('Method not implemented.');
  }
  replaceChildren(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  createExpression(expression: string, resolver?: XPathNSResolver): XPathExpression {
    throw new Error('Method not implemented.');
  }
  createNSResolver(nodeResolver: Node): Node {
    throw new Error('Method not implemented.');
  }
  evaluate(expression: string, contextNode: Node, resolver?: XPathNSResolver, type?: number, result?: XPathResult): XPathResult {
    throw new Error('Method not implemented.');
  }

  /**
   * Get the current scene from the space.
   */
  get scene() {
    return this.#nativeDocument.getNativeScene();
  }

  get screenWidth() {
    return this.#screenWidth;
  }

  get screenHeight() {
    return this.#screenHeight;
  }

  /**
   * This returns this space pose(position, rotation) in the world.
   */
  get poseInWorld() {
    return this.#nativeDocument.getContainerPose();
  }

  attachShadow(target: SpatialObject, options?: ShadowRootInit): XSMLShadowRoot {
    return target.attachShadow(options);
  }

  /**
   * Create an element by tag name which could be append to a `XSMLShadowRoot`.
   * @param tagName the tag name: "div", "span", "b", "a", "button" ...
   */
  createElement(tagName: string): HTMLElement {
    let element: HTMLElementImpl;
    switch (tagName.toUpperCase()) {
      case 'DIV':
        element = HTMLElementImpl.createElement(this.#nativeDocument, 'div');
        break;
      case 'SPAN':
        element = HTMLElementImpl.createElement(this.#nativeDocument, 'span');
        break;
      case 'P':
        element = HTMLElementImpl.createElement(this.#nativeDocument, 'p');
        break;
      case 'BUTTON':
      case 'A':
      case 'B':
      case 'I':
      default:
        throw new TypeError(`Unknown element type: ${tagName}`);
    }
    return element;
  }

  /**
   * Create a new spatial object by the tag name.
   * @param tagName the tag name of the spatial element.
   */
  createSpatialObject(tagName: string, attributes: any) {
    let spatialObject: BABYLON.Node;
    const getNodeNameOrId = (typeStr: string) => attributes.id || attributes.name || typeStr;
    const scene = this.#nativeDocument.getNativeScene();

    switch (tagName) {
      case 'plane':
        spatialObject = BABYLON.MeshBuilder.CreatePlane(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'cube':
        spatialObject = BABYLON.MeshBuilder.CreateBox(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'sphere':
        spatialObject = BABYLON.MeshBuilder.CreateSphere(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'cylinder':
        spatialObject = BABYLON.MeshBuilder.CreateCylinder(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'capsule':
        spatialObject = BABYLON.MeshBuilder.CreateCapsule(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'torus':
        spatialObject = BABYLON.MeshBuilder.CreateTorus(getNodeNameOrId(tagName), attributes, scene);
        break;
      case 'bound':
        spatialObject = this.#nativeDocument.createBoundTransformNode(getNodeNameOrId(tagName));
        break;
      case 'mesh':
        spatialObject = this.#createSpatialObjectFromModel(attributes);
        break;
      default:
        throw new TypeError(`Unknown spatial object type: ${tagName}`);
    }

    if (attributes.id) {
      spatialObject.id = attributes.id;
    }
    // TODO: move the class & style to here xsml runtime.
    const createdObject = new SpatialObject(this.#nativeDocument, [], {
      object: spatialObject,
      scene: this.scene,
    });

    // Save the spatial object to the ids map.
    if (attributes.id) {
      /**
       * Note(Yorkie): we must use the `attributes.id` as the key, because the Babylon.js will generate the id by name, its unexpectable behaviour.
       */
      this._idsOfSpatialObjects[attributes.id] = createdObject;
    }

    // Save the spatial object to the guids map for internal uses.
    const guid = createdObject[SPATIAL_OBJECT_GUID_SYMBOL];
    this._guidSOfSpatialObjects[guid] = createdObject;
    return createdObject;
  }

  /**
   * This method create a new `SpatialObject` by a reference to the native object `BABYLON.Node`, it's useful to create `SpatialObject`s which is created by model or created by Babylon.js.
   * @param nativeObject The native object, namely `BABYLON.Node`.
   * @returns a new `SpatialObject` instance to reference the native object.
   */
  createSpatialObjectByNativeReference(nativeObject: BABYLON.Node) {
    return new SpatialObject(this.#nativeDocument, [], {
      object: nativeObject,
      scene: this.scene,
    });
  }

  /**
   * The `getSpatialObjectById()` method of the `SpatialDocument` interface returns an `SpatialObject` object representing the object whose id property matches the specified string. 
   * Since element IDs are required to be unique if specified, they're a useful way to get access to a specific element quickly.
   */
  getSpatialObjectById(id: string): SpatialObject {
    return this._idsOfSpatialObjects[id];
  }

  /**
   * This is used to get the spatial object by the transmute GUID.
   * @internal
   */
  _getSpatialObjectByGuid(guid: string): SpatialObject {
    return this._guidSOfSpatialObjects[guid];
  }

  #cloneWithOriginalRefs(
    source: BABYLON.Node,
    name: string,
    newParent: BABYLON.Node,
    onClonedObversaval?: (origin: BABYLON.Node, cloned: BABYLON.Node) => void
  ): BABYLON.Node {
    const result = source.clone(name, newParent, true);
    result.setEnabled(true);

    if (typeof onClonedObversaval === 'function') {
      onClonedObversaval(source, result);
    }
    const directDescendantsOfSource = source.getDescendants(true);
    for (let child of directDescendantsOfSource) {
      this.#cloneWithOriginalRefs(child, child.name, result, onClonedObversaval);
    }
    return result;
  }

  #createSpatialObjectFromModel(attributes: any): BABYLON.Node {
    const refName = attributes.ref;
    const selector = attributes.selector;

    if (!refName ||
      !this.#nativeDocument.getPreloadedMeshes()) {
      throw new TypeError('Invalid mesh reference: ' + refName);
    }
    const meshes = this.#nativeDocument.getPreloadedMeshes().get(refName);
    if (meshes.length <= 0) {
      throw new TypeError(`The referenced mesh(${refName}) has no meshes loaded.`);
    }

    let selectedMesh: BABYLON.TransformNode;
    if (!selector) {
      selectedMesh = meshes[0];
    } else {
      selectedMesh = meshes.find((mesh) => mesh.name === selector);
    }

    if (!selectedMesh) {
      throw new TypeError(`Could not find the mesh(${selector}) in the referenced mesh(${refName}).`);
    }

    const name = attributes.id || attributes.name || 'custom';
    const originUniqueIdToClonedMap: { [key: number]: BABYLON.Node } = {};
    const clonedMesh = this.#cloneWithOriginalRefs(selectedMesh, name, null, (origin, cloned) => {
      originUniqueIdToClonedMap[origin.uniqueId] = cloned;
    });

    /** Set the cloned skeleton, it set the new bone's linking transforms to new. */
    clonedMesh.getChildMeshes().forEach((childMesh) => {
      if (childMesh.skeleton) {
        const clonedSkeleton = childMesh.skeleton.clone(`${childMesh.skeleton.name}-cloned`);
        clonedSkeleton.bones.forEach(bone => {
          const linkedTransformNode = bone.getTransformNode();
          if (!originUniqueIdToClonedMap[linkedTransformNode.uniqueId]) {
            throw new TypeError(`Could not find the linked transform node(${linkedTransformNode.name}) for bone(${bone.name})`);
          } else {
            const newTransform = originUniqueIdToClonedMap[linkedTransformNode.uniqueId];
            if (newTransform.getClassName() === 'TransformNode') {
              bone.linkTransformNode(newTransform as BABYLON.TransformNode);
            } else {
              throw new TypeError(`The linked transform node(${linkedTransformNode.name}) for bone(${bone.name}) is not a transform node, actual type is "${newTransform.getClassName()}".`);
            }
          }
        });
        childMesh.skeleton = clonedSkeleton;
      }
    });

    /**
     * The Babylonjs won't clone the animation group when the related meshes are cloned.
     * 
     * In this case, we need to clone the animation groups manually, and set the new targets
     * to the cloned meshes and its related animation groups.
     */
    const animationGroups = this.#nativeDocument.getPreloadedAnimationGroups().get(refName);
    if (animationGroups) {
      for (let i = 0; i < animationGroups.length; i++) {
        const animationGroup = animationGroups[i];
        if (animationGroup.targetedAnimations.length <= 0) {
          continue;
        }
        let id = `${i}`;
        if (attributes.id) {
          id = `#${attributes.id}`;
        }
        const newAnimationGroup = animationGroup.clone(
          `${animationGroup.name}/${id}`,
          (oldTarget: BABYLON.Node) => originUniqueIdToClonedMap[oldTarget.uniqueId],
          false
        );

        /**
         * When an animation group is cloned into space, we added the following listeners to mark
         * the animation group as dirty.
         */
        function markDirty(animationGroup: BABYLON.AnimationGroup) {
          /** FIXME(Yorkie): we use the metadata._isDirty as the dirty-update flag for animation group */
          if (!animationGroup.metadata) {
            animationGroup.metadata = {};
          }
          animationGroup.metadata._isDirty = true;
        }
        newAnimationGroup.onAnimationGroupPlayObservable.add(markDirty);
        newAnimationGroup.onAnimationGroupEndObservable.add(markDirty);
        newAnimationGroup.onAnimationGroupPauseObservable.add(markDirty);

        // If the animation group is playing, stop it and start the new one.
        if (animationGroup.isPlaying === true) {
          try {
            newAnimationGroup.start(animationGroup.loopAnimation);
          } catch (err) {
            console.warn(`Failed to start the animation group(${newAnimationGroup.name}): ${err.message}`);
          }
          animationGroup.stop();
        }
      }
    }
    return clonedMesh;
  }

  /**
   * Start watching the input event such as: pointer, guesture, keyboard, etc.
   */
  watchInputEvent() {
    return this.#nativeDocument.observeInputEvent();
  }

  /**
   * Get the node by the id.
   */
  getNodeById(id: string): BABYLON.Node {
    this.#nativeDocument.logger.warn(`The method "getNodeById()" is deprecated, please use "getSpatialObjectById()" instead.`);
    return this.scene.getNodeById(id);
  }

  /**
   * Get the material by the id.
   */
  getMaterialById(id: string): BABYLON.Material {
    return this.scene.getMaterialById(id);
  }

  // https://dom.spec.whatwg.org/#concept-node-adopt
  _adoptNode(_node: Node) {
    throw new DOMException('SpatialDocument do not support adoptNode().', 'NotSupportedError');
  }

  _runPreRemovingSteps(_oldNode: NodeImpl) {
    // https://html.spec.whatwg.org/#focus-fixup-rule
    // if (oldNode === this.activeElement) {
    //   this._lastFocusedElement = null;
    // }
    // for (const activeNodeIterator of this._workingNodeIterators) {
    //   activeNodeIterator._preRemovingSteps(oldNode);
    // }
  }

  _createAttribute({
    localName,
    value,
    namespace,
    namespacePrefix
  }) {
    return new AttrImpl(this._hostObject, [], {
      localName,
      value,
      namespace,
      namespacePrefix,
      ownerDocument: this
    });
  }
}
