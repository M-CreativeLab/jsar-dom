import DOMMatrixReadOnlyImpl from './DOMMatrixReadOnly';
import { postMultiply } from '../helpers/matrix-functions';

export default class DOMMatrixImpl extends DOMMatrixReadOnlyImpl implements DOMMatrix {
  get a(): number {
    return super.a;
  }

  set a(value: number) {
    this._matrixElements[0] = value;
  }

  get b(): number {
    return super.b;
  }

  set b(value: number) {
    this._matrixElements[1] = value;
  }

  get c(): number {
    return super.c;
  }

  set c(value: number) {
    this._matrixElements[4] = value;
  }

  get d(): number {
    return super.d;
  }

  set d(value: number) {
    this._matrixElements[5] = value;
  }

  get e(): number {
    return super.e;
  }

  set e(value: number) {
    this._matrixElements[8] = value;
  }

  get f(): number {
    return super.f;
  }

  set f(value: number) {
    this._matrixElements[9] = value;
  }

  get m11(): number {
    return super.m11;
  }

  set m11(value: number) {
    this._matrixElements[0] = value;
  }

  get m12(): number {
    return super.m12;
  }

  set m12(value: number) {
    this._matrixElements[4] = value;
  }

  get m13(): number {
    return super.m13;
  }

  set m13(value: number) {
    this._matrixElements[8] = value;
  }

  get m14(): number {
    return super.m14;
  }

  set m14(value: number) {
    this._matrixElements[12] = value;
  }

  get m21(): number {
    return super.m21;
  }

  set m21(value: number) {
    this._matrixElements[1] = value;
  }

  get m22(): number {
    return super.m22;
  }

  set m22(value: number) {
    this._matrixElements[5] = value;
  }

  get m23(): number {
    return super.m23;
  }

  set m23(value: number) {
    this._matrixElements[9] = value;
  }

  get m24(): number {
    return super.m24;
  }

  set m24(value: number) {
    this._matrixElements[13] = value;
  }

  get m31(): number {
    return super.m31;
  }

  set m31(value: number) {
    this._matrixElements[2] = value;
  }

  get m32(): number {
    return super.m32;
  }

  set m32(value: number) {
    this._matrixElements[6] = value;
  }

  get m33(): number {
    return super.m33;
  }

  set m33(value: number) {
    this._matrixElements[10] = value;
  }

  get m34(): number {
    return super.m34;
  }

  set m34(value: number) {
    this._matrixElements[14] = value;
  }

  get m41(): number {
    return super.m41;
  }

  set m41(value: number) {
    this._matrixElements[3] = value;
  }

  get m42(): number {
    return super.m42;
  }

  set m42(value: number) {
    this._matrixElements[7] = value;
  }

  get m43(): number {
    return super.m43;
  }

  set m43(value: number) {
    this._matrixElements[11] = value;
  }

  get m44(): number {
    return super.m44;
  }

  set m44(value: number) {
    this._matrixElements[15] = value;
  }

  constructor(init?: string | number[]) {
    super(init);
  }

  static fromMatrix(other: DOMMatrixInit): DOMMatrix {
    if (other.is2D) {
      const { m11, m12, m21, m22, m41, m42 } = other;
      return new DOMMatrixImpl([
        m11, m12, 0, 0,
        m21, m22, 0, 0,
        m41, m42, 1, 0,
        0, 0, 0, 1
      ]);
    } else {
      const { 
        m11, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44 
      } = other;
      return new DOMMatrixImpl([
        m11, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44
      ]);
    }
  }

  static fromFloat32Array(array32: Float32Array): DOMMatrix {
    return new DOMMatrixImpl([
      array32[0], array32[1], array32[2], array32[3],
      array32[4], array32[5], array32[6], array32[7],
      array32[8], array32[9], array32[10], array32[11],
      array32[12], array32[13], array32[14], array32[15]
    ]);
  }

  static fromFloat64Array(array64: Float64Array): DOMMatrix {
    return new DOMMatrixImpl([
      array64[0], array64[1], array64[2], array64[3],
      array64[4], array64[5], array64[6], array64[7],
      array64[8], array64[9], array64[10], array64[11],
      array64[12], array64[13], array64[14], array64[15]
    ]);
  }

  multiplySelf(other?: DOMMatrixInit): DOMMatrix {
    let otherObject = DOMMatrixImpl.fromMatrix(other);
    const resMatrix = postMultiply(this, otherObject);
    if (otherObject.is2D === false) {
      this._is2D = false;
    }
    return resMatrix;
  }

  preMultiplySelf(other?: DOMMatrixInit): DOMMatrix {
    let otherMatrix = DOMMatrixImpl.fromMatrix(other);
    const resMatrix = postMultiply(this, otherMatrix);
    if (otherMatrix.is2D === false) {
      this._is2D = false;
    }
    return resMatrix;
  }

  rotateSelf(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix {
    throw new Error('Method not implemented.');
  }

  scale3dSelf(scale?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    throw new Error('Method not implemented.');
  }

  scaleSelf(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    let resMatrix = this.translateSelf(originX, originY, originZ);
    // define the transformation matrix for scaling
    const scalationMatrix = new DOMMatrixImpl([
      scaleX, 0, 0, 0,
      0, scaleY ?? scaleX, 0, 0,
      0, 0, scaleZ, 0,
      0, 0, 0, 1
    ]);
    resMatrix = postMultiply(resMatrix, scalationMatrix);
    originX = -originX;
    originY = -originY;
    originZ = -originZ;
    resMatrix = resMatrix.translateSelf(originX, originY, originZ);
    if (scaleZ !== 1 || originZ !== 0 || originZ !== -0) {
      this._is2D = false;
    }
    return resMatrix;
  }

  setMatrixValue(transformList: string): DOMMatrix {
    throw new Error('Method not implemented.');
  }

  skewXSelf(sx?: number): DOMMatrix {
    throw new Error('Method not implemented.');
  }

  skewYSelf(sy?: number): DOMMatrix {
    throw new Error('Method not implemented.');
  }

  translateSelf(tx?: number, ty?: number, tz?: number): DOMMatrix {
    const translationMatrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx ?? 0, ty ?? 0, tz ?? 0, 1
    ]);
    const resMatrix = postMultiply(this, translationMatrix)
    return resMatrix;
  }
}
