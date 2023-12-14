import { NativeDocument, UserAgent as NativeUserAgent } from '../impl-interfaces';
import XRSystemImpl from '../living/xr/XRSystem';

export class NavigatorImpl implements Navigator {
  clipboard: Clipboard;
  credentials: CredentialsContainer;
  doNotTrack: string;
  geolocation: Geolocation;
  get maxTouchPoints(): number {
    return 0;
  }
  mediaCapabilities: MediaCapabilities;
  mediaDevices: MediaDevices;
  mediaSession: MediaSession;
  permissions: Permissions;
  serviceWorker: ServiceWorkerContainer;
  userActivation: UserActivation;
  wakeLock: WakeLock;
  get gpu(): GPU {
    throw new Error('`navigator.gpu` is not supported.');
  }
  get xr(): XRSystem {
    return this._xrSystem;
  }
  get webdriver(): boolean {
    return false;
  }
  get cookieEnabled(): boolean {
    return false;
  }
  get appCodeName(): string {
    return 'JSAR';
  }
  get appName(): string {
    return 'JSAR';
  }
  get appVersion(): string {
    return this._nativeUserAgent.versionString || 'Unknown';
  }
  get platform(): string {
    return process.platform || window.navigator.platform;
  }
  get product(): string {
    return 'JSAR';
  }
  get productSub(): string {
    return '1.0';
  }
  get userAgent(): string {
    return `JSAR/${this._nativeUserAgent.versionString || 'Unknown'} (XSML/1.0)`;
  }
  get vendor(): string {
    return this._nativeUserAgent.vendor;
  }
  get vendorSub(): string {
    return this._nativeUserAgent.vendorSub;
  }
  get language(): string {
    return this._nativeUserAgent.language;
  }
  get languages(): readonly string[] {
    return this._nativeUserAgent.languages;
  }
  locks: LockManager;
  onLine: boolean;
  mimeTypes: MimeTypeArray;
  pdfViewerEnabled: boolean;
  plugins: PluginArray;
  hardwareConcurrency: number;
  storage: StorageManager;

  private _nativeUserAgent: NativeUserAgent;
  private _xrSystem: XRSystemImpl;

  constructor(
    hostObject: NativeDocument,
    _args,
    _privateData = null
  ) {
    this._nativeUserAgent = hostObject.userAgent;
    this._xrSystem = new XRSystemImpl(hostObject, []);
  }

  canShare(_data?: ShareData): boolean {
    return false;
  }
  getGamepads(): Gamepad[] {
    throw new Error('`navigator.getGamepads()` is not supported.');
  }
  requestMIDIAccess(options?: MIDIOptions): Promise<MIDIAccess> {
    throw new Error('`navigator.requestMIDIAccess()` is not supported.');
  }
  requestMediaKeySystemAccess(keySystem: string, supportedConfigurations: MediaKeySystemConfiguration[]): Promise<MediaKeySystemAccess> {
    throw new Error('`navigator.requestMediaKeySystemAccess()` is not supported.');
  }
  sendBeacon(url: string | URL, data?: BodyInit): boolean {
    throw new Error('`navigator.sendBeacon()` is not supported.');
  }
  share(data?: ShareData): Promise<void> {
    throw new Error('`navigator.share()` is not supported.');
  }
  vibrate(pattern: VibratePattern): boolean {
    if (typeof this._nativeUserAgent.vibrate === 'function') {
      return this._nativeUserAgent.vibrate(pattern);
    } else {
      return false;
    }
  }
  mozGetVRDevices: (any: any) => any;
  webkitGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void {
    throw new Error('`navigator.webkitGetUserMedia()` is not supported.');
  }
  mozGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void {
    throw new Error('`navigator.mozGetUserMedia()` is not supported.');
  }
  msGetUserMedia(constraints: MediaStreamConstraints, successCallback: any, errorCallback: any): void {
    throw new Error('`navigator.msGetUserMedia()` is not supported.');
  }
  webkitGetGamepads(): Gamepad[] {
    throw new Error('`navigator.webkitGetGamepads()` is not supported.');
  }
  msGetGamepads(): Gamepad[] {
    throw new Error('`navigator.msGetGamepads()` is not supported.');
  }
  webkitGamepads(): Gamepad[] {
    throw new Error('`navigator.webkitGamepads()` is not supported.');
  }
  clearAppBadge(): Promise<void> {
    throw new Error('`navigator.clearAppBadge()` is not supported.');
  }
  setAppBadge(contents?: number): Promise<void> {
    throw new Error('`navigator.setAppBadge()` is not supported.');
  }
  registerProtocolHandler(scheme: string, url: string | URL): void {
    throw new Error('`navigator.registerProtocolHandler()` is not supported.');
  }
  javaEnabled(): boolean {
    return false;
  }
}
