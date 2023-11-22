import {
  type Nullable,
  type Observer,
  type PointerInfo,
  type Scene,
  type StandardMaterial,
  type AbstractMesh,
  RandomGUID,
  GetClass,
  Observable,
  Texture,
  DynamicTexture,
  Engine,
  ClipboardInfo,
  Vector2,
  ClipboardEventTypes,
} from 'babylonjs';
import { NativeDocument } from '../../../impl-interfaces';
import { HTMLElementImpl } from '../../nodes/HTMLElement';
import HTMLDivElementImpl from '../../nodes/HTMLDivElement';

/**
 * The `InteractiveDynamicTexture` is copied from BabylonJS `InteractiveDynamicTexture` and modified to support the texture to interact in JSAR runtime.
 */
export class InteractiveDynamicTexture extends DynamicTexture {
  /** Indicates if some optimizations can be performed in GUI GPU management (the downside is additional memory/GPU texture memory used) */
  public static AllowGPUOptimizations = true;

  /** Snippet ID if the content was created from the snippet server */
  public snippetId: string;

  /** Observable that fires when the GUI is ready */
  public onGuiReadyObservable = new Observable<InteractiveDynamicTexture>();

  /** if the texture is started */
  private _started = false;
  /** if the texture is dirty */
  private _isDirty = true;
  /** if the texture is rendering */
  private _isRendering = false;
  private _ownerNativeDocument: NativeDocument;
  private _pointerObserver: Nullable<Observer<PointerInfo>>;
  private _renderObserver: Nullable<Observer<Scene>>;
  /**
   * This is updated at picking event and used in other hand events.
   */
  private _lastPositionInPicking: Vector2 = new Vector2(-1, -1);

  /** @internal */
  public _rootContainer: HTMLDivElementImpl;
  /** @internal */
  public _lastPickedControl: HTMLElementImpl;
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
  public onClipboardObservable = new Observable<ClipboardInfo>();
  /**
   * Observable event triggered each time a pointer down is intercepted by a control
   */
  public onControlPickedObservable = new Observable<HTMLElement>();
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

  /**
   * Gets the root container control
   */
  public get rootContainer(): HTMLDivElement {
    return this._rootContainer;
  }

  /**
   * Returns an array containing the root container.
   * This is mostly used to let the Inspector introspects the ADT
   * @returns an array containing the rootContainer
   */
  public getChildren(): Array<HTMLElement> {
    return [this._rootContainer];
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
    ownerNativeDocument: NativeDocument,
    width = 0,
    height = 0,
    scene?: Nullable<Scene>,
    generateMipMaps = false,
    samplingMode = Texture.NEAREST_SAMPLINGMODE,
    invertY = true
  ) {
    super(name, { width: width, height: height }, scene, generateMipMaps, samplingMode, Engine.TEXTUREFORMAT_RGBA, invertY);

    scene = this.getScene();
    if (!scene || !this._texture) {
      return;
    }
    this.applyYInversionOnUpdate = invertY;
    this._ownerNativeDocument = ownerNativeDocument;

    const rootContainer = this._ownerNativeDocument.attachedDocument.createElement('div');
    rootContainer.style.height = `${height}px`;
    rootContainer.style.width = `${width}px`;
    this._rootContainer = rootContainer as HTMLDivElementImpl;

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
    this._rootContainer._dispose();
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
    this._rootContainer._updateTargetTexture(this);

    const textureSize = this.getSize();
    const layoutResult = this._rootContainer._layoutNode.computeLayout({
      height: textureSize.height,
      width: textureSize.width,
    });

    // Start rendering
    const size = this.getSize();
    this.getContext().clearRect(0, 0, size.width, size.height);
    this._iterateLayoutResult(layoutResult);
    layoutResult.unref(); // free the layout result.
    this.update();

    this._isDirty = false;
    this._isRendering = false;
  }

  private _iterateLayoutResult(layout, base = { x: 0, y: 0 }, currentControl: HTMLElementImpl = this._rootContainer) {
    currentControl._renderControlSelf.call(currentControl, layout, base);
    for (let i = 0; i < layout.childCount; i++) {
      const childLayout = layout.child(i);
      const childControl = currentControl.childNodes.item(i) as HTMLElementImpl;
      this._iterateLayoutResult(childLayout, {
        x: base.x + layout.x,
        y: base.y + layout.y,
      }, childControl);
    }
  }

