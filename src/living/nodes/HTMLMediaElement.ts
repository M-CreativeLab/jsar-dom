import * as buffer from 'buffer';
import type { MediaPlayerBackend, NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

enum MediaReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

enum MediaNetworkState {
  NETWORK_EMPTY = 0,
  NETWORK_IDLE = 1,
  NETWORK_LOADING = 2,
  NETWORK_NO_SOURCE = 3,
}

export default class HTMLMediaElementImpl extends HTMLElementImpl implements HTMLMediaElement {
  autoplay: boolean = false;
  buffered: TimeRanges;
  controls: boolean = false;
  crossOrigin: string = '';
  currentSrc: string = '';

  get currentTime(): number {
    return this._playerNative.currentTime;
  }
  set currentTime(value: number) {
    this._playerNative.currentTime = value;
  }

  defaultMuted: boolean = false;
  defaultPlaybackRate: number;
  disableRemotePlayback: boolean;

  get duration(): number {
    return this._playerNative.duration;
  }

  ended: boolean = false;
  error: MediaError;
  mediaKeys: MediaKeys;
  muted: boolean;
  networkState: number = MediaNetworkState.NETWORK_EMPTY;
  onencrypted: (this: HTMLMediaElement, ev: MediaEncryptedEvent) => any;
  onwaitingforkey: (this: HTMLMediaElement, ev: Event) => any;
  get paused(): boolean {
    return this._playerNative.paused;
  }
  playbackRate: number;
  played: TimeRanges;
  preload: '' | 'none' | 'metadata' | 'auto' = 'auto';
  preservesPitch: boolean = false;
  readyState: number = MediaReadyState.HAVE_NOTHING;
  remote: RemotePlayback;
  seekable: TimeRanges;
  seeking: boolean;

  get src(): string {
    return this._src;
  }
  set src(value: string) {
    this._src = value;
    this.load();
  }

  srcObject: MediaProvider;
  textTracks: TextTrackList;

  get volume(): number {
    return this._playerNative.volume;
  }
  set volume(value: number) {
    this._playerNative.volume = value;
  }

  get loop(): boolean {
    return this._playerNative.loop;
  }
  set loop(value: boolean) {
    this._playerNative.loop = value;
  }

  protected _playerNative: MediaPlayerBackend;
  protected _src: string;

  constructor(
    hostObject: NativeDocument,
    _args: any[],
    privateData: ConstructorParameters<typeof HTMLElementImpl>[2]
  ) {
    super(hostObject, _args, privateData);

    const PlayerConstructor = hostObject.userAgent.getMediaPlayerConstructor();
    const player = this._playerNative = new PlayerConstructor();
    this._ownerDocument._defaultView._listOfAudioPlayers.add(player);

    player.onended = () => {
      const event = new Event('ended');
      this.dispatchEvent(event);
      if (typeof this.onended === 'function') {
        this.onended(event);
      }
    };
  }

  addTextTrack(_kind: TextTrackKind, _label?: string, _language?: string): TextTrack {
    throw new Error('The method "HTMLMediaElement.prototype.addTextTrack()" not implemented.');
  }

  canPlayType(type: string): CanPlayTypeResult {
    return this._playerNative.canPlayType(type);
  }

  fastSeek(time: number): void {
    this._play(time);
  }

  load(): void {
    this.networkState = MediaNetworkState.NETWORK_LOADING;
    this.readyState = MediaReadyState.HAVE_NOTHING;

    if (typeof window === 'undefined' && this.src.startsWith('blob:')) {
      const { resolveObjectURL } = buffer;
      this._loadFromBlob(resolveObjectURL(this.src));
    } else {
      this._loadFromURL(this.src);
    }
  }

  pause(): void {
    this._playerNative.pause();
  }

  play(): Promise<void> {
    return this._play(0);
  }

  setMediaKeys(_mediaKeys: MediaKeys): Promise<void> {
    throw new Error('The method "HTMLMediaElement.prototype.setMediaKeys()" not implemented.');
  }

  protected async _loadFromBlob(blob: Blob) {
    this._loadFromArrayBuffer(await blob.arrayBuffer());
  }

  protected async _loadFromURL(url: string) {
    const res = await fetch(url);
    const ab = await res.arrayBuffer();
    this._loadFromArrayBuffer(ab);
  }

  protected async _loadFromArrayBuffer(ab: ArrayBuffer) {
    this._playerNative.load(ab, () => {
      // Update states
      this.networkState = MediaNetworkState.NETWORK_IDLE;
      this.readyState = MediaReadyState.HAVE_ENOUGH_DATA;

      // Handle autoplay
      if (this.autoplay === true) {
        this.play();
      }

      // Dispatch events
      const event = new Event('loadeddata');
      this.dispatchEvent(event);
    });
  }

  protected async _play(when: number): Promise<void> {
    if (this.readyState < MediaReadyState.HAVE_CURRENT_DATA) {
      return new Promise<void>((resolve) => {
        this.addEventListener('loadeddata', () => {
          this._playerNative.play(when);
          resolve();
        }, { once: true });
      });
    } else {
      this._playerNative.play(when);
      return Promise.resolve();
    }
  }

  NETWORK_EMPTY: 0;
  NETWORK_IDLE: 1;
  NETWORK_LOADING: 2;
  NETWORK_NO_SOURCE: 3;
  HAVE_NOTHING: 0;
  HAVE_METADATA: 1;
  HAVE_CURRENT_DATA: 2;
  HAVE_FUTURE_DATA: 3;
  HAVE_ENOUGH_DATA: 4;
}
