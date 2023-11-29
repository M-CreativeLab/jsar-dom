import * as BABYLON from 'babylonjs';
import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialSpaceElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'space',
    });
  }

  _attach(): void {
    super._attach(new BABYLON.TransformNode(this._getInternalNodeNameOrId(), this._scene));
  }
}