  /**
   * This iterate the controls from the given node, and it receives a callback that returns a boolean value. If the boolean is
   * false it stops the iteration of the remaining controls.
   */
  private _iterateControls(node: HTMLElementImpl, callback: (control: HTMLElementImpl) => boolean) {
    const shouldCountine = callback(node);
    if (!shouldCountine) {
      return;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const childControl = node.childNodes.item(i);
      if (childControl instanceof HTMLElementImpl) {
        this._iterateControls(childControl, callback);
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

    this._iterateControls(this._rootContainer, (control) => {
      control._processPicking(xInScreen, yInScreen, type);
      return true;
    });
    this._lastPositionInPicking.x = xInScreen;
    this._lastPositionInPicking.y = yInScreen;
  }

  /**
   * @internal
   */
  public _processPointerEvent(type: number) {
    const { x: xInScreen, y: yInScreen } = this._lastPositionInPicking;
    this._iterateControls(this._rootContainer, (control) => {
      return control._processPointerEvent(xInScreen, yInScreen, type);
    });
  }

  /**
   * @internal
   */
  private _onClipboardCopy = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new ClipboardInfo(ClipboardEventTypes.COPY, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * @internal
   */
  private _onClipboardCut = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new ClipboardInfo(ClipboardEventTypes.CUT, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * @internal
   */
  private _onClipboardPaste = (rawEvt: Event) => {
    const evt = rawEvt as ClipboardEvent;
    const ev = new ClipboardInfo(ClipboardEventTypes.PASTE, evt);
    this.onClipboardObservable.notifyObservers(ev);
    evt.preventDefault();
  };
  /**
   * Register the clipboard Events onto the canvas
   */
  public registerClipboardEvents(): void {
    self.addEventListener("copy", this._onClipboardCopy, false);
    self.addEventListener("cut", this._onClipboardCut, false);
    self.addEventListener("paste", this._onClipboardPaste, false);
  }
  /**
   * Unregister the clipboard Events from the canvas
   */
  public unRegisterClipboardEvents(): void {
    self.removeEventListener("copy", this._onClipboardCopy);
    self.removeEventListener("cut", this._onClipboardCut);
    self.removeEventListener("paste", this._onClipboardPaste);
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
    ownerNativeDocument: NativeDocument,
    mesh: AbstractMesh,
    width = 1024,
    height = 1024,
    supportPointerMove = true,
    onlyAlphaTesting = true,
    invertY?: boolean,
    materialSetupCallback: (mesh: AbstractMesh, uniqueId: string, texture: InteractiveDynamicTexture, onlyAlphaTesting: boolean) => void = this._CreateMaterial
  ): InteractiveDynamicTexture {
    // use a unique ID in name so serialization will work even if you create two ADTs for a single mesh
    const uniqueId = RandomGUID();
    const result = new InteractiveDynamicTexture(
      `InteractiveDynamicTexture for ${mesh.name} [${uniqueId}]`,
      ownerNativeDocument,
      width,
      height,
      mesh.getScene(),
      true,
      Texture.TRILINEAR_SAMPLINGMODE,
      invertY
    );

    // Set for gui-related properties
    mesh.isBlocker = true;
    mesh.isPickable = true;
    mesh.isNearPickable = true;

    // Set for material
    materialSetupCallback(mesh, uniqueId, result, onlyAlphaTesting);
    return result;
  }

  private static _CreateMaterial(mesh: AbstractMesh, uniqueId: string, texture: InteractiveDynamicTexture, onlyAlphaTesting: boolean): void {
    const internalClassType = GetClass('BABYLON.StandardMaterial');
    if (!internalClassType) {
      throw 'StandardMaterial needs to be imported before as it contains a side-effect required by your code.';
    }

    const material: StandardMaterial = new internalClassType(`InteractiveDynamicTextureMaterial for ${mesh.name} [${uniqueId}]`, mesh.getScene());
    material.backFaceCulling = false;
    if (onlyAlphaTesting) {
      material.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
    }
    material.diffuseTexture = texture;
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
