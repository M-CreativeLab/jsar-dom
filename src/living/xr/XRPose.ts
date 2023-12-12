import type { NativeDocument } from '../../impl-interfaces';

export default class XRPoseImpl implements XRPose {
  _hostObject: NativeDocument;
  _transform: XRRigidTransform;
  _emulatedPosition: boolean;
  _linearVelocity?: DOMPointReadOnly;
  _angularVelocity?: DOMPointReadOnly;

  get transform(): XRRigidTransform {
    return this._transform;
  }

  get emulatedPosition(): boolean {
    return this._emulatedPosition;
  }

  get linearVelocity(): DOMPointReadOnly | undefined {
    return this._linearVelocity;
  }

  get angularVelocity(): DOMPointReadOnly | undefined {
    return this._angularVelocity;
  }

  static createForImpl(
    hostObject: NativeDocument,
    _args: any[],
    privateData: {
      transform: XRRigidTransform,
      emulatedPosition: boolean,
      linearVelocity?: DOMPointReadOnly,
      angularVelocity?: DOMPointReadOnly,
    }
  ): XRPoseImpl {
    const pose = new XRPoseImpl();
    pose._hostObject = hostObject;
    pose._transform = privateData.transform;
    pose._emulatedPosition = privateData.emulatedPosition;
    pose._linearVelocity = privateData.linearVelocity;
    pose._angularVelocity = privateData.angularVelocity;
    return pose;
  }
}
