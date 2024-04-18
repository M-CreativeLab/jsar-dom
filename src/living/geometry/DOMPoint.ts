import { GET_MATRIX_ELEMENTS } from './DOMMatrixReadOnly';
import DOMMatrix from './DOMMatrix';

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
    if (typeof this[GET_UPDATER_SYMBOL] === 'function') {
      this[GET_UPDATER_SYMBOL]('x', value);
    }
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
    if (typeof this[GET_UPDATER_SYMBOL] === 'function') {
      this[GET_UPDATER_SYMBOL]('y', value);
    }
  }

  get z(): number {
    return this._z;
  }
  set z(value: number) {
    this._z = value;
    if (typeof this[GET_UPDATER_SYMBOL] === 'function') {
      this[GET_UPDATER_SYMBOL]('z', value);
    }
  }

  get w(): number {
    return this._w;
  }
  set w(value: number) {
    this._w = value;
    if (typeof this[GET_UPDATER_SYMBOL] === 'function') {
      this[GET_UPDATER_SYMBOL]('w', value);
    }
  }

  matrixTransform(matrix?: DOMMatrixInit): DOMPoint {
    if (matrix.is2D && this.z === 0 && this.w === 1) {
      const transformed_x = this.x * matrix.m11 + this.y * matrix.m21 + matrix.m41;
      const transformed_y = this.x * matrix.m12 + this.y * matrix.m22 + matrix.m42;
      const resPoint = new DOMPointImpl(transformed_x, transformed_y);
      return resPoint;
    }
    const transformed_x = this.x * matrix.m11 + this.y * matrix.m21 + this.z * matrix.m31 + this.w * matrix.m41;
    const transformed_y = this.x * matrix.m12 + this.y * matrix.m22 + this.z * matrix.m32 + this.w * matrix.m42;
    const transformed_z = this.x * matrix.m13 + this.y * matrix.m23 + this.z * matrix.m33 + this.w * matrix.m43;
    const transformed_w = this.x * matrix.m14 + this.y * matrix.m24 + this.z * matrix.m34 + this.w * matrix.m44;
    const resPoint = new DOMPointImpl(transformed_x, transformed_y, transformed_z, transformed_w);
    return resPoint;
  }

  point2matrix(point?: DOMPoint): DOMMatrix {
    const pointMatrix = new DOMMatrix([point.x, 0, 0, 0, point.y, 0, 0, 0, point.z, 0, 0, 0, point.w, 0, 0, 0]);
    return pointMatrix;
  }

  matrix2point(matrix?: DOMMatrix): DOMPoint {
    const point = new DOMPointImpl(matrix[GET_MATRIX_ELEMENTS]()[0], matrix[GET_MATRIX_ELEMENTS]()[4], matrix[GET_MATRIX_ELEMENTS]()[8], matrix[GET_MATRIX_ELEMENTS]()[12]);
    return point;
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
