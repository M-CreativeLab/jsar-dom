import * as BABYLON from 'babylonjs';
import { NodeImpl } from './node';
import { XSMLShadowRoot } from './shadow-root';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../../symbols';
import { NativeDocument } from '../../impl-interfaces';

export class SpatialObject extends NodeImpl {
  _scene: BABYLON.Scene;
  _internalObject: BABYLON.Node;
  _id: string;
  _shadowRoot: XSMLShadowRoot = null;
  [SPATIAL_OBJECT_GUID_SYMBOL]: string;

  constructor(
    hostObject: NativeDocument,
    _args,
    privateData: {
      object: BABYLON.Node;
      scene: BABYLON.Scene;
    }
  ) {
    super(hostObject, [], null);

    this._internalObject = privateData.object;
    this._scene = privateData.scene;
    this.nodeType = this.SPATIAL_OBJECT_NODE;

    // Set vgoGuid
    this[SPATIAL_OBJECT_GUID_SYMBOL] = BABYLON.Tools.RandomId();
    this._internalObject[SPATIAL_OBJECT_GUID_SYMBOL] = this[SPATIAL_OBJECT_GUID_SYMBOL];
  }

  get id() {
    return this._id;
  }

  set id(value: string) {
    this._internalObject.id = value;
    this.id = value;
  }

  /**
   * Returns the native Babylon.js object.
   */
  asNativeType<T extends BABYLON.Node>() {
    return this._internalObject as T;
  }

  isTransformNode() {
    return this._internalObject instanceof BABYLON.TransformNode;
  }

  isMeshNode() {
    return this._internalObject instanceof BABYLON.AbstractMesh;
  }

  /** @internal */
  _hasAttachedShadow() {
    return this._shadowRoot != null;
  }

  /** @internal */
  _getAttachedShadow(): XSMLShadowRoot {
    return this._shadowRoot;
  }

  /** @internal */
  _dispatchPointerEvent(type: number) {
    if (this._shadowRoot) {
      this._shadowRoot.getNativeTexture()._processPointerEvent(type);
    }
  }

  /**
   * Returns the `ShadowRoot` of this `SpatialObject` instance, it's used to get the GUI elements from script.
   */
  get shadowRoot(): XSMLShadowRoot {
    return this._shadowRoot;
  }

  /**
   * The `SpatialObject.attachShadow()` method attaches a shadow DOM tree to the specified element and returns 
   * a reference to its ShadowRoot.
   */
  attachShadow(options?: ShadowRootInit): XSMLShadowRoot {
    if (!this.isMeshNode()) {
      throw new DOMException('Could not attach shadow to non-mesh node.', 'InvalidStateError');
    }
    this._shadowRoot = new XSMLShadowRoot(this._hostObject, [options], {
      target: this,
    });
    return this._shadowRoot;
  }

  attachCanvasTexture(width = 1024, height = 1024) {
    if (!this.isMeshNode()) {
      throw new DOMException('Could not attach canvas texture to non-mesh node.', 'InvalidStateError');
    }

    const meshObject = this._internalObject as BABYLON.AbstractMesh;
    const dynamicTexture = new BABYLON.DynamicTexture('dynamicTexture', {
      width,
      height,
    }, this._scene, true);
    const material = new BABYLON.StandardMaterial('material', this._scene);
    material.diffuseTexture = dynamicTexture;
    meshObject.material = material;
    return dynamicTexture;
  }
}
