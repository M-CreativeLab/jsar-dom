import { FloatArray } from 'babylonjs';
import * as glMatrix from 'gl-matrix';

export const kReadInternalData = Symbol('_ReadInternalSymbol');


export default class DOMMatrixReadOnlyImpl implements DOMMatrixReadOnly {
    protected _internalData: Float32Array;
    protected _is2D: boolean;
    protected _is3D: boolean;
    protected _isIdentity: boolean;

    get a(): number {
        return this._internalData[0];
    }

    get b(): number {
        return this._internalData[1];
    }

    get c(): number {
        return this._internalData[2];
    }

    get d(): number {
        return this._internalData[3];
    }

    get e(): number {
        return this._internalData[4];
    }

    get f(): number {
        return this._internalData[5];
    }

    get m11(): number {
        return this._internalData[0];
    }

    get m12(): number {
        return this._internalData[1];
    }

    get m13(): number {
        return this._internalData[2];
    }

    get m14(): number {
        return this._internalData[3];
    }

    get m21(): number {
        return this._internalData[4];
    }

    get m22(): number {
        return this._internalData[5];
    }

    get m23(): number {
        return this._internalData[6];
    }

    get m24(): number {
        return this._internalData[7];
    }

    get m31(): number {
        return this._internalData[8];
    }

    get m32(): number {
        return this._internalData[9];
    }

    get m33(): number {
        return this._internalData[10];
    }

    get m34(): number {
        return this._internalData[11];
    }

    get m41(): number {
        return this._internalData[12];
    }

    get m42(): number {
        return this._internalData[13];
    }

    get m43(): number {
        return this._internalData[14];
    }

    get m44(): number {
        return this._internalData[15];
    }

    get is2D(): boolean {
        return this._is2D;
    }

    get is3D(): boolean {
        return this._is3D;
    }

    get isIdentity(): boolean {
        return this._isIdentity;
    }

    [kReadInternalData]() {
        return this._internalData;
    }

    constructor(init?: string | number[]) {
        // init is omitted
        this._internalData = new Float32Array(16);
        if (!init) {
            this._is2D = true;
            this._is3D = false;
            this._isIdentity = true;
            this._internalData.set([1, 0, 0, 1, 0, 0], 0);
        }
        
        // init is a string
        else if (typeof init == 'string') {
            throw new Error('String initialization is not implemented');
        }

        // init is an array
        else if (Array.isArray(init)) {
            // init is a sequence with 6 elements
            if (init.length == 6) {
                this._is2D = true;
                this._isIdentity = true;
                if(Array.isArray(init)) {
                    [this._internalData[0], this._internalData[1], this._internalData[2],
                    this._internalData[3], this._internalData[4], this._internalData[5]] = init;
                }
            }
            // init is a sequence with 16 elements
            else if(init.length == 16) {
                this._is2D = false;
                this._isIdentity = true;
                if(Array.isArray(init)) {
                    [this._internalData[0], this._internalData[1], this._internalData[2], this._internalData[3],
                    this._internalData[4], this._internalData[5], this._internalData[6], this._internalData[7],
                    this._internalData[8], this._internalData[9], this._internalData[10], this._internalData[11],
                    this._internalData[12], this._internalData[13], this._internalData[14], this._internalData[15]] = init;
                }
            }
            else {
                // otherwise
                this._is2D = false;
                this._isIdentity = false;
                throw new Error("Invalid array length for matrix initialization.");
            }
        }
    }

    translate(tx?: number, ty?: number, tz?: number): DOMMatrix {
        if (!this.is2D) {
            // define the transformation matrix for translation
            const translationMatrix = new DOMMatrix([ 
                1, 0, 0, tx ?? 0,
                0, 1, 0, ty ?? 0,
                0, 0, 1, tz ?? 0,
                0, 0, 0, 1
            ]);
            return this.multiply(translationMatrix);
        } else {
            throw new Error("translate() method is only supported for 3D matrices.");
        }
    }
    scale(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
        if (this.is2D) {
            const scaleMatrix = new DOMMatrix([
                scaleX ?? 1, 0, 0, 0,
                0, scaleY ?? 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            return this.multiply(scaleMatrix);
        } else {
            // define the transformation matrix for scaling
            const scalationMatrix = new DOMMatrix([
                scaleX ?? 1, 0, 0, 0,
                0, scaleY ?? scaleX ?? 1, 0, 0,
                0, 0, scaleZ ?? scaleY ?? 1, 0,
                0, 0, 0, 1
            ])
            return this.translate(originX, originY, originZ).multiply(scalationMatrix)
        }
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
        const re = new DOMMatrix(Array.from(this._internalData));
        return re.multiplySelf(other)
    }

    multiplySelf(other?: DOMMatrix): this {
        if(this.is2D) {
            throw new Error("Method not implemented");
        }
        else {
            const otherMat4 = other[kReadInternalData]();
            glMatrix.mat4.multiply(this._internalData, this._internalData, otherMat4);
            return this;
        }
    }
    rotate(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix {
        throw new Error("Method not implemented.");
    }

    invertSelf(): this {
        // Implement the invertSelf method here.
        return this;
    }

    preMultiplySelf(other?: DOMMatrix): this {
        // Implement the preMultiplySelf method here.
        return this;
    }

    rotateAxisAngleSelf(x?: number, y?: number, z?: number, angle?: number): this {
        // Implement the rotateAxisAngleSelf method here.
        return this;
    }

    rotateFromVectorSelf(x?: number, y?: number): this {
        // Implement the rotateFromVectorSelf method here.
        return this;
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