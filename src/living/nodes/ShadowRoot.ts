import * as BABYLON from 'babylonjs';
import nwsapi from 'nwsapi';
import DOMException from 'domexception';

import { SpatialObject } from './SpatialObject';
import { NodeImpl } from './Node';
import { DocumentTypeImpl } from './DocumentType';
import { NativeDocument } from '../../impl-interfaces';

export class XSMLShadowRoot extends NodeImpl implements ShadowRoot {
  doctype: DocumentType;
  documentURI: string;
  domain: string;
  charset: string;
  contentType: string;

  /** @internal */
  _targetSpatialObject: SpatialObject;
  /** @internal */
  _interactiveDynamicTexture: InteractiveDynamicTexture;
  /** @internal */
  _nwsapi: nwsapi.NWSAPI;

  /**
   * Store all children of this shadow root.
   */
  private _allChildren: Element[] = [];

  constructor(
    hostObject: NativeDocument,
    args: [ShadowRootInit?],
    privateData: {
      target: SpatialObject;
    }
  ) {
    super(hostObject, [], null);

    this.doctype = new DocumentTypeImpl(hostObject, [], {
      name: 'html',
      publicId: '-//W3C//DTD HTML 1.0//EN',
      systemId: 'http://www.w3.org/TR/html',
    }) as unknown as DocumentType;
    this.contentType = 'text/html';
    this.nodeType = NodeImpl.prototype.DOCUMENT_NODE;

    this._targetSpatialObject = privateData.target;
    this._interactiveDynamicTexture = this._hostObject.attachShadow(
      this._targetSpatialObject.asNativeType<BABYLON.AbstractMesh>(),
      args ? args[0] : null
    );
    this._nwsapi = nwsapi({
      document: this._targetSpatialObject.ownerDocument,
      DOMException,
    } as any);
    this._nwsapi.configure({
      IDS_DUPES: false,
    });
  }
  activeElement: Element;

  getNativeTexture(): InteractiveDynamicTexture {
    return this._interactiveDynamicTexture;
  }

  getAnimations(): Animation[] {
    throw new Error('Method not implemented.');
  }

  innerHTML: string;

  get childElementCount(): number {
    return this._allChildren.length;
  }

  get firstElementChild(): Element {
    return this._allChildren[0] as Element;
  }

  get lastElementChild(): Element {
    return this._allChildren[this._allChildren.length - 1] as Element;
  }

  append(...nodes: (string | Node)[]): void {
    throw new Error('append() not implemented.');
  }

  prepend(...nodes: (string | Node)[]): void {
    throw new Error('prepend() not implemented.');
  }

  appendChild<T extends Node>(node: T): T {
    if (!(node instanceof Control2D)) {
      throw new DOMException('Could not append non-control node to shadow root.', 'InvalidStateError');
    }
    this._interactiveDynamicTexture.rootContainer.appendChild(node);
    this._interactiveDynamicTexture.start();
    this._allChildren.push(node);
    return node;
  }

  removeChild<T extends Node>(child: T): T {
    if (!(child instanceof Control2D)) {
      throw new DOMException('Could not remove non-control node to shadow root.', 'InvalidStateError');
    }
    this._interactiveDynamicTexture.rootContainer.removeChild(child);
    this._allChildren.splice(this._allChildren.indexOf(child), 1);
    return child;
  }

  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K];
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K];
  querySelector<E extends Element = Element>(selectors: string): E;
  querySelector(selectors: unknown): unknown {
    if (typeof selectors !== 'string') {
      throw new DOMException('Invalid selector type.', 'SyntaxError')
    }
    return this._nwsapi.first(selectors);
  }
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll(selectors: unknown): unknown {
    if (typeof selectors !== 'string') {
      throw new DOMException('Invalid selector type.', 'SyntaxError')
    }
    return this._nwsapi.select(selectors, this as unknown as ShadowRoot);
  }
  replaceChildren(...nodes: (string | Node)[]): void {
    throw new Error('replaceChildren() not implemented.');
  }
  delegatesFocus: boolean;
  host: Element;
  mode: ShadowRootMode;
  onslotchange: (this: ShadowRoot, ev: Event) => any;
  slotAssignment: SlotAssignmentMode;

  /**
   * Get elements by its id.
   */
  getElementById(elementId: string): HTMLElement {
    return this._allChildren.find((child) => child.id === elementId) as HTMLElement;
  }

  /**
   * Get elements by class name
   */
  getElementsByClassName(elementClassName: string): Element[] {
    const all = this.getAllElements(this._allChildren);
    console.log(`get all`, all);
    return all.filter(childElement => {
      return BABYLON.Tags.MatchesQuery(childElement, elementClassName);
    });
  }

  /**
   * This method is used to get all elements from the this._allChildren, including the element's children recursively.
   */
  private getAllElements(list: Node[]) {
    const allElements: Element[] = [];
    /**
     * TODO(Yorkie): will implement HTMLCollection & ParentNode later to make it more efficient.
     */
    for (let child of list) {
      allElements.push(child as any);
      if (child.childNodes.length > 0) {
        allElements.push(...this.getAllElements(child.childNodes as any));
      }
    }
    return allElements;
  }

  adoptedStyleSheets: CSSStyleSheet[];
  fullscreenElement: Element;
  pictureInPictureElement: Element;
  pointerLockElement: Element;
  styleSheets: StyleSheetList;
  elementFromPoint(x: number, y: number): Element {
    throw new Error('Method not implemented.');
  }
  elementsFromPoint(x: number, y: number): Element[] {
    throw new Error('Method not implemented.');
  }
  _lastFocusedElement: Element;
  _adoptNode(node: Node): Node {
    throw new Error('Method not implemented.');
  }
}
