import { GET_MATRIX_ELEMENTS } from '../geometry/DOMMatrixReadOnly';
import DOMMatrixImpl from '../geometry/DOMMatrix'; 

export function postMultiply(self: DOMMatrix, other: DOMMatrix): DOMMatrix { 
  const selfElements = self[GET_MATRIX_ELEMENTS]();
  const otherElements = other[GET_MATRIX_ELEMENTS]();
  const resElements: number[] = [];
  for (let i = 0; i < 16; i++) {
    let resElement = 0;
    for (let k = 0; k < 4; k++) {
      resElement += selfElements[k * 4 + i % 4] * otherElements[Math.floor(i / 4) * 4 + k];
    }
    resElements[i] = resElement;
  }
  return new DOMMatrixImpl(resElements);
}

export function preMultiply(other: DOMMatrix, self: DOMMatrix): DOMMatrix { 
  const selfElements = self[GET_MATRIX_ELEMENTS]();
  const otherElements = other[GET_MATRIX_ELEMENTS]();
  const resElements: number[] = [];
  for (let i = 0; i < 16; i++) {
    let resElement = 0;
    for (let k = 0; k < 4; k++) {
      resElement += otherElements[Math.floor(i / 4) * 4 + k] * selfElements[k * 4 + i % 4];
    }
    resElements[i] = resElement;
  }
  return new DOMMatrixImpl(resElements);
}

export function translate(transformMatrix: DOMMatrix, x: number, y: number, z: number): DOMMatrix {
  const translateMatrix = new DOMMatrixImpl([
    1, 0, 0, 0,  
    0, 1, 0, 0,  
    0, 0, 1, 0,  
    x, y, z, 1
  ]);
  return postMultiply(transformMatrix, translateMatrix);
}

export function rotate2d(transformMatrix: DOMMatrix, angle: number): DOMMatrix {
  const cosValue = Number(Math.cos(angle * Math.PI / 180).toFixed(2));
  const sinValue = Number(Math.sin(angle * Math.PI / 180).toFixed(2));
  const rotateMatrix = new DOMMatrixImpl([
    cosValue, sinValue, 0, 0,  
    -sinValue, cosValue, 0, 0,  
    0, 0, 1, 0,   
    0, 0, 0, 1
  ]);
  return postMultiply(transformMatrix, rotateMatrix);
}
