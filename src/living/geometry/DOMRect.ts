import DOMRectReadOnlyImpl from './DOMRectReadOnly';

export default class DOMRectImpl extends DOMRectReadOnlyImpl implements DOMRect {
  static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRectImpl(other?.x, other?.y, other?.width, other?.height);
  }

  get x() {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }
  get width() {
    return this._width;
  }
  set width(value: number) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value: number) {
    this._height = value;
  }
}
