import DOMException from '../domexception';
import { applyMixins } from '../../mixin';

import type { NativeDocument } from '../../impl-interfaces';
import type { SpatialDocumentImpl } from './SpatialDocument';
import type { AttrImpl } from '../attributes/Attr';
import { NodeImpl } from './Node';
import DOMRectImpl from '../geometry/DOMRect';
import ParentNodeImpl from './ParentNode';
import ChildNodeImpl from './ChildNode';
import NonDocumentTypeChildNodeImpl from './NonDocumentTypeChildNode';
import type { CustomElementDefinition } from '../custom-elements/CustomElementRegistry';
import DOMTokenListImpl from './DOMTokenList';

import { HTML_NS } from '../helpers/namespaces';
import { addNwsapi } from '../helpers/selectors';
import {
  listOfElementsWithClassNames,
  listOfElementsWithNamespaceAndLocalName,
  listOfElementsWithQualifiedName
} from '../node';
import {
  attributeNames,
  setAttribute,
  setAttributeValue,
  appendAttribute,
  changeAttribute,
  getAttributeByName,
  getAttributeByNameNS,
  hasAttribute,
  hasAttributeByName,
  hasAttributeByNameNS,
  removeAttribute,
  removeAttributeByName,
  removeAttributeByNameNS
} from '../attributes';
import NamedNodeMapImpl from '../attributes/NamedNodeMap';
import { applyMemoizeQueryOn } from '../../utils';
import * as namedPropertiesWindow from '../named-properties-window';
import * as validateNames from '../helpers/validate-names';
import { asciiLowercase, asciiUppercase } from '../helpers/strings';

/**
 * Attaches an ID to an element in the document.
 * @param id - The ID to attach.
 * @param elm - The element to attach the ID to.
 * @param doc - The document to which the element belongs.
 */
function attachId(id: string, elm: Element, doc: SpatialDocumentImpl) {
  if (id && elm && doc) {
    if (!doc._ids[id]) {
      doc._ids[id] = [];
    }
    doc._ids[id].push(elm);
  }
}

/**
 * Detaches an element with the specified ID from the document.
 * 
 * @param id - The ID of the element to detach.
 * @param elm - The element to detach.
 * @param doc - The document from which to detach the element.
 */
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

/**
 * Represents an implementation of the Element interface.
 * Inherits from NodeImpl, NonDocumentTypeChildNodeImpl, ParentNodeImpl, and ChildNodeImpl.
 */
