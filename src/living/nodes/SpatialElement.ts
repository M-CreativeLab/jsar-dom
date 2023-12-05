import DOMException from '../domexception';
import { NativeDocument } from '../../impl-interfaces';
import { NodeImpl } from './Node';
import { ElementImpl } from './Element';
import { XSMLShadowRoot } from './ShadowRoot';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../../symbols';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import { MATERIAL_BY_SCSS } from '../helpers/babylonjs/tags';

export class SpatialElement extends ElementImpl {
  protected _scene: BABYLON.Scene;
  protected _internalObject: BABYLON.Node;
  protected _style: CSSSpatialStyleDeclaration;
  protected _id: string;
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

  _attach(node?: BABYLON.Node): void {
    if (node) {
      this._internalObject = node;
    }
    if (this._internalObject) {
      /** Add the SpatialObject GUID */
      this._internalObject[SPATIAL_OBJECT_GUID_SYMBOL] = this[SPATIAL_OBJECT_GUID_SYMBOL];
      /** Append the native node(Babylon) into parent if it's a spatial element. */
      if (this.parentNode && SpatialElement.isSpatialElement(this.parentNode)) {
        this._internalObject.parent = this.parentNode.asNativeType();
      }
    }
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
        case 'position':
          node.position = new BABYLON.Vector3(
            style._getPropertyValue('position-x').toNumber(),
            style._getPropertyValue('position-y').toNumber(),
            style._getPropertyValue('position-z').toNumber()
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
      throw new DOMException('Could not attach shadow to non-mesh node.', 'INVALID_STATE_ERR');
    }
    this._shadowRoot = new XSMLShadowRoot(this._hostObject, [options], {
      target: this,
    });
    return this._shadowRoot;
  }

  attachCanvasTexture(width = 1024, height = 1024) {
    if (!this.isMeshNode()) {
      throw new DOMException('Could not attach canvas texture to non-mesh node.', 'INVALID_STATE_ERR');
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
