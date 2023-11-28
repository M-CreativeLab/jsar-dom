import BABYLON from 'babylonjs';
import nwsapi from 'nwsapi';

import { NativeDocument } from '../../impl-interfaces';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../../symbols';
import { DocumentTypeImpl } from './DocumentType';
import { NodeImpl } from './Node';
import { ElementImpl } from './Element';
import { AttrImpl } from '../attributes/Attr';
import { TextImpl } from './Text';
import { UIEventImpl } from '../events/UIEvent';
import { MouseEventImpl } from '../events/MouseEvent';
import { RangeImpl } from '../range/Range';
import DocumentOrShadowRootImpl from './DocumentOrShadowRoot';
import ParentNodeImpl from './ParentNode';
import { CustomEventImpl } from '../events/CustomEvent';
import ErrorEventImpl from '../events/ErrorEvent';
import FocusEventImpl from '../events/FocusEvent';
import HashChangeEventImpl from '../events/HashChangeEvent';
import KeyboardEventImpl from '../events/KeyboardEvent';
import MessageEventImpl from '../events/MessageEvent';
import PopStateEventImpl from '../events/PopStateEvent';
import ProgressEventImpl from '../events/ProgressEvent';
import TouchEventImpl from '../events/TouchEvent';
import { HTMLElementImpl } from './HTMLElement';
import HTMLHeadElementImpl from './HTMLHeadElement';
import HTMLTitleElementImpl from './HTMLTitleElement';
import HTMLMetaElementImpl from './HTMLMetaElement';
import HTMLSpaceElement from './HTMLSpaceElement';
import HTMLScriptElementImpl from './HTMLScriptElement';
import { NodeListImpl } from './NodeList';
import NodeIteratorImpl from '../traversal/NodeIterator';
import { GlobalEventHandlersImpl } from './GlobalEventHandlers';
import { AsyncResourceQueue, ResourceQueue } from '../../agent/resources/ResourceQueue';
import { SpatialObject } from './SpatialObject';
import { XSMLShadowRoot } from './ShadowRoot';

import { applyMixins } from '../../mixin';
import { applyMemoizeQueryOn } from '../../utils';
import {
  listOfElementsWithClassNames,
  listOfElementsWithNamespaceAndLocalName,
  listOfElementsWithQualifiedName
} from '../node';
import { HTML_NS, SVG_NS } from '../helpers/namespaces';
import { canParseURL } from '../helpers/url';
import IterableWeakSet from '../helpers/iterable-weak-set';
import { domSymbolTree } from '../helpers/internal-constants';
import { firstChildWithLocalName, firstDescendantWithLocalName } from '../helpers/traversal';
import { asciiLowercase, stripAndCollapseASCIIWhitespace } from '../helpers/strings';
import { validateAndExtract, name as validateName } from '../helpers/validate-names';

type DocumentInitOptions = {
  screenWidth?: number;
  screenHeight?: number;
};

const eventInterfaceTable = {
  customevent: CustomEventImpl,
  errorevent: ErrorEventImpl,
  event: Event,
  events: Event,
  focusevent: FocusEventImpl,
  hashchangeevent: HashChangeEventImpl,
  htmlevents: Event,
  keyboardevent: KeyboardEventImpl,
  messageevent: MessageEventImpl,
  mouseevent: MouseEventImpl,
  mouseevents: MouseEventImpl,
  popstateevent: PopStateEventImpl,
  progressevent: ProgressEventImpl,
  svgevents: Event,
  touchevent: TouchEventImpl,
  uievent: UIEventImpl,
  uievents: UIEventImpl,
};

/**
 * The `SpatialDocument` is a new Web API, it represents the document object in space computing.
 * It is the root of the document tree, and provides the primary access to the document's data.
 */
export interface SpatialDocumentImpl extends NodeImpl, DocumentOrShadowRootImpl, GlobalEventHandlersImpl, ParentNodeImpl { };
export class SpatialDocumentImpl extends NodeImpl implements Document {
  #nativeDocument: NativeDocument;
  #screenWidth: number;
  #screenHeight: number;

  doctype: DocumentType;
  domain: string;
  contentType: string;

