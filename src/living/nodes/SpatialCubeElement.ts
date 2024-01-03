import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialCubeElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'cube',
    });
  }

  get size(): number {
    return parseFloat(this.getAttribute('size'));
  }
  set size(value: number) {
    this._setSpatialAttribute('size', value);
  }

  get width(): number {
    return parseFloat(this.getAttribute('width'));
  }
  set width(value: number) {
    this._setSpatialAttribute('width', value);
  }

  get height(): number {
    return parseFloat(this.getAttribute('height'));
  }
  set height(value: number) {
    this._setSpatialAttribute('height', value);
  }

  get depth(): number {
    return parseFloat(this.getAttribute('depth'));
  }
  set depth(value: number) {
    this._setSpatialAttribute('depth', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateBox(this._getInternalNodeNameOrId(), {
        ...this._getCommonMeshBuilderOptions(),
        size: this.size,
        width: this.width,
        depth: this.depth,
        height: this.height,
      }, this._scene)
    );
  }
}
