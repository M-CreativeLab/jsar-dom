export function post_multiply(self: DOMMatrix, other: DOMMatrix): DOMMatrix { 
    console.log("🥚🥚🥚otherMatrix: ", other);
    const resMatrix = self.multiply(other); 
    return resMatrix;
}

export function pre_multiply(other: DOMMatrix, self: DOMMatrix): DOMMatrix { 
    const tmpMatrix = new DOMMatrix(Array.from(this._matrixElements));
    const resMatrix = tmpMatrix.preMultiplySelf(other); 
    return resMatrix;
}

