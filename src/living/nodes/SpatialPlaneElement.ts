import * as BABYLON from 'babylonjs';
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

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreatePlane(this._getInternalNodeNameOrId(), {
        size: this.size,
        width: this.width,
        height: this.height,
      }, this._scene)
    );
  }
}
