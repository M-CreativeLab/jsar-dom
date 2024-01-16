class XRInputSourceImpl implements XRInputSource {
  handedness: XRHandedness;
  targetRayMode: XRTargetRayMode;
  targetRaySpace: XRSpace;
  gripSpace?: XRSpace;
  gamepad?: Gamepad;
  profiles: string[];
  hand?: XRHand;
}
