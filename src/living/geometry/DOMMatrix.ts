import DOMMatrixReadOnlyImpl, { Get_Matrix_Elements } from './DOMMatrixReadOnly';
import * as glMatrix from 'gl-matrix';
import { post_multiply } from './MatrixFunction';
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

  get is2D(): boolean {
    return super.is2D;
  }

  set is2D(value: boolean) {
    this._is2D = value;
  }

  get isIdentity(): boolean {
    return super.isIdentity;
  }

  set isIdentity(value: boolean) {
    this._isIdentity = value;
  }

  constructor(init?: string | number[]) {
    super(init);
  }

  static fromMatrix(other: DOMMatrixInit): DOMMatrixImpl {
    const { m11, m12, m21, m22, m41, m42 } = other;
    return new DOMMatrixImpl([m11, m21, 0, m41, m12, m22, 0, m42, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  multiplySelf(other?: DOMMatrixInit): this {
    let otherObject = DOMMatrixImpl.fromMatrix(other);
    otherObject.multiplySelf(this);
    if (otherObject.is2D === false) {
      this.is2D = false;
    }
    return this;
  }

  preMultiplySelf(other?: DOMMatrix): this {
    let otherObject = DOMMatrixImpl.fromMatrix(other);
    otherObject.preMultiplySelf(this);
    if (otherObject.is2D === false) {
      this.is2D = false;
    }
    return this;
  }

  rotateSelf(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }
  
  scale3dSelf(scale?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }
  
  scaleSelf(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    // define the transformation matrix for scaling
    const scalationMatrix = new DOMMatrix([
    scaleX ?? 1, 0, 0, 0,
    0, scaleY ?? scaleX ?? 1, 0, 0,
    0, 0, scaleZ ?? 1, 0,
    0, 0, 0, 1
    ])
    if (scaleZ !== 1 || originZ !== 0 || originZ !== -0) {
      this._is2D = false;
    }
    const thisMatrix = new DOMMatrix(Array.from(this[Get_Matrix_Elements]()));
    return post_multiply(thisMatrix, scalationMatrix).translate(-originX, -originY, -originZ);
  }

  setMatrixValue(transformList: string): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  skewXSelf(sx?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  skewYSelf(sy?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  translateSelf(tx?: number, ty?: number, tz?: number): DOMMatrix {
    const translationMatrix = new DOMMatrix;([ 
      1, 0, 0, tx ?? 0,
      0, 1, 0, ty ?? 0,
      0, 0, 1, tz ?? 0,
      0, 0, 0, 1
    ]);
    const thisMatrix = new DOMMatrix(Array.from(this[Get_Matrix_Elements]()));
    return post_multiply(thisMatrix, translationMatrix);
  } 

}