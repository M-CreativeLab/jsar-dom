import DOMMatrixImpl from '../geometry/DOMMatrix';
import { postMultiply } from './matrix-functions';

export function translate(transformMatrix: DOMMatrixImpl, x: number, y: number, z: number): DOMMatrixImpl {
  const translateMatrix = new DOMMatrixImpl([
    1, 0, 0, 0,  
    0, 1, 0, 0,  
    0, 0, 1, 0,  
    x, y, z, 1
  ]);
  return postMultiply(transformMatrix, translateMatrix) as DOMMatrixImpl;
}

export function rotate(transformMatrix: DOMMatrixImpl, angle: number): DOMMatrixImpl {
  const cosValue = Number(Math.cos(angle * Math.PI / 180).toFixed(2));
  const sinValue = Number(Math.sin(angle * Math.PI / 180).toFixed(2));
  const rotateMatrix = new DOMMatrixImpl([
    cosValue, sinValue, 0, 0,  
    -sinValue, cosValue, 0, 0,  
    0, 0, 1, 0,   
    0, 0, 0, 1
  ]);
  return postMultiply(transformMatrix, rotateMatrix) as DOMMatrixImpl;
}
