import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialTorusElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'torus',
    });
  }

  get diameter(): number {
    return parseFloat(this.getAttribute('diameter'));
  }
  set diameter(value: number) {
    this._setSpatialAttribute('diameter', value);
  }

  get thickness(): number {
    return parseFloat(this.getAttribute('thickness'));
  }
  set thickness(value: number) {
    this._setSpatialAttribute('thickness', value);
  }

  get tessellation(): number {
    return parseFloat(this.getAttribute('tessellation'));
  }
  set tessellation(value: number) {
    this._setSpatialAttribute('tessellation', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreateTorus(this._getInternalNodeNameOrId(), {
        ...this._getCommonMeshBuilderOptions(),
        diameter: this.diameter,
        thickness: this.thickness,
        tessellation: this.tessellation,
      }, this._scene)
    );
  }
}
