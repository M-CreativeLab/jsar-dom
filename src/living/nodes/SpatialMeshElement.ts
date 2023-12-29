import { NativeDocument } from '../../impl-interfaces';
import DOMExceptionImpl from '../domexception';
import { SpatialElement } from './SpatialElement';

export default class SpatialMeshElement extends SpatialElement {
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
    super._attach(this._instantiate());
  }

  _instantiate(): BABYLON.Node {
    const windowBase = this._ownerDocument._defaultView;
    const { ref, selector } = this;
    if (!windowBase._hasAssetsBundle(ref)) {
      throw new DOMExceptionImpl(`No mesh with ref(${ref}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }

    const assetsBundle = windowBase._getAssetsBundle(ref);
    const name = this.id || this.getAttribute('name') || this.localName;
    const node = assetsBundle.instantiate(selector, name);
    if (this.id) {
      node.id = this.id;
      node.name = this.id;
    }
    return node;
  }
}
