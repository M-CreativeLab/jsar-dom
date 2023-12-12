export default class DOMPointReadOnlyImpl implements DOMPointReadOnly {
  private _w: number;
  private _x: number;
  private _y: number;
  private _z: number;

  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  get z(): number {
    return this._z;
  }
  get w(): number {
    return this._w;
  }

  static fromPoint(sourcePoint: DOMPointInit): DOMPointReadOnly {
    return new DOMPointReadOnlyImpl(sourcePoint.x, sourcePoint.y, sourcePoint.z, sourcePoint.w);
  }

  constructor(x?: number, y?: number, z?: number, w?: number) {
    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._w = w || 0;
  }

  matrixTransform(matrix?: DOMMatrixInit): DOMPoint {
    throw new Error('Method not implemented.');
  }

  toJSON() {
    return {
      x: this._x,
      y: this._y,
      z: this._z,
      w: this._w,
    };
  }
}
