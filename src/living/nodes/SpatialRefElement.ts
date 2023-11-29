import * as BABYLON from 'babylonjs';
import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialRefElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'ref',
    });
  }

  ref(target: BABYLON.Node) {
    this._internalObject = target;
  }
}
