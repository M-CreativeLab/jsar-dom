import type { NativeDocument } from '../../impl-interfaces';
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
    _args: any[],
    _privateData = null
  ) {
    super();
    this.#nativeDocument = hostObject;
  }

  async requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession> {
    this._session = await XRSessionImpl.createForImpl(this.#nativeDocument, [mode, options]);
    return this._session;
  }

  async isSessionSupported(mode: XRSessionMode): Promise<boolean> {
    const hostObject = this.#nativeDocument;
    if (typeof hostObject.userAgent.isXRSessionSupported !== 'function') {
      return false;
    } else {
      return hostObject.userAgent.isXRSessionSupported(mode);
    }
  }
}
