import * as BABYLON from 'babylonjs';
import DOMException from '../domexception';
import { NativeDocument } from '../../impl-interfaces';
import XRFrameImpl from './XRFrame';

export default class XRSessionImpl extends EventTarget implements XRSession {
  #nativeDocument: NativeDocument;
  #frameObservers: Array<BABYLON.Observer<BABYLON.Scene>> = [];

  inputSources: XRInputSourceArray;
  renderState: XRRenderState;
  environmentBlendMode: XREnvironmentBlendMode;
  visibilityState: XRVisibilityState;
  frameRate?: number;
  supportedFrameRates?: Float32Array;
  domOverlayState?: XRDOMOverlayState;
  preferredReflectionFormat?: XRReflectionFormat;
  depthUsage: XRDepthUsage;
  depthDataFormat: XRDepthDataFormat;
  enabledFeatures: string[];

  onend: XRSessionEventHandler;
  oninputsourceschange: XRInputSourceChangeEventHandler;
  onselect: XRInputSourceEventHandler;
  onselectstart: XRInputSourceEventHandler;
  onselectend: XRInputSourceEventHandler;
  onsqueeze: XRInputSourceEventHandler;
  onsqueezestart: XRInputSourceEventHandler;
  onsqueezeend: XRInputSourceEventHandler;
  onvisibilitychange: XRSessionEventHandler;
  onframeratechange: XRSessionEventHandler;
  requestHitTestSource?: (options: XRHitTestOptionsInit) => Promise<XRHitTestSource>;
  requestHitTestSourceForTransientInput?: (options: XRTransientInputHitTestOptionsInit) => Promise<XRTransientInputHitTestSource>;
  requestHitTest?: (ray: XRRay, referenceSpace: XRReferenceSpace) => Promise<XRHitResult[]>;
  updateWorldTrackingState?: (options: { planeDetectionState?: { enabled: boolean; }; }) => void;

  constructor(
    hostObject: NativeDocument,
    args: [XRSessionInit],
    privateData = null
  ) {
    super();

    this.#nativeDocument = hostObject;
  }

  private get _nativeScene(): BABYLON.Scene {
    return this.#nativeDocument.getNativeScene();
  }

  async end(): Promise<void> {
    return;
  }
  cancelAnimationFrame(id: number): void {
    const observer = this.#frameObservers[id];
    if (observer) {
      observer.remove();
    }
  }
  requestAnimationFrame(callback: XRFrameRequestCallback): number {
    const id = this.#frameObservers.length - 1;
    this.#frameObservers[id] = this._nativeScene.onBeforeRenderObservable.addOnce(() => {
      const frame = new XRFrameImpl(this.#nativeDocument, [], {
        session: this,
      });
      callback(Date.now(), frame);
    });
    return id;
  }
  requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace | XRBoundedReferenceSpace> {
    throw new DOMException('xrSession.requestReferenceSpace() is not supported', 'NOT_SUPPORTED_ERR');
  }
  updateRenderState(renderStateInit?: XRRenderStateInit): Promise<void> {
    throw new DOMException('xrSession.updateRenderState() is not supported', 'NOT_SUPPORTED_ERR');
  }
  updateTargetFrameRate(rate: number): Promise<void> {
    throw new DOMException('xrSession.updateTargetFrameRate() is not supported', 'NOT_SUPPORTED_ERR');
  }
  initiateRoomCapture?(): Promise<void> {
    throw new DOMException('xrSession.initiateRoomCapture() is not supported', 'NOT_SUPPORTED_ERR');
  }
  requestLightProbe(options?: XRLightProbeInit): Promise<XRLightProbe> {
    return null;
  }
  getTrackedImageScores?(): Promise<XRImageTrackingScore[]> {
    return null;
  }
  trySetFeaturePointCloudEnabled(enabled: boolean): boolean {
    return false;
  }
  trySetPreferredPlaneDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean {
    return false;
  }
  trySetMeshDetectorEnabled(enabled: boolean): boolean {
    return false;
  }
  trySetPreferredMeshDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean {
    return false;
  }
}