  get ownerDocument() {
    return null;
  }
  get URL(): string {
    return this._URL.toString();
  }
  get documentURI(): string {
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
  get documentElement(): HTMLElement {
    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NodeImpl.ELEMENT_NODE) {
        return childNode;
      }
    }
    return null;
  }
  get fgColor(): string {
    return '#ffffff';
  }
  get fullscreen(): boolean {
    throw new DOMException('fullscreen is not supported', 'NotSupportedError');
  }
  get fullscreenEnabled(): boolean {
    return false;
  }
  get head(): HTMLHeadElement {
    return this.documentElement ? firstChildWithLocalName(this.documentElement, 'head') : null;
  }
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
    return this.getElementsByTagName('script');
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

  pictureInPictureEnabled: boolean;
  plugins: HTMLCollectionOf<HTMLEmbedElement>;
  readyState: DocumentReadyState;
  referrer: string;
  rootElement: SVGSVGElement;
  scrollingElement: Element;
  timeline: DocumentTimeline;
  vlinkColor: string;

  get title(): string {
    const documentElement = this.documentElement as HTMLElementImpl;
    let value = '';

    if (documentElement && documentElement.localName === 'svg') {
      const svgTitleElement = firstChildWithLocalName(documentElement, 'title', SVG_NS);
      if (svgTitleElement) {
        value = svgTitleElement.textContent;
      }
    } else {
      const titleElement = firstDescendantWithLocalName(this, 'title');
      if (titleElement) {
        value = titleElement.textContent;
      }
    }
    value = stripAndCollapseASCIIWhitespace(value);
    return value;
  }
  set title(value) {
    const documentElement = this.documentElement as HTMLElementImpl;
    let element: ElementImpl;

    if (documentElement && documentElement._localName === 'svg') {
      element = firstChildWithLocalName(documentElement, 'title', SVG_NS);
      if (!element) {
        element = this.createElementNS(SVG_NS, 'title') as unknown as ElementImpl;
        this._insert(element, documentElement.firstChild as unknown as NodeImpl);
      }
      element.textContent = value;
    } else if (documentElement && documentElement._namespaceURI === HTML_NS) {
      const titleElement = firstDescendantWithLocalName(this, 'title');
      const headElement = this.head as HTMLHeadElementImpl;

      if (titleElement === null && headElement === null) {
        return;
      }
      if (titleElement !== null) {
        element = titleElement;
      } else {
        element = this.createElement('title') as unknown as ElementImpl;
        headElement._append(element);
      }
      element.textContent = value;
    }
  }

  onfullscreenchange: (this: Document, ev: Event) => any;
  onfullscreenerror: (this: Document, ev: Event) => any;
  onpointerlockchange: (this: Document, ev: Event) => any;
  onpointerlockerror: (this: Document, ev: Event) => any;
  onreadystatechange: (this: Document, ev: Event) => any;
  onvisibilitychange: (this: Document, ev: Event) => any;

  _xsmlVersion: string;
  _ids = Object.create(null);
  _parsingMode: string = 'xsml';
  _scriptingDisabled: boolean = false;
  _encoding: string;
  _URL: URL;
  _defaultView: Window & typeof globalThis;
  _workingNodeIterators: IterableWeakSet<NodeIteratorImpl>;
  _asyncQueue = new AsyncResourceQueue();
  _queue = new ResourceQueue({ paused: false, asyncQueue: this._asyncQueue });
  _deferQueue = new ResourceQueue({ paused: true });

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
        xsmlVersion: string;
        defaultView: Window & typeof globalThis;
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
    this.nodeType = NodeImpl.DOCUMENT_NODE;
    this.domain = '';
    this.contentType = privateData.options.contentType || 'application/xsml';

    this._ownerDocument = this;
    this._attached = true;
    this._scriptingDisabled = privateData.options.scriptingDisabled;
    this._encoding = privateData.options.encoding || 'UTF-8';

    const urlOption = privateData.options.url === undefined ? 'about:blank' : privateData.options.url;
    if (canParseURL(urlOption) == null) {
      throw new TypeError(`Could not parse ${urlOption} as a URL.`);
    }
    this._URL = new URL(urlOption);
    this._workingNodeIterators = new IterableWeakSet();

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
    validateName(localName);
    if (this._parsingMode === 'html') {
      localName = asciiLowercase(localName);
    }
    return this._createAttribute({ localName });
  }

  createAttributeNS(namespace: string, qualifiedName: string): Attr {
    if (namespace === undefined) {
      namespace = null;
    }
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, qualifiedName);
    return this._createAttribute({
      namespace: extracted.namespace,
      namespacePrefix: extracted.prefix,
      localName: extracted.localName
    });
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
    const nodeIterator = new NodeIteratorImpl(this._hostObject, [], {
      root: root as unknown as NodeImpl,
      whatToShow,
      filter,
    });
    this._workingNodeIterators.add(nodeIterator);
    return nodeIterator;
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
    if (!this._ids[elementId]) {
      return null;
    }

    // Let's find the first element with where it's root is the document.
    const matchElement = this._ids[elementId].find(candidate => {
      let root = candidate;
      while (domSymbolTree.parent(root)) {
        root = domSymbolTree.parent(root);
      }
      return root === this;
    });
    return matchElement || null;
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    return listOfElementsWithClassNames(classNames, this);
  }

  getElementsByName(elementName: string): NodeListOf<HTMLElement> {
    return new NodeListImpl(this._hostObject, [], {
      element: this,
      query: () => domSymbolTree.treeToArray(this, {
        filter: node => node.getAttributeNS && node.getAttributeNS(null, 'name') === elementName,
      }),
    });
  }

  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element> {
    return listOfElementsWithQualifiedName(qualifiedName, this);
  }

  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1999/xhtml', localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/2000/svg', localName: string): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', localName: string): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element> {
    return listOfElementsWithNamespaceAndLocalName(namespace, localName, this);
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
  createElement(tagName: 'head'): HTMLTitleElement;
  createElement(tagName: 'title'): HTMLTitleElement;
  createElement(tagName: 'meta'): HTMLMetaElement;
  createElement(tagName: 'script'): HTMLScriptElementImpl;
  // createElement(tagName: 'space'): HTMLSpaceElement;
  createElement(tagName: 'div'): HTMLDivElement;
  createElement(tagName: 'span'): HTMLSpanElement;
  createElement(tagName: 'a'): HTMLAnchorElement;
  createElement(tagName: 'img'): HTMLImageElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: string): HTMLElement {
    if (tagName === 'head') {
      return new HTMLHeadElementImpl(this.#nativeDocument, []);
    } else if (tagName === 'title') {
      return new HTMLTitleElementImpl(this.#nativeDocument, []);
    } else if (tagName === 'meta') {
      return new HTMLMetaElementImpl(this.#nativeDocument, []);
    } else if (tagName === 'script') {
      return new HTMLScriptElementImpl(this.#nativeDocument, []);
    } else if (tagName === 'space') {
      return new HTMLSpaceElement(this.#nativeDocument, []);
    } else {
      return new HTMLElementImpl(this.#nativeDocument, [], {
        localName: tagName,
      });
    }
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

  /**
   * Wrap and execute a function with time profiling.
   * 
   * @internal
   * @param tag the log tag
   * @param fn the function to be executed, it accepts an async function or blocking function.
   */
  async _executeWithTimeProfiler<T>(tag: string, fn: (...args: any[]) => Promise<T> | T): Promise<T> {
    const startTime = performance.now();

    let r: T;
    const valueFuture = fn();
    if (valueFuture instanceof Promise) {
      r = await valueFuture;
    } else {
      r = valueFuture;
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const message = `${tag} takes ${Math.floor(executionTime)}ms`;

    this.#nativeDocument.console.debug(message);
    return r;
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
   * 
   * @deprecated
   */
  getNodeById(id: string): BABYLON.Node {
    this.#nativeDocument.console.warn(`The method "getNodeById()" is deprecated, please use "getSpatialObjectById()" instead.`);
    return this.scene.getNodeById(id);
  }

  /**
   * Get the material by the id.
   */
  getMaterialById(id: string): BABYLON.Material {
    return this.scene.getMaterialById(id);
  }

  /**
   * Start the document, it executes the scripts.
   */
  _start(noQueue = false) {
    // In no queue mode, the document will not execute the scripts.
    if (noQueue) {
      this.readyState = 'complete';
      this.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      this.dispatchEvent(new Event('load'));
      return;
    }

    // Resume the queue
    this._queue.resume();

    // Handle the defer and async queue
    const ownerDocument = this;
    const dummyPromise = Promise.resolve();
    this._queue.push(dummyPromise, function onDOMContentLoaded(): Promise<void> {
      const dispatchEvent = () => {
        // https://html.spec.whatwg.org/#the-end
        ownerDocument.readyState = 'interactive';
        ownerDocument.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      };
      return new Promise<void>(resolve => {
        if (!ownerDocument._deferQueue.tail) {
          dispatchEvent();
          resolve();
        } else {
          ownerDocument._deferQueue.setListener(() => {
            dispatchEvent();
            resolve();
          });
          ownerDocument._deferQueue.resume();
        }
      });
    }, null);

    // Set the readyState to 'complete' once all resources are loaded.
    // As a side-effect the document's load-event will be dispatched.
    this._queue.push(dummyPromise, function onLoad(): Promise<void> {
      const dispatchEvent = () => {
        ownerDocument.readyState = 'complete';
        ownerDocument.dispatchEvent(new Event('load'));
      };
      return new Promise<void>(resolve => {
        if (ownerDocument._asyncQueue.count() === 0) {
          dispatchEvent();
          resolve();
        } else {
          this._asyncQueue.setListener(() => {
            dispatchEvent();
            resolve();
          });
        }
      });
    }, null, true);
  }

  // https://dom.spec.whatwg.org/#concept-node-adopt
  _adoptNode(node: Node) {
    const parent = domSymbolTree.parent(node);
    if (parent) {
      parent._remove(node);
    }
  }

  _runPreRemovingSteps(oldNode: NodeImpl) {
    // https://html.spec.whatwg.org/#focus-fixup-rule
    if (oldNode === this.activeElement) {
      this._lastFocusedElement = null;
    }
    for (const activeNodeIterator of this._workingNodeIterators) {
      activeNodeIterator._preRemovingSteps(oldNode);
    }
  }

  _createAttribute(privateData: ConstructorParameters<typeof AttrImpl>[2]) {
    return new AttrImpl(this._hostObject, [], privateData);
  }
}

applyMixins(SpatialDocumentImpl, [DocumentOrShadowRootImpl, GlobalEventHandlersImpl, ParentNodeImpl]);
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByTagName');
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByTagNameNS');
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByClassName');
