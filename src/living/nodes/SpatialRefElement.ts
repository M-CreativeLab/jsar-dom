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
    this.setAttribute('id', target.id);
    this.setAttribute('name', target.name);
  }
}
