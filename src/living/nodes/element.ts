import { Tags } from 'babylonjs';
import { AttrImpl } from '../attributes/Attr';
import { NodeImpl } from './Node';
import { SpatialDocumentImpl } from './SpatialDocument';
import { NativeDocument } from '../../impl-interfaces';
import NamedNodeMapImpl from '../attributes/NamedNodeMap';
import { HTML_NS } from '../helpers/namespaces';
import { asciiLowercase, asciiUppercase } from '../helpers/strings';
import { hasAttributeByName, hasAttributeByNameNS } from '../attributes';
import DOMRectImpl from '../geometry/DOMRect';
import { Mixin } from 'ts-mixer';
import ParentNodeImpl from './ParentNode';
import ChildNodeImpl from './ChildNode';
import NonDocumentTypeChildNodeImpl from './NonDocumentTypeChildNode';

function attachId(id: string, elm: Element, doc: SpatialDocumentImpl) {
  if (id && elm && doc) {
    if (!doc._ids[id]) {
      doc._ids[id] = [];
    }
    doc._ids[id].push(elm);
  }
}

function detachId(id: string, elm: Element, doc: SpatialDocumentImpl) {
  if (id && elm && doc) {
    if (doc._ids && doc._ids[id]) {
      const elms = doc._ids[id];
      for (let i = 0; i < elms.length; i++) {
        if (elms[i] === elm) {
          elms.splice(i, 1);
          --i;
        }
      }
      if (elms.length === 0) {
        delete doc._ids[id];
      }
    }
  }
}

export class ElementImpl extends Mixin(NodeImpl, NonDocumentTypeChildNodeImpl, ParentNodeImpl, ChildNodeImpl) implements Element {
  attributes: NamedNodeMap;
  clientHeight: number;
  clientLeft: number;
  clientTop: number;
  clientWidth: number;
  id: string;
  localName: string;
  namespaceURI: string;
  onfullscreenchange: (this: Element, ev: Event) => any;
  onfullscreenerror: (this: Element, ev: Event) => any;
  outerHTML: string;
  part: DOMTokenList;
  prefix: string;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  get shadowRoot(): ShadowRoot {
    const shadow = this._shadowRoot;
    if (shadow === null || shadow.mode === 'closed') {
      return null;
    }
    return shadow;
  }
  slot: string;

  ariaAtomic: string;
  ariaAutoComplete: string;
  ariaBusy: string;
  ariaChecked: string;
  ariaColCount: string;
  ariaColIndex: string;
  ariaColSpan: string;
  ariaCurrent: string;
  ariaDisabled: string;
  ariaExpanded: string;
  ariaHasPopup: string;
  ariaHidden: string;
  ariaInvalid: string;
  ariaKeyShortcuts: string;
  ariaLabel: string;
  ariaLevel: string;
  ariaLive: string;
  ariaModal: string;
  ariaMultiLine: string;
  ariaMultiSelectable: string;
  ariaOrientation: string;
  ariaPlaceholder: string;
  ariaPosInSet: string;
  ariaPressed: string;
  ariaReadOnly: string;
  ariaRequired: string;
  ariaRoleDescription: string;
  ariaRowCount: string;
  ariaRowIndex: string;
  ariaRowSpan: string;
  ariaSelected: string;
  ariaSetSize: string;
  ariaSort: string;
  ariaValueMax: string;
  ariaValueMin: string;
  ariaValueNow: string;
  ariaValueText: string;
  role: string;

  innerHTML: string;
  assignedSlot: HTMLSlotElement;

  _version: number;
  _attributes: NamedNodeMapImpl;
  _attributeList: AttrImpl[];
  _namespaceURI: string | null;
  _prefix: string | null;
  _localName: string;
  _ceState: string | null;
  _ceDefinition: string | null;
  _isValue: boolean;
  _ownerDocument: SpatialDocumentImpl;
  _attributesByNameMap: Map<string, AttrImpl[]> = new Map();
  _cachedTagName: string | null;

