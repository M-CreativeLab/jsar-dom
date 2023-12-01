import BABYLON from 'babylonjs';
import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialCapsuleElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'capsule',
    });
  }

  get height(): number {
    return parseFloat(this.getAttribute('height'));
  }
  set height(value: number) {
    this._setSpatialAttribute('height', value);
  }

  get radius(): number {
    return parseFloat(this.getAttribute('radius'));
  }
  set radius(value: number) {
    this._setSpatialAttribute('radius', value);
  }

  get radiusTop(): number {
    return parseFloat(this.getAttribute('radius-top'));
  }
  set radiusTop(value: number) {
    this._setSpatialAttribute('radius-top', value);
  }

  get radiusBottom(): number {
    return parseFloat(this.getAttribute('radius-bottom'));
  }
  set radiusBottom(value: number) {
    this._setSpatialAttribute('radius-bottom', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateCapsule(this._getInternalNodeNameOrId(), {
        height: this.height,
        radius: this.radius,
        radiusTop: this.radiusTop,
        radiusBottom: this.radiusBottom,
      }, this._scene)
    );
  }
}