export interface ElementImpl extends NodeImpl, NonDocumentTypeChildNodeImpl, ParentNodeImpl, ChildNodeImpl { };
export class ElementImpl extends NodeImpl implements Element {
  attributes: NamedNodeMap;
  clientHeight: number;
  clientLeft: number;
  clientTop: number;
  clientWidth: number;
  onfullscreenchange: (this: Element, ev: Event) => any;
  onfullscreenerror: (this: Element, ev: Event) => any;
  outerHTML: string;
  part: DOMTokenList;
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
  _ceState: string;
  _ceDefinition: CustomElementDefinition;
  _ceReactionQueue: any[];
  _isValue: boolean;
  _classList: DOMTokenListImpl;
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
      ceDefinition?: CustomElementDefinition;
      isValue?: boolean;
    }
  ) {
    super(hostObject, args, privateData);

    this._namespaceURI = privateData.namespace || HTML_NS;
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

  get ownerDocument(): Document {
    return this._ownerDocument;
  }

  get prefix() {
    return this._prefix;
  }

  get localName(): string {
    return this._localName;
  }

  get namespaceURI(): string | null {
    return this._namespaceURI;
  }

  get id(): string {
    return this.getAttribute('id');
  }

  get className(): string {
    return this.getAttribute('class') || '';
  }

  set className(value: string) {
    this.setAttribute('class', value);
  }

  get classList() {
    if (this._classList === undefined) {
      this._classList = new DOMTokenListImpl(this._hostObject, [], {
        element: this,
        attributeLocalName: 'class'
      });
    }
    return this._classList;
  }

  get _qualifiedName() {
    return this._prefix ? this._prefix + ':' + this._localName : this._localName;
  }

  get tagName() {
    // This getter can be a hotpath in getComputedStyle.
    // All these are invariants during the instance lifetime so we can safely cache the computed tagName.
    // We could create it during construction but since we already identified this as potentially slow we do it lazily.
    if (this._cachedTagName == null) {
      this._cachedTagName = asciiUppercase(this._qualifiedName);
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

  _attrModified(name: string, value: string, oldValue: string) {
    this._modified();
    namedPropertiesWindow.elementAttributeModified(this, name, value, oldValue);

    if (name === 'id' && this._attached) {
      const doc = this._ownerDocument;
      detachId(oldValue, this, doc);
      attachId(value, this, doc);
    }

    // update classList
    if (name === 'class' && this._classList !== undefined) {
      this._classList._attrModified()
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
    const attr = getAttributeByName(this, qualifiedName);
    if (!attr) {
      return null;
    }
    return attr.value;
  }

  getAttributeNS(namespace: string, localName: string): string {
    const attr = getAttributeByNameNS(this, namespace, localName);
    if (!attr) {
      return null;
    }
    return attr.value;
  }

  getAttributeNames(): string[] {
    return attributeNames(this);
  }

  getAttributeNode(qualifiedName: string): Attr {
    return getAttributeByName(this, qualifiedName);
  }

  getAttributeNodeNS(namespace: string, localName: string): Attr {
    return getAttributeByNameNS(this, namespace, localName);
  }

  getBoundingClientRect(): DOMRect {
    return new DOMRectImpl();
  }

  getClientRects(): DOMRectList {
    throw new Error('Method not implemented.');
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    return listOfElementsWithClassNames(classNames, this);
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
    const matcher = addNwsapi(this);
    return matcher.match(selectors, this);
  }

  releasePointerCapture(pointerId: number): void {
    throw new Error('Method not implemented.');
  }

  removeAttribute(qualifiedName: string): void {
    removeAttributeByName(this, qualifiedName);
  }

  removeAttributeNS(namespace: string, localName: string): void {
    removeAttributeByNameNS(this, namespace, localName);
  }

  removeAttributeNode(attr: Attr): Attr {
    if (!hasAttribute(this, attr as AttrImpl)) {
      throw new DOMException(
        'Tried to remove an attribute that was not present',
        'NOT_FOUND_ERR'
      );
    }
    removeAttribute(this, attr as AttrImpl);
    return attr;
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
    validateNames.name(qualifiedName);
    if (this._namespaceURI === HTML_NS && this._ownerDocument._parsingMode === 'html') {
      qualifiedName = asciiLowercase(qualifiedName);
    }
    const attribute = getAttributeByName(this, qualifiedName);
    if (attribute === null) {
      const newAttr = this._ownerDocument._createAttribute({
        localName: qualifiedName,
        value
      });
      appendAttribute(this, newAttr);
      return;
    }
    changeAttribute(this, attribute, value);
  }

  setAttributeNS(namespace: string, qualifiedName: string, value: string): void {
    const extracted = validateNames.validateAndExtract(namespace, qualifiedName);

    // Because of widespread use of this method internally, e.g. to manually implement attribute/content reflection, we
    // centralize the conversion to a string here, so that all call sites don't have to do it.
    value = `${value}`;
    setAttributeValue(this, extracted.localName, value, extracted.prefix, extracted.namespace);
  }

  setAttributeNode(attr: Attr): Attr {
    return setAttribute(this, attr as AttrImpl);
  }

  setAttributeNodeNS(attr: Attr): Attr {
    return setAttribute(this, attr as AttrImpl);
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

applyMixins(ElementImpl, [ParentNodeImpl, ChildNodeImpl, NonDocumentTypeChildNodeImpl]);
applyMemoizeQueryOn(ElementImpl.prototype, 'getElementsByTagName');
applyMemoizeQueryOn(ElementImpl.prototype, 'getElementsByTagNameNS');
applyMemoizeQueryOn(ElementImpl.prototype, 'getElementsByClassName');