  constructor(
    hostObject: NativeDocument,
    args,
    privateData: {
      namespace?: string;
      prefix?: string;
      localName: string;
      ceState?: string;
      ceDefinition?: string;
      isValue?: boolean;
    }
  ) {
    super(hostObject, args, null);

    this._namespaceURI = privateData.namespace;
    this._prefix = privateData.prefix;
    this._localName = privateData.localName;
    this._ceState = privateData.ceState;
    this._ceDefinition = privateData.ceDefinition;
    this._isValue = privateData.isValue;
    this._shadowRoot = null;
    this._attributeList = [];
    this._attributes = new NamedNodeMapImpl(this._hostObject, [], {
      element: this,
    });

    this.nodeType = this.ELEMENT_NODE;
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  get ownerDocument(): SpatialDocumentImpl {
    return this._ownerDocument;
  }

  get className(): string {
    return Tags.GetTags(this, true);
  }

  set className(value: string) {
    Tags.AddTagsTo(this, value);
  }

  get classList() {
    return Tags.GetTags(this, false);
  }

  get _qualifiedName() {
    return this._prefix !== null ? this._prefix + ':' + this._localName : this._localName;
  }

  get tagName() {
    // This getter can be a hotpath in getComputedStyle.
    // All these are invariants during the instance lifetime so we can safely cache the computed tagName.
    // We could create it during construction but since we already identified this as potentially slow we do it lazily.
    if (this._cachedTagName === null) {
      if (this.namespaceURI === HTML_NS && this._ownerDocument._parsingMode === 'html') {
        this._cachedTagName = asciiUppercase(this._qualifiedName);
      } else {
        this._cachedTagName = this._qualifiedName;
      }
    }
    return this._cachedTagName;
  }

  _attach() {
    const id = this.getAttributeNS(null, 'id');
    if (id) {
      attachId(id, this, this._ownerDocument);
    }

    // If the element is initially in an HTML document but is later
    // inserted in another type of document, the tagName should no
    // longer be uppercase. Therefore the cached tagName is reset.
    this._cachedTagName = null;
    super._attach();
  }

  _detach(): void {
    super._detach();

    const id = this.getAttributeNS(null, "id");
    if (id) {
      detachId(id, this, this._ownerDocument);
    }
  }

  attachShadow(init: ShadowRootInit): ShadowRoot {
    throw new Error('Method not implemented.');
  }
  checkVisibility(options?: CheckVisibilityOptions): boolean {
    throw new Error('Method not implemented.');
  }
  closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K];
  closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K];
  closest<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K];
  closest<E extends Element = Element>(selectors: string): E;
  closest(selectors: unknown): unknown {
    throw new Error('Method not implemented.');
  }
  computedStyleMap(): StylePropertyMapReadOnly {
    throw new Error('Method not implemented.');
  }
  getAttribute(qualifiedName: string): string {
    throw new Error('Method not implemented.');
  }
  getAttributeNS(namespace: string, localName: string): string {
    throw new Error('Method not implemented.');
  }
  getAttributeNames(): string[] {
    throw new Error('Method not implemented.');
  }
  getAttributeNode(qualifiedName: string): Attr {
    throw new Error('Method not implemented.');
  }
  getAttributeNodeNS(namespace: string, localName: string): Attr {
    throw new Error('Method not implemented.');
  }
  getBoundingClientRect(): DOMRect {
    return new DOMRectImpl();
  }
  getClientRects(): DOMRectList {
    throw new Error('Method not implemented.');
  }
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    throw new Error('Method not implemented.');
  }
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(qualifiedName: unknown): unknown {
    throw new Error('Method not implemented.');
  }
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1999/xhtml', localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/2000/svg', localName: string): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', localName: string): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespace: unknown, localName: unknown): HTMLCollectionOf<Element> | HTMLCollectionOf<HTMLElement> | HTMLCollectionOf<SVGElement> | HTMLCollectionOf<MathMLElement> {
    throw new Error('Method not implemented.');
  }
  hasAttribute(qualifiedName: string): boolean {
    if (this._namespaceURI === HTML_NS && this._ownerDocument._parsingMode === "html") {
      qualifiedName = asciiLowercase(qualifiedName);
    }
    return hasAttributeByName(this, qualifiedName);
  }
  hasAttributeNS(namespace: string, localName: string): boolean {
    if (namespace === '') {
      namespace = null;
    }
    return hasAttributeByNameNS(this, namespace, localName);
  }
  hasAttributes(): boolean {
    throw new Error('Method not implemented.');
  }
  hasPointerCapture(pointerId: number): boolean {
    throw new Error('Method not implemented.');
  }
  insertAdjacentElement(where: InsertPosition, element: Element): Element {
    throw new Error('Method not implemented.');
  }
  insertAdjacentHTML(position: InsertPosition, text: string): void {
    throw new Error('Method not implemented.');
  }
  insertAdjacentText(where: InsertPosition, data: string): void {
    throw new Error('Method not implemented.');
  }
  matches(selectors: string): boolean {
    throw new Error('Method not implemented.');
  }
  releasePointerCapture(pointerId: number): void {
    throw new Error('Method not implemented.');
  }
  removeAttribute(qualifiedName: string): void {
    throw new Error('Method not implemented.');
  }
  removeAttributeNS(namespace: string, localName: string): void {
    throw new Error('Method not implemented.');
  }
  removeAttributeNode(attr: Attr): Attr {
    throw new Error('Method not implemented.');
  }
  requestFullscreen(options?: FullscreenOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  requestPointerLock(): void {
    throw new Error('Method not implemented.');
  }
  scroll(options?: ScrollToOptions): void;
  scroll(x: number, y: number): void;
  scroll(x?: unknown, y?: unknown): void {
    throw new Error('Method not implemented.');
  }
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollBy(x?: unknown, y?: unknown): void {
    throw new Error('Method not implemented.');
  }
  scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void {
    throw new Error('Method not implemented.');
  }
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  scrollTo(x?: unknown, y?: unknown): void {
    throw new Error('Method not implemented.');
  }
  setAttribute(qualifiedName: string, value: string): void {
    throw new Error('Method not implemented.');
  }
  setAttributeNS(namespace: string, qualifiedName: string, value: string): void {
    throw new Error('Method not implemented.');
  }
  setAttributeNode(attr: Attr): Attr {
    throw new Error('Method not implemented.');
  }
  setAttributeNodeNS(attr: Attr): Attr {
    throw new Error('Method not implemented.');
  }
  setPointerCapture(pointerId: number): void {
    throw new Error('Method not implemented.');
  }
  toggleAttribute(qualifiedName: string, force?: boolean): boolean {
    throw new Error('Method not implemented.');
  }
  webkitMatchesSelector(selectors: string): boolean {
    throw new Error('Method not implemented.');
  }

  animate(keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions): Animation {
    throw new Error('Method not implemented.');
  }
  getAnimations(options?: GetAnimationsOptions): Animation[] {
    throw new Error('Method not implemented.');
  }
}
