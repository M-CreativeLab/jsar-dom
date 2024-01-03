import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialPlaneElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'plane',
    });
  }

  get size(): number {
    return parseFloat(this.getAttribute('size'));
  }
  set size(value: number) {
    this._setSpatialAttribute('size', value);
  }

  get width(): number {
    return parseFloat(this.getAttribute('width')) || 1;
  }
  set width(value: number) {
    this._setSpatialAttribute('width', value);
  }

  get height(): number {
    return parseFloat(this.getAttribute('height')) || 1;
  }
  set height(value: number) {
    this._setSpatialAttribute('height', value);
  }

  override get textureSizeRatio(): number {
    return this.height / this.width;
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreatePlane(this._getInternalNodeNameOrId(), {
        ...this._getCommonMeshBuilderOptions(),
        size: this.size,
        width: this.width,
        height: this.height,
      }, this._scene)
    );
  }
}
