import { describe, it, expect } from '@jest/globals';
import DOMMatrixImpl from '../geometry/DOMMatrix';
import { translate, rotate } from './matrix-functions';

const matrix: DOMMatrix = new DOMMatrixImpl([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]);

describe('rotate', () => {
  it('should rotate the transform matrix correctly', () => {
    const angle = 45;
    const result = rotate(matrix, angle);
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
    const x = 10;
    const y = 20;
    const z = 30;
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
