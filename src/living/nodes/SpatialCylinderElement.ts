import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialCylinderElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'cylinder',
    });
  }

  get height(): number {
    return parseFloat(this.getAttribute('height'));
  }
  set height(value: number) {
    this._setSpatialAttribute('height', value);
  }

  get diameter(): number {
    return parseFloat(this.getAttribute('diameter'));
  }
  set diameter(value: number) {
    this._setSpatialAttribute('diameter', value);
  }

  get diameterTop(): number {
    return parseFloat(this.getAttribute('diameter-top'));
  }
  set diameterTop(value: number) {
    this._setSpatialAttribute('diameter-top', value);
  }

  get diameterBottom(): number {
    return parseFloat(this.getAttribute('diameter-bottom'));
  }
  set diameterBottom(value: number) {
    this._setSpatialAttribute('diameter-bottom', value);
  }

  get tessellation(): number {
    return parseFloat(this.getAttribute('tessellation'));
  }
  set tessellation(value: number) {
    this._setSpatialAttribute('tessellation', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateCylinder(this._getInternalNodeNameOrId(), {
        ...this._getCommonMeshBuilderOptions(),
        height: this.height,
        diameter: this.diameter,
        diameterTop: this.diameterTop,
        diameterBottom: this.diameterBottom,
        tessellation: this.tessellation,
      }, this._scene)
    );
  }
}
