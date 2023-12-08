import cssstyle from 'cssstyle';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';
import { HTMLElementImpl } from './HTMLElement';
import { NativeDocument } from '../../impl-interfaces';
import { isHTMLContentElement } from '../node-type';
import { ShadowRootImpl } from './ShadowRoot';
import DOMExceptionImpl from '../domexception';
import { Control2D } from '../helpers/renderer/control';

export class HTMLContentElement extends HTMLElementImpl {
  private _targetTexture: InteractiveDynamicTexture;
  private _control: Control2D;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: ConstructorParameters<typeof HTMLElementImpl>[2]
  ) {
    super(hostObject, args, privateData);

    this._style = new cssstyle.CSSStyleDeclaration(() => {
      if (this._control.updateLayoutStyle()) {
        this._tryUpdate();
      }
    });
    const ownerDocument = this._ownerDocument;
    this._control = new Control2D(ownerDocument._defaultView._taffyAllocator, this);
  }

  _attach(): void {
    this._control.init();

    let textureToUpdate: InteractiveDynamicTexture;
    const parent = this.parentNode;
    if (isHTMLContentElement(parent)) {
      parent._control.addChild(this._control);
    } else if (parent instanceof ShadowRootImpl) {
      textureToUpdate = parent._interactiveDynamicTexture;
      textureToUpdate._rootLayoutContainer.addChild(this._control);
    }

    if (textureToUpdate) {
      this._targetTexture = textureToUpdate;
    } else {
      const root = this.getRootNode();
      if (root instanceof ShadowRootImpl) {
        this._targetTexture = root._interactiveDynamicTexture;
      } else {
        throw new DOMExceptionImpl('The root node of this HTML content element is not a shadow root.', 'INVALID_STATE_ERR');
      }
    }

    this._control.setRenderingContext(this._targetTexture.getContext() as CanvasRenderingContext2D);
    super._attach();
  }

  _detach(): void {
    /**
     * Remove the node from parent firstly.
     */
    const parent = this.parentNode;
    if (isHTMLContentElement(parent)) {
      parent._control.removeChild(this._control);
    }

    /**
     * Dispose the layout node.
     */
    this._control.dispose();
    super._detach();
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

  _tryUpdate() {
    if (this._targetTexture) {
      this._targetTexture.markAsDirty();
    }
  }

  /**
   * Render the controller itself.
   * 
   * @internal
   * @param rect 
   * @param base 
   */
  _renderSelf(rect: DOMRect, base: DOMRectReadOnly): void {
    return this._control.render(rect, base);
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
