import * as BABYLON from 'babylonjs';
import DOMException from 'domexception';

import { NativeDocument } from '../../impl-interfaces';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';

import { SpatialObject } from './SpatialObject';
import { NodeImpl } from './Node';
import DocumentFragmentImpl from './DocumentFragment';
import { HTMLElementImpl } from './HTMLElement';
import { applyMixins } from '../../mixin';

export interface XSMLShadowRoot extends NodeImpl, DocumentFragmentImpl { };
export class XSMLShadowRoot extends NodeImpl implements ShadowRoot {
  delegatesFocus: boolean;
  host: Element;
  mode: ShadowRootMode;
  onslotchange: (this: ShadowRoot, ev: Event) => any;
  slotAssignment: SlotAssignmentMode;

  adoptedStyleSheets: CSSStyleSheet[];
  activeElement: Element;
  fullscreenElement: Element;
  pictureInPictureElement: Element;
  pointerLockElement: Element;
  styleSheets: StyleSheetList;
  innerHTML: string;

  /** @internal */
  _lastFocusedElement: Element;
  /** @internal */
  _targetSpatialObject: SpatialObject;
  /** @internal */
  _interactiveDynamicTexture: InteractiveDynamicTexture;

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

    this.nodeType = NodeImpl.prototype.DOCUMENT_NODE;

    this._targetSpatialObject = privateData.target;
    this._interactiveDynamicTexture = InteractiveDynamicTexture.CreateForMesh(
      this._hostObject,
      this._targetSpatialObject.asNativeType<BABYLON.AbstractMesh>());
  }

  getNativeTexture(): InteractiveDynamicTexture {
    return this._interactiveDynamicTexture;
  }

  getAnimations(): Animation[] {
    throw new Error('Method not implemented.');
  }

  append(...nodes: (string | Node)[]): void {
    super.append(...nodes);
  }

  prepend(...nodes: (string | Node)[]): void {
    super.append(...nodes);
  }

  appendChild<T extends Node>(node: T): T {
    if (!(node instanceof HTMLElementImpl)) {
      throw new DOMException('Could not append non-control node to shadow root.', 'InvalidStateError');
    }
    this._interactiveDynamicTexture.rootContainer.appendChild(node);
    this._interactiveDynamicTexture.start();
    this._allChildren.push(node);
    return node;
  }

  removeChild<T extends Node>(child: T): T {
    if (!(child instanceof HTMLElementImpl)) {
      throw new DOMException('Could not remove non-control node to shadow root.', 'InvalidStateError');
    }
    this._interactiveDynamicTexture.rootContainer.removeChild(child);
    this._allChildren.splice(this._allChildren.indexOf(child), 1);
    return child;
  }

  elementFromPoint(x: number, y: number): Element {
    throw new Error('Method not implemented.');
  }

  elementsFromPoint(x: number, y: number): Element[] {
    throw new Error('Method not implemented.');
  }

  _adoptNode(node: Node): Node {
    throw new Error('Method not implemented.');
  }
}

applyMixins(XSMLShadowRoot, [DocumentFragmentImpl]);
