import type { NativeDocument } from '../../impl-interfaces';
import { kCreateForImpl } from '../../symbols';
import XRJointSpaceImpl from './XRJointSpace';

const jointNames: XRHandJoint[] = [
  'wrist',
  'thumb-metacarpal',
  'thumb-phalanx-proximal',
  'thumb-phalanx-distal',
  'thumb-tip',
  'index-finger-metacarpal',
  'index-finger-phalanx-proximal',
  'index-finger-phalanx-intermediate',
  'index-finger-phalanx-distal',
  'index-finger-tip',
  'middle-finger-metacarpal',
  'middle-finger-phalanx-proximal',
  'middle-finger-phalanx-intermediate',
  'middle-finger-phalanx-distal',
  'middle-finger-tip',
  'ring-finger-metacarpal',
  'ring-finger-phalanx-proximal',
  'ring-finger-phalanx-intermediate',
  'ring-finger-phalanx-distal',
  'ring-finger-tip',
  'pinky-finger-metacarpal',
  'pinky-finger-phalanx-proximal',
  'pinky-finger-phalanx-intermediate',
  'pinky-finger-phalanx-distal',
  'pinky-finger-tip',
];

export default class XRHandImpl extends Map<string, XRJointSpace> implements XRHand {
  WRIST: number = 0;
  THUMB_METACARPAL: number = 1;
  THUMB_PHALANX_PROXIMAL: number = 2;
  THUMB_PHALANX_DISTAL: number = 3;
  THUMB_PHALANX_TIP: number = 4;
  INDEX_METACARPAL: number = 5;
  INDEX_PHALANX_PROXIMAL: number = 6;
  INDEX_PHALANX_INTERMEDIATE: number = 7;
  INDEX_PHALANX_DISTAL: number = 8;
  INDEX_PHALANX_TIP: number = 9;
  MIDDLE_METACARPAL: number = 10;
  MIDDLE_PHALANX_PROXIMAL: number = 11;
  MIDDLE_PHALANX_INTERMEDIATE: number = 12;
  MIDDLE_PHALANX_DISTAL: number = 13;
  MIDDLE_PHALANX_TIP: number = 14;
  RING_METACARPAL: number = 15;
  RING_PHALANX_PROXIMAL: number = 16;
  RING_PHALANX_INTERMEDIATE: number = 17;
  RING_PHALANX_DISTAL: number = 18;
  RING_PHALANX_TIP: number = 19;
  LITTLE_METACARPAL: number = 20;
  LITTLE_PHALANX_PROXIMAL: number = 21;
  LITTLE_PHALANX_INTERMEDIATE: number = 22;
  LITTLE_PHALANX_DISTAL: number = 23;
  LITTLE_PHALANX_TIP: number = 24;

  static [kCreateForImpl](
    hostObject: NativeDocument,
    joints: Array<{
      position: DOMPointInit;
      rotation: DOMPointInit;
    }>
  ): XRHandImpl {
    const impl = new XRHandImpl(hostObject, []);
    for (let i = 0; i < jointNames.length; i++) {
      const name = jointNames[i];
      const pose = joints[i];
      const space = XRJointSpaceImpl[kCreateForImpl](hostObject, name, pose);
      impl.set(name, space);
    }
    return impl;
  }

  constructor(
    private _hostObject: NativeDocument,
    _args: any[],
    _privateData = null
  ) {
    super();
  }
}
