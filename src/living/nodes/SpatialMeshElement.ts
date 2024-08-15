import { NativeDocument } from '../../impl-interfaces';
import DOMExceptionImpl from '../domexception';
import { SpatialElement } from './SpatialElement';

const defaultFitSize = 0.3;

export default class SpatialMeshElement extends SpatialElement {
  private _cachedName: string;

  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'mesh',
    });
  }

  get ref(): string {
    return this.getAttribute('ref');
  }
  set ref(value: string) {
    this.setAttribute('ref', value);
  }

  get selector(): string {
    return this.getAttribute('selector') || '__root__';
  }
  set selector(value: string) {
    this.setAttribute('selector', value);
  }

  get fitSize(): number {
    const v = parseFloat(this.getAttribute('fit-size'));
    if (v <= 0 || v > 1 || isNaN(v)) {
      return defaultFitSize;
    } else {
      return v;
    }
  }
  set fitSize(value: number) {
    this.setAttribute('fit-size', value.toString());
  }

  async _attach() {
    const { ref } = this;
    if (!ref) {
      throw new DOMExceptionImpl('ref is required in <mesh>', 'INVALID_STATE_ERR');
    }

    // Wait for the mesh to be preloaded if it is in the preloading queue.
    const queue = this._ownerDocument._preloadingSpatialModelObservers;
    if (queue.has(ref)) {
      if (!await queue.get(ref)) {
        throw new DOMExceptionImpl(`Failed to preload the mesh with ref(${ref})`, 'INVALID_STATE_ERR');
      }
    }

    // Ensure the assets bundle is ready.
    this._ensureAssetsBundle();

    // Create the container node and attach with it.
    const name = this._getName();
    const containerNode = new BABYLON.TransformNode(name, this._hostObject.getNativeScene());
    if (this.id) {
      containerNode.id = this.id;
      containerNode.name = this.id;
    }
    super._attach(containerNode);

    // append the content `SpatialElement` to this element.
    const contentElement = this._instantiate();
    this.appendChild(contentElement);
    contentElement.asNativeType().parent = containerNode; // Set the parent of the content native node to be the container node.

    // Fit the content element to the size
    this._fitTo(containerNode, this.fitSize);
    containerNode.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
  }

  _instantiate(): SpatialElement {
    const windowBase = this._ownerDocument._defaultView;
    const { ref, selector } = this;
    const assetsBundle = windowBase._getAssetsBundle(ref);
    return assetsBundle.instantiate(selector, this._getName());
  }

  private _fitTo(node: BABYLON.TransformNode, ratio: number = defaultFitSize) {
    const boundingVectors = node.getHierarchyBoundingVectors(true);
    const totalSize = boundingVectors.max.subtract(boundingVectors.min);
    const scalingFactor = Math.min(ratio / totalSize.x, ratio / totalSize.y, ratio / totalSize.z);
    node.scaling.multiplyInPlace(new BABYLON.Vector3(scalingFactor, scalingFactor, scalingFactor));
  }

  private _getName(): string {
    if (this._cachedName) {
      return this._cachedName;
    }
    this._cachedName = this.id || this.getAttribute('name') || this.localName;
    return this._cachedName;
  }

  private _ensureAssetsBundle() {
    const windowBase = this._ownerDocument._defaultView;
    const { ref } = this;
    if (!windowBase._hasAssetsBundle(ref)) {
      throw new DOMExceptionImpl(`No mesh with ref(${ref}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }
  }
}
