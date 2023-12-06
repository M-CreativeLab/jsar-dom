import { LayoutNode } from '../../impl-interfaces';
import { applyMixins } from '../../mixin';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';
import { HTMLElementImpl } from './HTMLElement';

export class Content2D {
  protected _targetTexture: InteractiveDynamicTexture;

  /**
     * The layout node to be used for the HTML layout.
     * 
     * @internal
     */
  _layoutNode: LayoutNode;

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
}

applyMixins(HTMLContentElement, [Content2D]);
