import { describe, it, expect } from '@jest/globals';
import DOMMatrixImpl from '../geometry/DOMMatrix';
import { translate, rotate2d } from './matrix-functions';

const matrix: DOMMatrix = new DOMMatrixImpl([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]);

describe('rotate2d', () => {
  it('should rotate2d the transform matrix correctly', () => {
    const angle = Math.random() * 360;
    const result = rotate2d(matrix, angle);
    const cosValue = Number(Math.cos(angle * Math.PI / 180).toFixed(2));
    const sinValue = Number(Math.sin(angle * Math.PI / 180).toFixed(2));
    const expectedMatrix: DOMMatrix = new DOMMatrixImpl([
      cosValue, sinValue, 0, 0,
      -sinValue, cosValue, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    expect(result).toEqual(expectedMatrix);
  });
});
  
describe('translate', () => {
  it('should translate the transform matrix correctly', () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const z = Math.random() * 100;
    const result = translate(matrix, x, y, z);
    const expectedMatrix: DOMMatrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
    expect(result).toEqual(expectedMatrix);
 });
});
