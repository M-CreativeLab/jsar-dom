import BABYLON from 'babylonjs';
import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialSphereElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'sphere',
    });
  }

  /**
   * Represents the number of segments of the sphere element, with its value being a number.
   */
  get segments(): number {
    return parseFloat(this.getAttribute('segments'));
  }
  set segments(value: number) {
    this._setSpatialAttribute('segments', value);
  }

  /**
   * Represents the diameter of the sphere element, with its value being a number.
   */
  get diameter(): number {
    return parseFloat(this.getAttribute('diameter'));
  }
  set diameter(value: number) {
    this._setSpatialAttribute('diameter', value);
  }

  /**
   * Represents the X-axis diameter of the sphere element, with its value being a number.
   */
  get diameterX(): number {
    return parseFloat(this.getAttribute('diameterX'));
  }
  set diameterX(value: number) {
    this._setSpatialAttribute('diameterX', value);
  }

  /**
   * Represents the Y-axis diameter of the sphere element, with its value being a number.
   */
  get diameterY(): number {
    return parseFloat(this.getAttribute('diameterY'));
  }
  set diameterY(value: number) {
    this._setSpatialAttribute('diameterY', value);
  }

  /**
   * Represents the Z-axis diameter of the sphere element, with its value being a number.
   */
  get diameterZ(): number {
    return parseFloat(this.getAttribute('diameterZ'));
  }
  set diameterZ(value: number) {
    this._setSpatialAttribute('diameterZ', value);
  }

  /**
   * Represents the arc of the sphere element, with its value being a number.
   */
  get arc(): number {
    return parseFloat(this.getAttribute('arc'));
  }
  set arc(value: number) {
    this._setSpatialAttribute('arc', value);
  }

  /**
   * Represents the number of slices of the sphere element, with its value being a number.
   */
  get slice(): number {
    return parseFloat(this.getAttribute('slice'));
  }
  set slice(value: number) {
    this._setSpatialAttribute('slice', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateSphere(this._getInternalNodeNameOrId(), {
        segments: this.segments,
        diameter: this.diameter,
        diameterX: this.diameterX,
        diameterY: this.diameterY,
        diameterZ: this.diameterZ,
        arc: this.arc,
        slice: this.slice,
      }, this._scene)
    );
  }
}
