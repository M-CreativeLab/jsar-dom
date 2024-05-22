import type DocumentOrShadowRootImpl from '../../nodes/DocumentOrShadowRoot';
import * as taffy from '@bindings/taffy';
import { NativeDocument } from '../../../impl-interfaces';
import { HTMLElementImpl } from '../../nodes/HTMLElement';
import { ShadowRootImpl } from '../../nodes/ShadowRoot';
import { HTMLContentElement } from '../../nodes/HTMLContentElement';
import { isHTMLContentElement } from '../../node-type';
import { Control2D } from '../gui2d/control';
import { domSymbolTree } from '../internal-constants';
import DOMMatrixImpl from '../../geometry/DOMMatrix'
import { postMultiply } from '../matrix-functions';

/**
 * The `InteractiveDynamicTexture` is copied from BabylonJS `InteractiveDynamicTexture` and modified to support the texture to interact in JSAR runtime.
 */
export class InteractiveDynamicTexture extends BABYLON.DynamicTexture {
  /** Indicates if some optimizations can be performed in GUI GPU management (the downside is additional memory/GPU texture memory used) */
  public static AllowGPUOptimizations = true;

  /** Snippet ID if the content was created from the snippet server */
  public snippetId: string;

  /** Observable that fires when the GUI is ready */
  public onGuiReadyObservable = new BABYLON.Observable<InteractiveDynamicTexture>();

  /** if the texture is started */
  private _started = false;
  /** if the texture is dirty */
  private _isDirty = true;
  /** if the texture is rendering */
  private _isRendering = false;
  private _ownerNativeDocument: NativeDocument;
  private _pointerObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.PointerInfo>>;
  private _renderObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>>;
  /**
   * This is updated at picking event and used in other hand events.
   */
  private _lastPositionInPicking = new BABYLON.Vector2(-1, -1);

  /** @internal */
  // _rootContainer: HTMLContentElement;
  /** @internal */
  _rootLayoutContainer: Control2D;
  /** @internal */
  _shadowRoot: ShadowRootImpl;
  /** @internal */
  _lastPickedControl: HTMLElementImpl;
  /** @internal */
  /** @internal */
  private _idealWidth = 0;
  private _idealHeight = 0;
  private _renderAtIdealSize = false;
  private _renderScale = 1;

  /**
   * Define type to string to ensure compatibility across browsers
   * Safari doesn't support DataTransfer constructor
   */
  private _clipboardData: string = '';
  /**
   * Observable event triggered each time an clipboard event is received from the rendering canvas
   */
  public onClipboardObservable = new BABYLON.Observable<BABYLON.ClipboardInfo>();
  /**
   * Observable event triggered each time a pointer down is intercepted by a control
   */
  public onControlPickedObservable = new BABYLON.Observable<HTMLElement>();
  /**
   * Gets or sets a boolean indicating that the canvas must be reverted on Y when updating the texture
   */
  public applyYInversionOnUpdate = true;

  /**
   * Gets or sets a number used to scale rendering size (2 means that the texture will be twice bigger).
   * Useful when you want more antialiasing
   */
  public get renderScale(): number {
    return this._renderScale;
  }
  public set renderScale(value: number) {
    if (value === this._renderScale) {
      return;
    }
    this._renderScale = value;
    this._onResize();
  }

  // /**
  //  * Gets the root container control
  //  */
  // public get rootContainer(): HTMLContentElement {
  //   return this._rootContainer;
  // }

  /**
   * Returns an array containing the root container.
   * This is mostly used to let the Inspector introspects the ADT
   * @returns an array containing the rootContainer
   */
  public getChildren() {
    return [];
  }

  /**
   * Gets or sets the current focused control
   */
  // public get focusedControl(): Nullable<IFocusableControl> {
  //   return this._focusedControl;
  // }
  // public set focusedControl(control: Nullable<IFocusableControl>) {
  //   if (this._focusedControl == control) {
  //     return;
  //   }
  //   if (this._focusedControl) {
  //     this._focusedControl.onBlur();
  //   }
  //   if (control) {
  //     control.onFocus();
  //   }
  //   this._focusedControl = control;
  // }
  /**
   * Gets or set information about clipboardData
   */
  public get clipboardData(): string {
    return this._clipboardData;
  }
  public set clipboardData(value: string) {
    this._clipboardData = value;
  }

