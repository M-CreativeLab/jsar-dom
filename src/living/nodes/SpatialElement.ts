import DOMException from '../domexception';
import { NativeDocument } from '../../impl-interfaces';
import { NodeImpl } from './Node';
import { ElementImpl } from './Element';
import { ShadowRootImpl } from './ShadowRoot';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../../symbols';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import { createSpatialAnimation } from '../helpers/spatial-animations';
import { MATERIAL_BY_SCSS } from '../helpers/babylonjs/tags';
import { RaycastInputDetail } from '../../input-event';
import DOMPointImpl, { GET_UPDATER_SYMBOL } from '../geometry/DOMPoint';

export class SpatialElement extends ElementImpl {
  protected _scene: BABYLON.Scene;
  protected _internalObject: BABYLON.Node;
  protected _style: CSSSpatialStyleDeclaration;
  protected _id: string;

  private _isRayOn = false;
  private _lastRaycastTextCoord: BABYLON.Vector2;

  /**
   * The GUID.
   */
  [SPATIAL_OBJECT_GUID_SYMBOL]: string;

  /**
   * @deprecated use `NodeTypes.isSpatialElement()` instaed.
   */
  static isSpatialElement(node: Node): node is SpatialElement {
    return node.nodeType === NodeImpl.ELEMENT_NODE && node instanceof SpatialElement;
  }

  /**
   * The read-only `style` property of the `SpatialElement` returns the inline style of this element
   * in the form of a live `CSSSpatialStyleDeclaration` object that contains a list of all styles.
   */
  get style(): CSSSpatialStyleDeclaration {
    return this._style;
  }

  constructor(
    hostObject: NativeDocument,
    _args,
    privateData: ConstructorParameters<typeof ElementImpl>[2],
  ) {
    super(hostObject, [], privateData);

    this._scene = hostObject.getNativeScene();
    this._style = new CSSSpatialStyleDeclaration();
    this.nodeType = NodeImpl.ELEMENT_NODE;

    // Set vgoGuid
    this[SPATIAL_OBJECT_GUID_SYMBOL] = BABYLON.Tools.RandomId();
  }

