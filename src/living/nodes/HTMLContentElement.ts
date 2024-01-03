import cssstyle from 'cssstyle';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';
import { HTMLElementImpl } from './HTMLElement';
import { NativeDocument } from '../../impl-interfaces';
import { isHTMLContentElement } from '../node-type';
import { ShadowRootImpl } from './ShadowRoot';
import DOMExceptionImpl from '../domexception';
import { Control2D } from '../helpers/gui2d/control';

const { forEach } = Array.prototype;

export class HTMLContentElement extends HTMLElementImpl {
  private _targetTexture: InteractiveDynamicTexture;
  /** @internal */
  _control: Control2D;
  /** @internal */
  _adoptedStyle: cssstyle.CSSStyleDeclaration;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: ConstructorParameters<typeof HTMLElementImpl>[2]
  ) {
    super(hostObject, args, privateData);

    this._adoptedStyle = new cssstyle.CSSStyleDeclaration(() => {
      /**
       * Due to the nature of the `cssstyle` module, properties with sub-properties such as `padding` and `margin` do not 
       * trigger callbacks when their sub-properties are updated, see https://github.com/jsdom/cssstyle/blob/master/lib/parsers.js#L619.
       * 
       * This is because the callbacks are invoked when updating the main property, and there is no notification for sub-property
       * updates. To address this issue, a setTimeout is used to ensure that the callback is executed in the next tick after the update,
       * allowing us to use the updated sub-properties.
       * 
       * TODO: we will fix this after we moving cssstyle into this project.
       */
      setTimeout(() => {
        if (this._control.updateLayoutStyle()) {
          this._tryUpdate();
        }
      });
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

    // Send the update signal to the target texture.
    this._tryUpdate();
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

    // Send the update signal to the target texture.
    this._tryUpdate();
  }

  _adoptStyle(style: CSSStyleDeclaration) {
    const decl = this._adoptedStyle;
    forEach.call(style, (property: string) => {
      const value = style.getPropertyValue(property);
      if (value === 'unset') {
        decl.removeProperty(property);
      } else {
        decl.setProperty(
          property,
          value,
          style.getPropertyPriority(property)
        );
      }
    });
  }

  _attrModified(name: string, value: string, oldValue: string): void {
    super._attrModified(name, value, oldValue);
    this._tryUpdate();
  }

  /**
   * Update the target texture of this HTML element.
   * 
   * @internal
   * @param targetTexture 
   */
  _updateTargetTexture(targetTexture: InteractiveDynamicTexture) {
    this._targetTexture = targetTexture;
  }

  /**
   * Set the target texture to be dirty, this will trigger a re-rendering of the while target texture(page).
   * 
   * TODO: support partial update.
   */
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
}
