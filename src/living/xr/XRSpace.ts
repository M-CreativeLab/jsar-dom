import type { NativeDocument } from '../../impl-interfaces';
import XRPoseImpl from './XRPose';

export const kSpacePose = Symbol('kSpacePose');

export default class XRSpaceImpl extends EventTarget implements XRSpace {
  [kSpacePose]: XRPoseImpl;

  constructor(
    protected _hostObject: NativeDocument,
    _args: any[],
    _privateData = null
  ) {
    super();
  }
}