  /**
   * If this is set, even when a control is pointer blocker, some events can still be passed through to the scene.
   * Options from values are PointerEventTypes
   * POINTERDOWN, POINTERUP, POINTERMOVE, POINTERWHEEL, POINTERPICK, POINTERTAP, POINTERDOUBLETAP
   */
  public skipBlockEvents = 0;

  /**
   * If set to true, every scene render will trigger a pointer event for the GUI
   * if it is linked to a mesh or has controls linked to a mesh. This will allow
   * you to catch the pointer moving around the GUI due to camera or mesh movements,
   * but it has a performance cost.
   */
  public checkPointerEveryFrame = false;

  /**
   * Creates a new InteractiveDynamicTexture.
   */
  constructor(
    name: string,
    width = 1024,
    height = 1024,
    shadowRoot: ShadowRootImpl,
    scene?: BABYLON.Nullable<BABYLON.Scene>,
    generateMipMaps = false,
    samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE,
    invertY = true
  ) {
    super(name, { width: width, height: height }, scene, generateMipMaps, samplingMode, BABYLON.Engine.TEXTUREFORMAT_RGBA, invertY);

    scene = this.getScene();
    if (!scene || !this._texture) {
      return;
    }
    this.applyYInversionOnUpdate = invertY;
    this._ownerNativeDocument = shadowRoot._hostObject;
    this._shadowRoot = shadowRoot;

    const ownerDocument = shadowRoot._ownerDocument;
    this._rootLayoutContainer = new Control2D(ownerDocument._defaultView._taffyAllocator, this._shadowRoot);
    this._rootLayoutContainer.init({
      height: '100%',
      width: '100%',
    });
    this._rootLayoutContainer.setRenderingContext(this.getContext() as CanvasRenderingContext2D);

    this.hasAlpha = true;
    if (!width || !height) {
      this._onResize();
    }
    this._texture.isReady = true;
    this._renderObserver = scene.onBeforeRenderObservable.add(() => {
      if (this._started) {
        this.renderToTexture();
      }
    });
  }

  /**
   * Get the current class name of the texture useful for serialization or dynamic coding.
   * @returns "InteractiveDynamicTexture"
   */
  public getClassName(): string {
    return 'InteractiveDynamicTexture';
  }

  /**
   * Release all resources
   */
  public dispose(): void {
    const scene = this.getScene();
    if (!scene) {
      return;
    }
    if (this._pointerObserver) {
      scene.onPointerObservable.remove(this._pointerObserver);
    }
    if (this._renderObserver) {
      scene.onBeforeRenderObservable.remove(this._renderObserver);
    }
    this.onClipboardObservable.clear();
    this.onControlPickedObservable.clear();
    this.onGuiReadyObservable.clear();
    super.dispose();
  }

  private _onResize(): void {
    const scene = this.getScene();
    if (!scene) {
      return;
    }
    // Check size
    const engine = scene.getEngine();
    const textureSize = this.getSize();
    let renderWidth = engine.getRenderWidth() * this._renderScale;
    let renderHeight = engine.getRenderHeight() * this._renderScale;

    if (this._renderAtIdealSize) {
      if (this._idealWidth) {
        renderHeight = (renderHeight * this._idealWidth) / renderWidth;
        renderWidth = this._idealWidth;
      } else if (this._idealHeight) {
        renderWidth = (renderWidth * this._idealHeight) / renderHeight;
        renderHeight = this._idealHeight;
      }
    }
    if (textureSize.width !== renderWidth || textureSize.height !== renderHeight) {
      this.scaleTo(renderWidth, renderHeight);
      if (this._idealWidth || this._idealHeight) {
        // this._rootContainer._markAllAsDirty();
      }
    }
  }

  public start(): void {
    this._started = true;
  }

  public pause(): void {
    this._started = false;
  }

  public markAsDirty(value: boolean = true) {
    this._isDirty = value;
  }

