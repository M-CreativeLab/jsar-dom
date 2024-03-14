import * as glMatrix from 'gl-matrix';
import { kReadInternalData } from './DOMMatrixReadOnly'
import DOMMatrix from './DOMMatrix'
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
    if (matrix.is2D) {
      // 2D
      const pointVector = new Float32Array([this.x, this.y]);
      const midmatrix = new DOMMatrix([matrix.a, matrix.b, matrix.c,
                                      matrix.d, matrix.e, matrix.f]);
      console.log(midmatrix);
      const transformMatrix = midmatrix[kReadInternalData]();
      glMatrix.vec2.transformMat4(pointVector,pointVector,transformMatrix);
      const re = new DOMPointImpl(pointVector[0], pointVector[1]);
      return re;
    }
    else {
      // 3D Matrix
      const pointVector = new Float32Array([this.x, this.y, this.z, this.w]);
      const midmatrix = new DOMMatrix([matrix.m11, matrix.m12, matrix.m13, matrix.m14,
        matrix.m21, matrix.m22, matrix.m23, matrix.m24,
        matrix.m31, matrix.m32, matrix.m33, matrix.m34,
        matrix.m41, matrix.m42, matrix.m43, matrix.m44]);
      const transformMatrix = midmatrix[kReadInternalData]();
      glMatrix.vec4.transformMat4(pointVector,pointVector,transformMatrix);
      const re = new DOMPointImpl(pointVector[0], pointVector[1], pointVector[2], pointVector[3]);
      return re;
    }
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
