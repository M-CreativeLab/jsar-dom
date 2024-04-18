import { GET_MATRIX_ELEMENTS } from '../geometry/DOMMatrixReadOnly';
import DOMMatrixImpl from '../geometry/DOMMatrix'; 

export function postMultiply(self: DOMMatrix, other: DOMMatrix): DOMMatrix { 
  const selfElements = self[GET_MATRIX_ELEMENTS]();
  const otherElements = other[GET_MATRIX_ELEMENTS]();
  const resElements: number[] = [];
  for (let i = 0; i < 16; i = i + 1) {
    let tmpElement = 0;
    for (let k = 0; k < 4; k++) {
      tmpElement += selfElements[k * 4 + i % 4] * otherElements[Math.floor(i / 4) * 4 + k];
    }
    resElements[i] = tmpElement;
  }
  const resMatrix = new DOMMatrixImpl(resElements);
  return resMatrix;
}

export function preMultiply(other: DOMMatrix, self: DOMMatrix): DOMMatrix { 
  const selfElements = self[GET_MATRIX_ELEMENTS]();
  const otherElements = other[GET_MATRIX_ELEMENTS]();
  const resElements: number[] = [];
  for (let i = 0; i < 16; i = i + 1) {
    let tmpElement = 0;
    for (let k = 0; k < 4; k++) {
      tmpElement += otherElements[Math.floor(i / 4) * 4 + k] * selfElements[k * 4 + i % 4];
    }
    resElements[i] = tmpElement;
  }
  const resMatrix = new DOMMatrixImpl(resElements);
  return resMatrix;
}
