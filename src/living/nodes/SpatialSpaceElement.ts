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
    const spaceNode = new BABYLON.TransformNode(this._getInternalNodeNameOrId(), this._scene);
    spaceNode.setEnabled(false);  // Disable the <space /> node by default.
    super._attach(spaceNode);
  }
}
