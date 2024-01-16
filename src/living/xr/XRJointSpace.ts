import type { NativeDocument } from '../../impl-interfaces';
import { kCreateForImpl } from '../../symbols';
import XRPoseImpl from './XRPose';
import XRRigidTransformImpl from './XRRigidTransform';
import XRSpaceImpl, { kSpacePose } from './XRSpace';

type PoseInit = {
  position: DOMPointInit;
  rotation: DOMPointInit;
};

export default class XRJointSpaceImpl extends XRSpaceImpl implements XRJointSpace {
  jointName: XRHandJoint;

  static [kCreateForImpl](
    hostObject: NativeDocument,
    jointName: XRHandJoint,
    jointPose: PoseInit
  ): XRJointSpaceImpl {
    const impl = new XRJointSpaceImpl(hostObject, []);
    impl.jointName = jointName;
    impl[kSpacePose] = XRPoseImpl.createForImpl(impl._hostObject, [], {
      transform: new XRRigidTransformImpl(jointPose.position, jointPose.rotation),
      emulatedPosition: false,
      // TODO: support linearVelocity and angularVelocity?
    });
    return impl;
  }
}
