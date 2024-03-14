import { describe, expect, it } from '@jest/globals';
import DOMPointImpl from './DOMPoint';
import DOMMatrixImpl from './DOMMatrix';
describe('DOMPoint', () => {
  function getMatrixTransform(matrix: DOMMatrix, point: DOMPoint) {
    var x = point.x * matrix.m11 + point.y * matrix.m21 + point.z * matrix.m31 + point.w * matrix.m41;
    var y = point.x * matrix.m12 + point.y * matrix.m22 + point.z * matrix.m32 + point.w * matrix.m42;
    var z = point.x * matrix.m13 + point.y * matrix.m23 + point.z * matrix.m33 + point.w * matrix.m43;
    var w = point.x * matrix.m14 + point.y * matrix.m24 + point.z * matrix.m34 + point.w * matrix.m44;
    return new DOMPointImpl(x, y, w, z)
  }

  function checkDOMPoint(p: DOMPoint, exp: DOMPoint, is2D: Boolean) {
    console.log("p.x: ", p.x);
    console.log("exp.x: ", exp.x);
    if (is2D) {
      expect(p.x).toEqual(exp.x);
      expect(p.y).toEqual(exp.y);
    }
    else {
      expect(p.x).toEqual(exp.x);
      expect(p.y).toEqual(exp.y);
      expect(p.z).toEqual(exp.z);
      expect(p.w).toEqual(exp.z);
    }

  }

  it('creates a DOMPoint', () => {
    const point = new DOMPointImpl();
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
    expect(point.z).toBe(0);
    expect(point.w).toBe(1);
  });

  it('creates a DOMPoint from specific parameters', () => {
    const point = new DOMPointImpl(1, 0, 1, 0);
    expect(point.x).toBe(1);
    expect(point.y).toBe(0);
    expect(point.z).toBe(1);
    expect(point.w).toBe(0);
  });

  it('supports the static method "fromPoint"', () => {
    const point = DOMPointImpl.fromPoint({ x: 100, y: 200, z: 0, w: 1 });
    expect(point.x).toBe(100);
    expect(point.y).toBe(200);
    expect(point.z).toBe(0);
    expect(point.w).toBe(1);
  });

  it('supports value changes', () => {
    const point = DOMPointImpl.fromPoint({ x: 100, y: 200, z: 0, w: 1 });
    point.x = 50;
    point.y = 10;
    expect(point.x).toBe(50);
    expect(point.y).toBe(10);
  });


  it('should return the correct value for the transformation', () => {
    const point = new DOMPointImpl(5, 4);
    const matrix = new DOMMatrixImpl([2, 0, 0, 2, 10, 10]);
    const is2D = matrix.is2D;
    const result = point.matrixTransform(matrix);
    const expected = getMatrixTransform(matrix, point);
    checkDOMPoint(result, expected, is2D);
  });

  it('supports toJSON()', () => {
    const point = new DOMPointImpl(1, 0, 1, 0);
    expect(point.toJSON()).toStrictEqual({
      x: 1,
      y: 0,
      z: 1,
      w: 0
    });
  });
});



