export default class DOMRectReadOnlyImpl implements DOMRectReadOnly {
  protected _x: number;
  protected _y: number;
  protected _width: number;
  protected _height: number;

  static fromRect(other?: DOMRectInit): DOMRectReadOnly {
    if (other) {
      return new DOMRectReadOnlyImpl(other.x, other.y, other.width, other.height);
    } else {
      return new DOMRectReadOnlyImpl();
    }
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get top() {
    return Math.min(this._y, this._y + this._height);
  }
  get right() {
    return Math.max(this._x, this._x + this._width);
  }
  get bottom() {
    return Math.max(this._y, this._y + this._height);
  }
  get left() {
    return Math.min(this._x, this._x + this._width);
  }
  get [Symbol.toStringTag]() {
    return 'DOMRectReadOnly';
  }

  toJSON() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }
}