  public renderToTexture() {
    if (this._isRendering || this._isDirty !== true) {
      return;
    }
    this._isRendering = true;

    // Update styles for GUI nodes
    const defaultView = this._shadowRoot._ownerDocument._defaultView;
    domSymbolTree.treeToArray(this._shadowRoot, {
      filter: node => isHTMLContentElement(node)
    })
      .filter((node: HTMLContentElement) => {
        /**
         * Check if the node has style cache, if not, it means the node should be updated.
         */
        const documentOrShadowRoot = node.getRootNode() as unknown as DocumentOrShadowRootImpl;
        let styleCache = documentOrShadowRoot._styleCache;
        if (!styleCache) {
          return true;
        }
        return styleCache.has(node) === false;
      })
      .forEach((node: HTMLContentElement) => {
        const style = defaultView.getComputedStyle(node);
        node._adoptStyle(style);
      });

    // Compute layouts
    const textureSize = this.getSize();
    this._rootLayoutContainer.layoutNode.computeLayout({
      height: textureSize.height,
      width: textureSize.width,
    });

    // Start rendering
    const size = this.getSize();
    this.getContext().clearRect(0, 0, size.width, size.height);
    const isDirtyAfterRendering = this._iterateLayoutResult();
    this.update();

    // Post steps
    this._isDirty = isDirtyAfterRendering;
    this._isRendering = false;
  }

  private _iterateLayoutResult(
    base = { x: 0, y: 0 },
    currentElementOrControl: HTMLContentElement | null = null
  ): boolean {
    let isDirtyAfterRendering: boolean;
    let layout: taffy.LayoutSimple;
    let elementOrShadowRoot: HTMLContentElement | ShadowRootImpl;
    if (currentElementOrControl === null) {
      const control = this._rootLayoutContainer;
      layout = control.layoutNode.getLayout();
      control.render.call(control, layout, base);
      elementOrShadowRoot = this._shadowRoot;
      isDirtyAfterRendering = control.isDirty();
    } else {
      layout = currentElementOrControl._control.layoutNode.getLayout();
      currentElementOrControl._renderSelf.call(currentElementOrControl, layout, base);
      elementOrShadowRoot = currentElementOrControl;
      isDirtyAfterRendering = currentElementOrControl._control.isDirty();
    }

    for (let i = 0; i < elementOrShadowRoot.children.length; i++) {
      const childItem = elementOrShadowRoot.children.item(i);
      /** check if the child item is a HTMLContentElement instance, such as a <style type="text/css">. */
      if (!isHTMLContentElement(childItem)) {
        continue;
      }
      const isDirty = this._iterateLayoutResult({
        x: base.x + layout.x,
        y: base.y + layout.y,
      }, childItem);

      // If any child is dirty, the parent should be dirty.
      if (isDirtyAfterRendering === false && isDirty === true) {
        isDirtyAfterRendering = true;
      }
    }
    return isDirtyAfterRendering;
  }

  /**
   * This iterate the controls from the given node, and it receives a callback that returns a boolean value. If the boolean is
   * false it stops the iteration of the remaining controls.
   */
  private _iterateControls(callback: (control: Control2D) => boolean, node: HTMLContentElement | null = null) {
    let elementOrShadowRoot: HTMLContentElement | ShadowRootImpl;
    let control: Control2D;

    if (node === null) {
      elementOrShadowRoot = this._shadowRoot;
      control = this._rootLayoutContainer;
    } else {
      elementOrShadowRoot = node;
      control = node._control;
    }

    const shouldCountine = callback(control);
    if (!shouldCountine) {
      return;
    }

    for (let i = 0; i < elementOrShadowRoot.childNodes.length; i++) {
      const childControl = elementOrShadowRoot.childNodes.item(i);
      if (isHTMLContentElement(childControl)) {
        this._iterateControls(callback, childControl);
      }
    }
  }

  /**
   * @internal
   * @param x 
   * @param y 
   * @param type 
   */
  public _processPicking(x: number, y: number, type: number): void {
    const textureSize = this.getSize();
    const xInScreen = textureSize.width * x;
    let yInScreen = textureSize.height * y;
    if (this.invertY) {
      yInScreen = textureSize.height - yInScreen;
    }

    this._iterateControls((control) => {
      control.processPicking(xInScreen, yInScreen, type);
      return true;
    });
    this._lastPositionInPicking.x = xInScreen;
    this._lastPositionInPicking.y = yInScreen;
  }

  /**
   * @internal
   */
  public _processPointerEvent(type: number): boolean {
    const { x: xInScreen, y: yInScreen } = this._lastPositionInPicking;
    this._iterateControls((control) => {
      return control.processPointerEvent(xInScreen, yInScreen, type);
    });
    return true;
  }

