import type { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialIcosphereElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'icosphere',
    });
  }

  get radiusX(): number {
    return parseFloat(this.getAttribute('radiusX'));
  }
  set radiusX(value: number) {
    this._setSpatialAttribute('radiusX', value);
  }

  get radiusY(): number {
    return parseFloat(this.getAttribute('radiusY'));
  }
  set radiusY(value: number) {
    this._setSpatialAttribute('radiusY', value);
  }

  get radiusZ(): number {
    return parseFloat(this.getAttribute('radiusZ'));
  }
  set radiusZ(value: number) {
    this._setSpatialAttribute('radiusZ', value);
  }

  get radius(): number {
    return parseFloat(this.getAttribute('radius'));
  }
  set radius(value: number) {
    this._setSpatialAttribute('radius', value);
  }

  get subdivisions(): number {
    return parseFloat(this.getAttribute('subdivisions'));
  }
  set subdivisions(value: number) {
    this._setSpatialAttribute('subdivisions', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateIcoSphere(this._getInternalNodeNameOrId(), {
        radius: this.radius,
        radiusX: this.radiusX,
        radiusY: this.radiusY,
        radiusZ: this.radiusZ,
        subdivisions: this.subdivisions,
      }, this._scene)
    );
  }
}
