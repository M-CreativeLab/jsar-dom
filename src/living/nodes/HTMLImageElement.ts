import type { NativeDocument } from '../../impl-interfaces';
import { parseURLToResultingURLRecord } from '../helpers/document-base-url';
import { HTMLContentElement } from './HTMLContentElement';
import ImageDataImpl from '../image/ImageData';
import DOMExceptionImpl from '../domexception';
import DOMRectImpl from '../geometry/DOMRect';

export default class HTMLImageElementImpl extends HTMLContentElement implements HTMLImageElement {
  private _imageBitmap: ImageBitmap | null = null;
  private _imageData: ImageDataImpl | null = null;
  private _currentSrc: string | null = null;
  private _currentRequestState: 'unavailable' | 'broken' | 'available' = 'unavailable';

  private _width: number;
  private _height: number;
  private _naturalWidth: number;
  private _naturalHeight: number;
  private _naturalImageRatio: number;
  private _enableResizing: boolean;

  align: string;
  alt: string;
  border: string;
  crossOrigin: string;
  decoding: 'async' | 'sync' | 'auto';

  get complete(): boolean {
    return this.src == null || this.src === '' ||
      this._currentRequestState === 'broken' ||
      this._currentRequestState === 'available';
  }

  get currentSrc(): string {
    return this._currentSrc;
  }

  get height(): number {
    if (this._height === undefined) {
      const valueStr = this.getAttribute('height');
      if (valueStr) {
        const value = parseFloat(valueStr);
        if (!isNaN(value)) {
          this._height = value;
        }
      }
    }
    return this._height;
  }
  set height(value: number) {
    if (this._height !== value) {
      this._height = value;
      this._resizeImageData();
    }
  }

  get width(): number {
    if (this._width === undefined) {
      const valueStr = this.getAttribute('width');
      if (valueStr) {
        const value = parseFloat(valueStr);
        if (!isNaN(value)) {
          this._width = value;
        }
      }
    }
    return this._width;
  }
  set width(value: number) {
    if (this._width !== value) {
      this._width = value;
      this._resizeImageData();
    }
  }

  hspace: number;
  vspace: number;
  isMap: boolean;
  useMap: string;
  loading: 'eager' | 'lazy';
  longDesc: string;
  lowsrc: string;
  name: string;
  naturalHeight: number;
  naturalWidth: number;
  referrerPolicy: string;
  sizes: string;

  get src(): string {
    return this.getAttribute('src') || '';
  }
  set src(value: string) {
    this.setAttribute('src', value);
  }

  get srcset(): string {
    return this.getAttribute('srcset') || '';
  }
  set srcset(value: string) {
    this.setAttribute('srcset', value);
  }

  x: number;
  y: number;

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'img',
    });
  }

  async _dispatchResizeTask(sizeSetter: () => void): Promise<void> {
    this._enableResizing = false;
    sizeSetter();
    this._enableResizing = true;
    return this._resizeImageData();
  }

  _fixSizeByImage(rect: DOMRectImpl) {
    const style = this._adoptedStyle;
    if (!style.height && !style.width) {
      rect.width = this._naturalWidth;
      rect.height = this._naturalHeight;
    }
    if (!style.height) {
      rect.height = rect.width / this._naturalImageRatio;
    }
    if (!style.width) {
      rect.width = rect.height * this._naturalImageRatio;
    }
  }

  private async _resizeImageData() {
    if (this._enableResizing && this._imageBitmap) {
      this._imageData = await this._hostObject.decodeImage(this._imageBitmap, [this.width, this.height]);
    }
  }

  private async _loadImageData() {
    const document = this._ownerDocument;
    if (!document._defaultView) {
      return;
    }

    this._currentSrc = null;
    this._currentRequestState = 'unavailable';

    const src = this.src;
    let urlString: string;
    if (src != null && src !== '') {
      const urlRecord = parseURLToResultingURLRecord(src, document);
      if (urlRecord == null) {
        return;
      }
      urlString = urlRecord.href;
    }

    if (urlString != null) {
      const resourceLoader = this._hostObject.userAgent.resourceLoader;
      try {
        const imageBuffer = await resourceLoader.fetch(urlString, null, 'arraybuffer');
        this._imageBitmap = await this._hostObject.createImageBitmap(imageBuffer);
        this._imageData = await this._hostObject.decodeImage(this._imageBitmap, [this.width, this.height]);
        this._naturalWidth = this._imageBitmap.width;
        this._naturalHeight = this._imageBitmap.height;
        this._naturalImageRatio = this._naturalWidth / this._naturalHeight;
        this._currentSrc = urlString;
        this._currentRequestState = 'available';
      } catch (err) {
        this._currentRequestState = 'broken';
        throw new DOMExceptionImpl(`Failed to load image data, error: ${err?.message}`, 'NETWORK_ERR');
      }
    }
  }

  _attrModified(name: string, value: string, oldValue: string): void {
    if (name === 'src') {
      this._loadImageData();
    }
    super._attrModified(name, value, oldValue);
  }

  _renderSelf(rect: DOMRect, base: DOMRectReadOnly): void {
    this._control.setImageData(this._imageData);
    super._renderSelf(rect, base);
  }

  decode(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