  /**
   * @internal
   */
  private _onClipboardCopy = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new BABYLON.ClipboardInfo(BABYLON.ClipboardEventTypes.COPY, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * @internal
   */
  private _onClipboardCut = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new BABYLON.ClipboardInfo(BABYLON.ClipboardEventTypes.CUT, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * @internal
   */
  private _onClipboardPaste = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new BABYLON.ClipboardInfo(BABYLON.ClipboardEventTypes.PASTE, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * Register the clipboard Events onto the canvas
   */
  public registerClipboardEvents(): void {
    self.addEventListener('copy', this._onClipboardCopy, false);
    self.addEventListener('cut', this._onClipboardCut, false);
    self.addEventListener('paste', this._onClipboardPaste, false);
  }
  /**
   * Unregister the clipboard Events from the canvas
   */
  public unRegisterClipboardEvents(): void {
    self.removeEventListener('copy', this._onClipboardCopy);
    self.removeEventListener('cut', this._onClipboardCut);
    self.removeEventListener('paste', this._onClipboardPaste);
  }

  /**
   * Serializes the entire GUI system
   * @returns an object with the JSON serialized data
   */
  public serializeContent(): any {
    // TODO: this is the innerHTML
    throw new TypeError('Not implemented');
  }

  /**
   * Clones the ADT
   * @param newName defines the name of the new ADT
   * @returns the clone of the ADT
   */
  public clone(newName?: string): InteractiveDynamicTexture {
    // TODO: this is the innerHTML
    throw new TypeError('Not implemented');
  }

  /**
   * Creates a new InteractiveDynamicTexture in projected mode (ie. attached to a mesh)
   * @param mesh defines the mesh which will receive the texture
   * @param width defines the texture width (1024 by default)
   * @param height defines the texture height (1024 by default)
   * @param supportPointerMove defines a boolean indicating if the texture must capture move events (true by default)
   * @param onlyAlphaTesting defines a boolean indicating that alpha blending will not be used (only alpha testing) (false by default)
   * @param invertY defines if the texture needs to be inverted on the y axis during loading (true by default)
   * @param materialSetupCallback defines a custom way of creating and setting up the material on the mesh
   * @returns a new InteractiveDynamicTexture
   */
  public static CreateForMesh(
    shadowRoot: ShadowRootImpl,
    mesh: BABYLON.AbstractMesh,
    width = 1024,
    height = 1024,
    supportPointerMove = true,
    onlyAlphaTesting = true,
    enableLighting = false,
    invertY?: boolean
  ): InteractiveDynamicTexture {
    // use a unique ID in name so serialization will work even if you create two ADTs for a single mesh
    const uniqueId = BABYLON.RandomGUID();
    const result = new InteractiveDynamicTexture(
      `InteractiveDynamicTexture for ${mesh.name} [${uniqueId}]`,
      width,
      height,
      shadowRoot,
      mesh.getScene(),
      true,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      invertY
    );

    // Set for gui-related properties
    mesh.isBlocker = true;
    mesh.isPickable = true;
    mesh.isNearPickable = true;

    // Set for material
    this._CreateMaterial(mesh, uniqueId, result, onlyAlphaTesting, enableLighting);
    return result;
  }

  private static _CreateMaterial(
    mesh: BABYLON.AbstractMesh,
    uniqueId: string,
    texture: InteractiveDynamicTexture,
    onlyAlphaTesting: boolean,
    enableLighting: boolean = false
  ): void {
    const internalClassType = BABYLON.GetClass('BABYLON.StandardMaterial');
    if (!internalClassType) {
      throw 'StandardMaterial needs to be imported before as it contains a side-effect required by your code.';
    }

    const material: BABYLON.StandardMaterial = new internalClassType(
      `InteractiveDynamicTextureMaterial for ${mesh.name} [${uniqueId}]`, mesh.getScene());
    material.backFaceCulling = true;
    material.diffuseTexture = texture;
    material.opacityTexture = texture;
    material.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
    material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
    material.alphaCutOff = 0;
    // FIXME: this is a hack to make the material visible in the scene
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    material.disableLighting = !enableLighting;
    mesh.material = material;
  }

  /**
   * Scales the texture
   * @param ratio the scale factor to apply to both width and height
   */
  public scale(ratio: number): void {
    super.scale(ratio);
  }

  /**
   * Resizes the texture
   * @param width the new width
   * @param height the new height
   */
  public scaleTo(width: number, height: number): void {
    super.scaleTo(width, height);
  }

  /**
   * Returns true if all the GUI components are ready to render
   */
  public guiIsReady(): boolean {
    return true;
  }
}
