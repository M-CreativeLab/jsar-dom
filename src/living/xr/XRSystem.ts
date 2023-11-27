import { NativeDocument } from '../../impl-interfaces';
import DOMException from '../domexception';
import XRSessionImpl from './XRSession';

export default class XRSystemImpl extends EventTarget implements XRSystem {
  #nativeDocument: NativeDocument;
  /**
   * @internal
   */
  _session: XRSessionImpl | null = null;

  ondevicechange: XRSystemDeviceChangeEventHandler;
  onsessiongranted: XRSystemSessionGrantedEventHandler;

  constructor(
    hostObject: NativeDocument,
    args,
    privateData = null
  ) {
    super();
    this.#nativeDocument = hostObject;
  }

  async requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession> {
    if (mode !== 'immersive-ar') {
      throw new DOMException('Only immersive-ar mode is supported', 'NOT_SUPPORTED_ERR');
    }
    if (this._session) {
      throw new DOMException('Only one session can be active at a time', 'INVALID_STATE_ERR');
    }
    this._session = new XRSessionImpl(this.#nativeDocument, [options]);
    return this._session;
  }

  async isSessionSupported(mode: XRSessionMode): Promise<boolean> {
    if (mode === 'immersive-ar') {
      return true;
    } else {
      return false;
    }
  }
}
