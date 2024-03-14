import DOMMatrixReadOnlyImpl from "./DOMMatrixReadOnly";

export default class DOMMatrixImpl extends DOMMatrixReadOnlyImpl implements DOMMatrix {
    // private _internalData: Float32Array;
    // private _is2D: boolean;
    // private _is3D: boolean;
    // private _isIdentity: boolean;

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
    constructor(init?: string | number[]) {
        super(init);
    }
    rotateSelf(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix {
        throw new Error("Method not implemented.");
    }
    scale3dSelf(scale?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
        throw new Error("Method not implemented.");
    }
    scaleSelf(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }

}