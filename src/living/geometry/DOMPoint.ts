export default class DOMPointImpl implements DOMPoint {
  w: number;
  x: number;
  y: number;
  z: number;

  static fromPoint(sourcePoint: DOMPointInit): DOMPoint {
    return new DOMPointImpl(sourcePoint.x, sourcePoint.y, sourcePoint.z, sourcePoint.w);
  }

  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
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
