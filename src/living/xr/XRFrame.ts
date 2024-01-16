import { NativeDocument } from '../../impl-interfaces';

export default class XRFrameImpl implements XRFrame {
  session: XRSession;
  predictedDisplayTime?: number;
  trackedAnchors?: XRAnchorSet;
  worldInformation?: XRWorldInformation;
  detectedPlanes?: XRPlaneSet;
  featurePointCloud?: number[];

  constructor(
    private _hostObject: NativeDocument,
    _args: any[],
    privateData: {
      session: XRSession;
    }
  ) {
    this.session = privateData.session;
  }

  getPose(space: XRSpace, baseSpace: XRSpace): XRPose {
    throw new Error('Method not implemented.');
  }

  getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose {
    throw new Error('Method not implemented.');
  }

  createAnchor?: (pose: XRRigidTransform, space: XRSpace) => Promise<XRAnchor>;

  getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[] {
    throw new Error('Method not implemented.');
  }

  getHitTestResultsForTransientInput(hitTestSource: XRTransientInputHitTestSource): XRTransientInputHitTestResult[] {
    throw new Error('Method not implemented.');
  }

  fillPoses?(spaces: XRSpace[], baseSpace: XRSpace, transforms: Float32Array): boolean {
    throw new Error('Method not implemented.');
  }

  getJointPose?(joint: XRJointSpace, baseSpace: XRSpace): XRJointPose {
    throw new Error('Method not implemented.');
  }

  fillJointRadii?(jointSpaces: XRJointSpace[], radii: Float32Array): boolean {
    throw new Error('Method not implemented.');
  }

  getImageTrackingResults?(): XRImageTrackingResult[] {
    throw new Error('Method not implemented.');
  }

  getLightEstimate(xrLightProbe: XRLightProbe): XRLightEstimate {
    throw new Error('Method not implemented.');
  }

  getDepthInformation(view: XRView): XRCPUDepthInformation {
    throw new Error('Method not implemented.');
  }
}
