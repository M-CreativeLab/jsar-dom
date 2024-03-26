import DOMPoint from './DOMPoint';
import { post_multiply, pre_multiply } from './MatrixFunction';
export const Get_Matrix_Elements = Symbol('_ReadInternalSymbol');
export default class DOMMatrixReadOnlyImpl implements DOMMatrixReadOnly {
  protected _matrixElements: Float32Array;
  protected _is2D: boolean;
  protected _isIdentity: boolean;

  get a(): number {
    return this._matrixElements[0];
  }

  get b(): number {
    return this._matrixElements[1];
  }

  get c(): number {
    return this._matrixElements[4];
  }

  get d(): number {
    return this._matrixElements[5];
  }

  get e(): number {
    return this._matrixElements[12];
  }

  get f(): number {
    return this._matrixElements[13];
  }

  get m11(): number {
    return this._matrixElements[0];
  }

  get m12(): number {
    return this._matrixElements[1];
  }

  get m13(): number {
    return this._matrixElements[2];
  }

  get m14(): number {
    return this._matrixElements[3];
  }

  get m21(): number {
    return this._matrixElements[4];
  }

  get m22(): number {
    return this._matrixElements[5];
  }

  get m23(): number {
    return this._matrixElements[6];
  }

  get m24(): number {
    return this._matrixElements[7];
  }

  get m31(): number {
    return this._matrixElements[8];
  }

  get m32(): number {
    return this._matrixElements[9];
  }

  get m33(): number {
    return this._matrixElements[10];
  }

  get m34(): number {
    return this._matrixElements[11];
  }

  get m41(): number {
    return this._matrixElements[12];
  }

  get m42(): number {
    return this._matrixElements[13];
  }

  get m43(): number {
    return this._matrixElements[14];
  }

  get m44(): number {
    return this._matrixElements[15];
  }

  get is2D(): boolean {
    return this._is2D;
  }

  get isIdentity(): boolean {
    return this._isIdentity;
  }

  [Get_Matrix_Elements]() {
    return this._matrixElements;
  }

  constructor(init?: string | number[]) {
    // init is omitted
    this._matrixElements = new Float32Array(16);
    if (!init) {
      this._is2D = true;
      this._isIdentity = true;
      this._matrixElements.set([1, 0, 0, 1, 0, 0], 0);
      return;
    }
    
    // init is a string
    if (typeof init === 'string') {
      throw new Error('String initialization is not implemented');
      return;
    }

    // init is a sequence with 6 elements
    if (Array.isArray(init) && init.length === 6) {
      this._is2D = true;
      this._isIdentity = true;
      this._matrixElements[0] = init[0];
      this._matrixElements[1] = init[1];
      this._matrixElements[4] = init[2];
      this._matrixElements[5] = init[3];
      this._matrixElements[12] = init[4];
      this._matrixElements[13] = init[5];

      this._matrixElements[2] = 0;
      this._matrixElements[3] = 0;
      this._matrixElements[6] = 0;
      this._matrixElements[7] = 0;
      this._matrixElements[8] = 0;
      this._matrixElements[9] = 0;
      this._matrixElements[11] = 0;
      this._matrixElements[14] = 0;

      this._matrixElements[10] = 1;
      this._matrixElements[15] = 1;
      
      return;
    }
    // init is a sequence with 16 elements
    if (init.length === 16) {
      this._is2D = false;
      this._isIdentity = true;
      for (var _i = 0; _i < init.length; _i ++) {
        this._matrixElements[_i] = init[_i];
      }
      return;
    }
    // otherwise
    this._is2D = false;
    this._isIdentity = false;
    throw new TypeError("Invalid type for matrix initialization.");
    return;
  }

  translate(tx?: number, ty?: number, tz?: number): DOMMatrix {
    const tmpMatrix = new DOMMatrix(Array.from(this._matrixElements));
    return tmpMatrix.translateSelf(tx, ty, tz);
  }

  scale(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    const tmpMatrix = new DOMMatrix(Array.from(this._matrixElements));
    return tmpMatrix.scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
  }

  scaleNonUniform(scaleX?: number, scaleY?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }
  
  scale3d(scale?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
    throw new Error("Method not implemented.")
  }

  flipX(): DOMMatrix {
    throw new Error("Method not implemented.");
  }
  
  flipY(): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  inverse(): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  multiply(other?: DOMMatrix): DOMMatrix{
    const tmpMatrix = new DOMMatrix(Array.from(this._matrixElements));
    return tmpMatrix.multiplySelf(other)
  }

  rotate(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  invertSelf(): this {
    throw new Error("Method not implemented.");
  }

  rotateAxisAngleSelf(x?: number, y?: number, z?: number, angle?: number): this {
    throw new Error("Method not implemented.");
  }

  rotateFromVectorSelf(x?: number, y?: number): this {
    throw new Error("Method not implemented.");
  }

  rotateAxisAngle(x?: number, y?: number, z?: number, angle?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  rotateFromVector(x?: number, y?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  skewX(sx?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  skewY(sy?: number): DOMMatrix {
    throw new Error("Method not implemented.");
  }

  toFloat32Array(): Float32Array {
    throw new Error("Method not implemented.");
  }

  toFloat64Array(): Float64Array {
    throw new Error("Method not implemented.");
  }

  toJSON() {
    throw new Error("Method not implemented.");
  }

  transformPoint(point?: DOMPointInit): DOMPoint {
    throw new Error("Method not implemented.");
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }
  
}