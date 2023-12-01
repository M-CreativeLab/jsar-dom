import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialMeshElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'mesh',
    });
  }

  _attach(): void {
    super._attach();
    // TODO
  }
}
