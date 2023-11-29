import * as BABYLON from 'babylonjs';
import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialBoundElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'bound',
    });
  }

  _attach(): void {
    super._attach(
      new BABYLON.TransformNode(this._getInternalNodeNameOrId(), this._scene)
    );
  }
}
