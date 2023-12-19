export default class DOMPointImpl implements DOMPoint {
  w: number;
  x: number;
  y: number;
  z: number;

  static fromPoint(sourcePoint: DOMPointInit): DOMPoint {
    return new DOMPointImpl(sourcePoint.x, sourcePoint.y, sourcePoint.z, sourcePoint.w);
  }

  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.x = typeof x === 'number' ? x : 0;
    this.y = typeof y === 'number' ? y : 0;
    this.z = typeof z === 'number' ? z : 0;
    this.w = typeof w === 'number' ? w : 1;
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
