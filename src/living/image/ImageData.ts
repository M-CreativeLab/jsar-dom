/**
 * Represents image data used in the canvas element.
 */
export default class ImageDataImpl implements ImageData {
  private _data: Uint8ClampedArray;
  private _height: number;
  private _width: number;
  private _colorSpace: PredefinedColorSpace = 'srgb';

  get data(): Uint8ClampedArray {
    return this._data;
  }
  get height(): number {
    return this._height;
  }
  get width(): number {
    return this._width;
  }
  get colorSpace(): PredefinedColorSpace {
    return this._colorSpace;
  }

  /**
   * Creates a new instance of ImageDataImpl.
   * @param data - The pixel data of the image.
   * @param sw - The width of the image.
   * @param sh - The height of the image.
   * @param settings - The settings for the image data.
   */
  constructor(data: unknown, sw: unknown, sh?: unknown, settings?: unknown) {
    if (typeof data === 'number') {
      settings = sh as ImageDataSettings;
      sh = sw as number;
      sw = data as number;
      data = null;
    }

    this._data = data as Uint8ClampedArray;
    this._width = sw as number;
    this._height = sh as number || this._width;

    if (settings) {
      this._colorSpace = (settings as ImageDataSettings).colorSpace;
    }
  }
}
