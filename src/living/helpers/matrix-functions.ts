import { GET_MATRIX_ELEMENTS } from '../geometry/DOMMatrixReadOnly';
import DOMMatrixImpl from '../geometry/DOMMatrix'; 

export function postMultiply(self: DOMMatrix, other: DOMMatrix): DOMMatrixImpl { 
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

export function preMultiply(other: DOMMatrix, self: DOMMatrix): DOMMatrixImpl { 
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
