import { Tags } from 'babylonjs';
import { CreateXSMLType, XSMLBaseDocument } from '../../xsml-interfaces';
import { AttrImpl } from '../attributes/attr';
import { NodeImpl } from './node';

export class ElementImpl extends NodeImpl implements CreateXSMLType<Element> {
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
  shadowRoot: ShadowRoot;
  slot: string;
  tagName: string;

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
  nextElementSibling: Element;
  previousElementSibling: Element;
  assignedSlot: HTMLSlotElement;

  _version: number;
  _attributeList: AttrImpl[];
  _namespaceURI: string | null;
  _prefix: string | null;
  _localName: string;
  _ceState: string | null;
  _ceDefinition: string | null;
  _isValue: boolean;
  _ownerDocument: XSMLBaseDocument;
  _attributesByNameMap: Map<string, AttrImpl[]> = new Map();

  constructor(
    hostObject,
    _args,
    privateData: {
      namespace?: string;
      prefix?: string;
      localName: string;
      ceState?: string;
      ceDefinition?: string;
      isValue?: boolean;
    }
  ) {
    super(hostObject, [], null);

    this._namespaceURI = privateData.namespace;
    this._prefix = privateData.prefix;
    this._localName = privateData.localName;
    this._ceState = privateData.ceState;
    this._ceDefinition = privateData.ceDefinition;
    this._isValue = privateData.isValue;
    this._shadowRoot = null;
    this._attributeList = [];
  
    this.nodeType = this.ELEMENT_NODE;
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  get ownerDocument(): XSMLBaseDocument {
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
  hasAttributeNS(namespace: string, localName: string): boolean {
    throw new Error('Method not implemented.');
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
  after(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  before(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  remove(): void {
    throw new Error('Method not implemented.');
  }
  replaceWith(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
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
  querySelector(selectors: unknown): unknown {
    throw new Error('Method not implemented.');
  }
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll(selectors: unknown): unknown {
    throw new Error('Method not implemented.');
  }
  replaceChildren(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
}
