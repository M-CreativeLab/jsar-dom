import { Get_Matrix_Elements } from '../geometry/DOMMatrixReadOnly';
import DOMMatrixImpl from '../geometry/DOMMatrix'; 

export function postMultiply(self: DOMMatrix, other: DOMMatrix): DOMMatrix { 
  const selfElements = Array.from(self[Get_Matrix_Elements]());
  const otherElements = Array.from(other[Get_Matrix_Elements]());
  const resElements = [];
  for (let i = 0; i < 16; i = i + 1) {
    resElements[i] = 0;
    for (let k = 0; k < 4; k++) {
      resElements[i] += Number(selfElements[k * 4 + i % 4]) * Number(otherElements[Math.floor(i / 4) * 4 + k]);
    }
  }
  const resMatrix = new DOMMatrixImpl(resElements);
  return resMatrix;
}

export function preMultiply(other: DOMMatrix, self: DOMMatrix): DOMMatrix { 
  const selfElements = Array.from(self[Get_Matrix_Elements]);
  const otherElements = Array.from(other[Get_Matrix_Elements]);
  const resElements = [];
  for (let i = 0; i < 16; i = i + 1) {
    resElements[i] = 0;
    for (let k = 0; k < 4; k++) {
      resElements[i] += Number(otherElements[Math.floor(i / 4) * 4 + k]) * Number(selfElements[k * 4 + i % 4]);
    }
  }
  const resMatrix = new DOMMatrixImpl(resElements);
  return resMatrix;
}