  get position(): DOMPoint {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not get position from non-transform node.', 'INVALID_STATE_ERR');
    }
    const point = DOMPointImpl.fromPoint(this._internalObject.position);
    point[GET_UPDATER_SYMBOL] = (name: string, value: number) => {
      const transformNode = this._internalObject as BABYLON.TransformNode;
      switch (name) {
        case 'x':
          transformNode.position.x = value;
          break;
        case 'y':
          transformNode.position.y = value;
          break;
        case 'z':
          transformNode.position.z = value;
          break;
        default:
          break;
      }
    };
    return point;
  }
  set position(value: DOMPoint) {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not set position to non-transform node.', 'INVALID_STATE_ERR');
    }
    this._internalObject.position = new BABYLON.Vector3(value.x, value.y, value.z);
  }

  get rotationQuaternion(): DOMPoint {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not get rotation from non-transform node.', 'INVALID_STATE_ERR');
    }
    const point = DOMPointImpl.fromPoint(this._internalObject.rotationQuaternion);
    point[GET_UPDATER_SYMBOL] = (name: string, value: number) => {
      const transformNode = this._internalObject as BABYLON.TransformNode;
      switch (name) {
        case 'w':
          transformNode.rotationQuaternion.w = value;
          break;
        case 'x':
          transformNode.rotationQuaternion.x = value;
          break;
        case 'y':
          transformNode.rotationQuaternion.y = value;
          break;
        case 'z':
          transformNode.rotationQuaternion.z = value;
          break;
        default:
          break;
      }
    };
    return point;
  }
  set rotationQuaternion(value: DOMPoint) {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not set rotation to non-transform node.', 'INVALID_STATE_ERR');
    }
    this._internalObject.rotationQuaternion = new BABYLON.Quaternion(value.x, value.y, value.z, value.w);
  }

  get scaling(): DOMPoint {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not get scaling from non-transform node.', 'INVALID_STATE_ERR');
    }
    const point = DOMPointImpl.fromPoint(this._internalObject.scaling);
    point[GET_UPDATER_SYMBOL] = (name: string, value: number) => {
      const transformNode = this._internalObject as BABYLON.TransformNode;
      switch (name) {
        case 'x':
          transformNode.scaling.x = value;
          break;
        case 'y':
          transformNode.scaling.y = value;
          break;
        case 'z':
          transformNode.scaling.z = value;
          break;
        default:
          break;
      }
    };
    return point;
  }
  set scaling(value: DOMPoint) {
    if (!(this._internalObject instanceof BABYLON.TransformNode)) {
      throw new DOMException('Could not set scaling to non-transform node.', 'INVALID_STATE_ERR');
    }
    this._internalObject.scaling = new BABYLON.Vector3(value.x, value.y, value.z);
  }

  /**
   * Set the value of a spatial attribute, it will throw an error if the spatial element is attached.
   * 
   * @throws {DOMException} INVALID_STATE_ERR if the spatial element is attached.
   * @param name the name of the attribute
   * @param value the value of the spatial attribute
   */
  protected _setSpatialAttribute(name: string, value: string | number) {
    if (this._attached) {
      throw new DOMException(`Could not update attribute "${name}" on attached spatial element.`, 'INVALID_STATE_ERR');
    }
    this.setAttribute(name, `${value}`);
  }

  protected _getInternalNodeNameOrId() {
    return this.id || this.getAttribute('name') || this.localName;
  }

  protected _getCommonMeshBuilderOptions(): Partial<{
    sideOrientation: number;
    frontUVs: BABYLON.Vector4;
    backUVs: BABYLON.Vector4;
    updatable: boolean;
  }> {
    let sideOrientation: number;
    switch (this.getAttribute('side-orientation')) {
      case 'front':
        sideOrientation = BABYLON.Mesh.FRONTSIDE;
        break;
      case 'back':
        sideOrientation = BABYLON.Mesh.BACKSIDE;
        break;
      case 'double':
        sideOrientation = BABYLON.Mesh.DOUBLESIDE;
        break;
    }
    return {
      sideOrientation,
      updatable: this.getAttribute('geometry-updatable') === 'yes',
    };
  }

  _attach(node?: BABYLON.Node): void {
    if (node) {
      this._internalObject = node;
    }

    const isInSpatialElement = this.parentNode && SpatialElement.isSpatialElement(this.parentNode);
    if (this._internalObject) {
      /** Add the SpatialObject GUID */
      this._internalObject[SPATIAL_OBJECT_GUID_SYMBOL] = this[SPATIAL_OBJECT_GUID_SYMBOL];
      this._internalObject.metadata = { 'jsardom.guid': this[SPATIAL_OBJECT_GUID_SYMBOL] };
      this._ownerDocument._guidSOfSpatialObjects.set(this[SPATIAL_OBJECT_GUID_SYMBOL], this);

      /** Append the native node(Babylon) into parent if it's a spatial element. */
      if (isInSpatialElement) {
        this._internalObject.parent = this.parentNode.asNativeType();
      }

      // handle ShadowRoot attaching
      if (this._shadowRoot?._attached === false) {
        /**
         * Do attaching shadow if the shadow root is created and not attached.
         */
        this.attachShadow();
      }
    }

    /**
     * Call the original `_attach` method in the last step.
     */
    super._attach();
  }

  _detach(): void {
    super._detach();
    if (this._internalObject) {
      if (this._internalObject instanceof BABYLON.TransformNode) {
        this._scene.removeTransformNode(this._internalObject);
      } else if (this._internalObject instanceof BABYLON.AbstractMesh) {
        this._scene.removeMesh(this._internalObject);
      } else if (this._internalObject instanceof BABYLON.Light) {
        this._scene.removeLight(this._internalObject);
      } else if (this._internalObject instanceof BABYLON.Camera) {
        this._scene.removeCamera(this._internalObject);
      } else {
        throw new DOMException(`Could not detach unknown object, native type is ${this._internalObject.getClassName()}.`, 'INVALID_STATE_ERR');
      }
    }
  }

  /**
   * Returns the native Babylon.js object.
   */
  asNativeType<T extends BABYLON.Node>() {
    return this._internalObject as T;
  }

  /**
   * Checks if the SpatialElement is a TransformNode.
   * @returns {boolean} True if the SpatialElement is a TransformNode, false otherwise.
   */
  isTransformNode() {
    return this._internalObject instanceof BABYLON.TransformNode;
  }

  /**
   * Checks if the SpatialElement is a mesh node.
   * @returns {boolean} True if the SpatialElement is a mesh node, false otherwise.
   */
  isMeshNode() {
    return this._internalObject instanceof BABYLON.AbstractMesh;
  }

  /** @internal */
  _adoptStyle(style: CSSSpatialStyleDeclaration) {
    if (!style._dirty) {
      return;
    }
    const node = this._internalObject;
    if (
      !(node instanceof BABYLON.TransformNode) &&
      !(node instanceof BABYLON.AbstractMesh)
    ) {
      return;
    }

    Array.prototype.forEach.call(style, (property: string) => {
      switch (property) {
        case 'x':
          node.position.x = style._getPropertyValue('x').toNumber();
          break;
        case 'y':
          node.position.y = style._getPropertyValue('y').toNumber();
          break;
        case 'z':
          node.position.z = style._getPropertyValue('z').toNumber();
          break;
        case 'position':
          node.position = new BABYLON.Vector3(
            style._getPropertyValue('x').toNumber(),
            style._getPropertyValue('y').toNumber(),
            style._getPropertyValue('z').toNumber()
          );
          break;
        case 'rotation':
          node.rotation = new BABYLON.Vector3(
            style._getPropertyValue('rotation-x').toAngle('rad'),
            style._getPropertyValue('rotation-y').toAngle('rad'),
            style._getPropertyValue('rotation-z').toAngle('rad')
          );
          break;
        case 'scaling':
          node.scaling = new BABYLON.Vector3(
            style._getPropertyValue('scaling-x').toNumber(),
            style._getPropertyValue('scaling-y').toNumber(),
            style._getPropertyValue('scaling-z').toNumber()
          );
          break;
        case 'material':
          if (node instanceof BABYLON.AbstractMesh) {
            const name = style._getPropertyValue('material').value as string;
            if (typeof name === 'string') {
              const materials = this._scene
                .getMaterialByTags(MATERIAL_BY_SCSS, (mat) => mat.name === name);
              if (materials?.length >= 1) {
                node.material = materials[0];
              }
            }
          }
          break;
        case 'animation-name':
          const name = style._getPropertyValue('animation-name').value as string;
          createSpatialAnimation(
            this._getInternalNodeNameOrId(),
            this._ownerDocument._spatialKeyframesMap.get(name),
            this,
            {
              duration: (style._getPropertyValue('animation-duration')?.value as number) || 1,
              iterationCount: style._getPropertyValue('animation-iteration-count')?.value || 1,
              // TODO: supports animation-timing-function?
            }
          );
          break;
        default:
          break;
      }
    });
    style._dirty = false;
  }

  /** @internal */
  _hasAttachedShadow() {
    return this._shadowRoot != null;
  }

  /** @internal */
  _getAttachedShadow(): ShadowRootImpl {
    return this._shadowRoot;
  }

  /** @internal */
  _processPicking(detail: RaycastInputDetail) {
    /**
     * Handle with GUI reactions if this target spatial object has an attached `XSMLShadowRoot`.
     */
    if (this._shadowRoot && detail.uvCoord) {
      const interactiveDynamicTexture = this._shadowRoot._getNativeTexture();
      interactiveDynamicTexture._processPicking(
        detail.uvCoord.x,
        detail.uvCoord.y,
        BABYLON.PointerEventTypes.POINTERMOVE,
      );
    }

    /**
     * Dispatch the `rayenter` event if the `rayOn` state is false.
     */
    if (this._isRayOn === false) {
      const rayEnterEvent = new Event('rayenter');
      this.dispatchEvent(rayEnterEvent);
      this._isRayOn = true;
    }
    /**
     * Dispatch the `raymove` event if the raycast text coord is changed or last record is null.
     */
    if (!this._lastRaycastTextCoord || !this._lastRaycastTextCoord.equals(detail.uvCoord)) {
      const rayMoveEvent = new Event('raymove');
      this.dispatchEvent(rayMoveEvent);
      this._lastRaycastTextCoord = detail.uvCoord;
    }
  }

  /** @internal */
  _processUnpicking() {
    const rayLeaveEvent = new Event('rayleave');
    this.dispatchEvent(rayLeaveEvent);
    this._isRayOn = false;
  }

  /** @internal */
  _dispatchPointerEvent(type: number) {
    if (this._shadowRoot) {
      this._shadowRoot._getNativeTexture()._processPointerEvent(type);
    }
    if (type === BABYLON.PointerEventTypes.POINTERDOWN) {
      const rayDownEvent = new Event('raydown');
      this.dispatchEvent(rayDownEvent);
    } else if (type === BABYLON.PointerEventTypes.POINTERUP) {
      const rayUpEvent = new Event('rayup');
      this.dispatchEvent(rayUpEvent);
    }
  }

  get textureSizeRatio(): number {
    return 1;
  }

  get textureLighting(): boolean {
    return this.getAttribute('texture-lighting') === 'yes';
  }

  set textureLighting(value: boolean) {
    this.setAttribute('texture-lighting', value ? 'yes' : 'no');
  }

  /**
   * Returns the `ShadowRoot` of this `SpatialObject` instance, it's used to get the GUI elements from script.
   */
  get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  /**
   * @internal
   * @returns the created `ShadowRoot` that is to be attached to this `SpatialObject` instance.
   */
  _createShadowRoot(init?: ShadowRootInit): ShadowRoot {
    if (this._shadowRoot == null || !this._shadowRoot) {
      this._shadowRoot = new ShadowRootImpl(this._hostObject, [init], {
        host: this,
      });
    }
    return this._shadowRoot;
  }

  /**
   * The `SpatialObject.attachShadow()` method attaches a shadow DOM tree to the specified element and returns 
   * a reference to its ShadowRoot.
   */
  attachShadow(init?: ShadowRootInit): ShadowRoot {
    if (!this.isMeshNode()) {
      throw new DOMException('Could not attach shadow to non-mesh node.', 'INVALID_STATE_ERR');
    }
    if (!this._shadowRoot || this._shadowRoot == null) {
      /**
       * Create a shadow root if it doesn't exist.
       */
      this._createShadowRoot(init);
    }
    this._shadowRoot._attach(this.textureLighting);
    return this._shadowRoot;
  }

  /**
   * Attaches a canvas texture to the spatial element.
   * 
   * TODO: return a custom type instead of `BABYLON.DynamicTexture`?
   * 
   * @param width - The width of the canvas texture. Default is 1024.
   * @param height - The height of the canvas texture. Default is 1024.
   * @returns The created dynamic texture.
   * @throws {DOMException} If the spatial element is not a mesh node, or if the mesh node already has a material.
   */
  attachCanvasTexture(width: number, height: number, useAlpha: boolean = false): BABYLON.DynamicTexture {
    if (!this.isMeshNode()) {
      throw new DOMException('Could not attach canvas texture to non-mesh node.', 'INVALID_STATE_ERR');
    }
    if (!(this._internalObject instanceof BABYLON.AbstractMesh)) {
      throw new DOMException('Could not attach canvas texture to non-mesh node.', 'INVALID_STATE_ERR');
    }

    const meshObject = this._internalObject;
    if (meshObject.material) {
      throw new DOMException('Could not attach canvas texture to mesh node with material.', 'INVALID_STATE_ERR');
    }

    const dynamicTexture = new BABYLON.DynamicTexture(
      `${meshObject.name}#DynamicTexture`, { width, height }, this._scene, true);
    dynamicTexture.hasAlpha = useAlpha;
    const material = new BABYLON.StandardMaterial(
      `${meshObject.name}#CanvasMaterial`, this._scene);
    material.diffuseTexture = dynamicTexture;
    material.useAlphaFromDiffuseTexture = useAlpha;
    meshObject.material = material;
    return dynamicTexture;
  }
}
