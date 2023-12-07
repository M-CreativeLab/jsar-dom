import {
  Node as LayoutNode,
  Display as CSSDisplay,
  Position as CSSPosition,
  FlexDirection as CSSFlexDirection,
  FlexWrap as CSSFlexWrap,
  JustifyContent as CSSJustifyContent,
  AlignItems as CSSAlignItems,
  AlignContent as CSSAlignContent,
} from '@bindings/taffy';
import { applyMixins } from '../../mixin';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';
import { HTMLElementImpl } from './HTMLElement';
import { SpatialDocumentImpl } from './SpatialDocument';
import { NativeDocument } from '../../impl-interfaces';
import { isHTMLContentElement } from '../node-type';

export class Content2D {
  protected _targetTexture: InteractiveDynamicTexture;

  /**
   * The layout node to be used for the HTML layout.
   * 
   * @internal
   */
  _layoutNode: LayoutNode;

  /**
   * Initiate
   */
  _initiateContent(ownerDocument: SpatialDocumentImpl) {
    this._layoutNode = new LayoutNode(ownerDocument._defaultView._taffyAllocator, {
      display: CSSDisplay.None,
    });
    console.log(this._layoutNode, this);
  }

  /**
   * @internal
   */
  _addChildToLayoutTree(node: Content2D) {
    this._layoutNode.addChild(node._layoutNode);
    // TODO: handle text?
  }

  /**
   * @internal
   */
  _removeChildFromLayoutTree(node: Content2D) {
    this._layoutNode.removeChild(node._layoutNode);
  }

  /**
   * Update the target texture of this HTML element.
   * 
   * @internal
   * @param targetTexture 
   */
  _updateTargetTexture(targetTexture: InteractiveDynamicTexture) {
    this._targetTexture = targetTexture;

    // TODO
  }

  /**
   * Render the controller itself.
   * 
   * @internal
   * @param rect 
   * @param base 
   */
  _renderSelf(rect: DOMRect, base: DOMRectReadOnly): void {
    const x = rect.x + base.x;
    const y = rect.y + base.y;
    const width = rect.width;
    const height = rect.height;
  }

  /**
   * Process the element picking.
   * 
   * @internal
   * @param x 
   * @param y 
   * @param _type 
   */
  _processPicking(x: number, y: number, _type?: number) {
    // TODO
  }

  /**
   * Process the pointer events.
   * 
   * @internal
   * @param x 
   * @param y 
   * @param type 
   * @returns 
   */
  _processPointerEvent(x: number, y: number, type: number): boolean {
    // TODO
    return true;
  }
}

export interface HTMLContentElement extends Content2D { };
export class HTMLContentElement extends HTMLElementImpl {
  // Nothing
  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: ConstructorParameters<typeof HTMLElementImpl>[2]
  ) {
    super(hostObject, args, privateData);

    this._initiateContent(this._ownerDocument);
  }

  _attach(): void {
    super._attach();

    const parent = this.parentNode;
    if (isHTMLContentElement(parent)) {
      parent._addChildToLayoutTree(this);
    }
  }

  _detach(): void {
    super._detach();

    const parent = this.parentNode;
    if (isHTMLContentElement(parent)) {
      parent._removeChildFromLayoutTree(this);
    }
  }
}

applyMixins(HTMLContentElement, [Content2D]);
