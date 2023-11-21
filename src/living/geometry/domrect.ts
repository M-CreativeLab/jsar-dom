import DOMRectReadOnlyImpl from './DOMRectReadOnly';

export default class DOMRectImpl extends DOMRectReadOnlyImpl implements DOMRect {
  static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRectImpl(other?.x, other?.y, other?.width, other?.height);
  }

  set x(value: number) {
    this._x = value;
  }
  set y(value: number) {
    this._y = value;
  }
  set width(value: number) {
    this._width = value;
  }
  set height(value: number) {
    this._height = value;
  }
}
