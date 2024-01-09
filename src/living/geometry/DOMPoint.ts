export const GET_UPDATER_SYMBOL = Symbol('__getUpdater__');

export default class DOMPointImpl implements DOMPoint {
  private _w: number;
  private _x: number;
  private _y: number;
  private _z: number;

  /**
   * @internal
   */
  [GET_UPDATER_SYMBOL]: (name: string, value: number) => void;

  static fromPoint(sourcePoint: DOMPointInit): DOMPoint {
    return new DOMPointImpl(sourcePoint.x, sourcePoint.y, sourcePoint.z, sourcePoint.w);
  }

  constructor(x?: number, y?: number, z?: number, w?: number) {
    this._x = typeof x === 'number' ? x : 0;
    this._y = typeof y === 'number' ? y : 0;
    this._z = typeof z === 'number' ? z : 0;
    this._w = typeof w === 'number' ? w : 1;
  }

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
    this[GET_UPDATER_SYMBOL]('x', value);
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    this[GET_UPDATER_SYMBOL]('y', value);
  }

  get z(): number {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
    this[GET_UPDATER_SYMBOL]('z', value);
  }

  get w(): number {
    return this._w;
  }
  set w(value: number) {
    this._w = value;
    this[GET_UPDATER_SYMBOL]('w', value);
  }

  matrixTransform(matrix?: DOMMatrixInit): DOMPoint {
    throw new Error('Method not implemented.');
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
    };
  }
}
