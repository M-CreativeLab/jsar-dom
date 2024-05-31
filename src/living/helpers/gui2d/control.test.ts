import { Control2D } from './control';
import { describe, jest, it, expect, beforeAll } from '@jest/globals';
import DOMMatrixImpl from '../../geometry/DOMMatrix';
import { TransformFunction } from '../../cssom/parsers'
jest.mock('@jest/globals');

class MockControl extends Control2D {
  constructor(matrix) {
    super(<any>{}, <any>{});

    interface MyCanvasRenderingContext2D extends CanvasRenderingContext2D {
      transformMatrix: any;
    }

    const mockContext: Partial<MyCanvasRenderingContext2D> = {
      transformMatrix: DOMMatrixImpl,

      setTransform: (...args: any[]) => {
        mockContext.transformMatrix = args[0]
      },
      getTransform: () => {
        return mockContext.transformMatrix;
      },
    };
    this._renderingContext = mockContext as any;
    this.currentTransformMatrix = matrix;
  }  
}

describe('_updateTransform', () => {
  it('should update currentTransformMatrix to _renderingContext.transformMatrix correctly', () => {
    const matrix = new DOMMatrixImpl([
        0, 1, 0, 0,
        -1, 0, 0, 0,
        0, 0, 1, 0,
        10, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    control.updateTransform();
    expect((control as any)._renderingContext.getTransform()).toEqual(matrix);
  });
});

describe('rotate', () => {
  it('should rotate the transform matrix correctly', () => {
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const angle = 45;
    const result = control.rotate(matrix, angle);
    const cosValue = Number(Math.cos(angle * Math.PI / 180).toFixed(2));
    const sinValue = Number(Math.sin(angle * Math.PI / 180).toFixed(2));
    const expectedMatrix = new DOMMatrixImpl([
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
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const x = 10;
    const y = 20;
    const z = 30;
    const result = control.translate(matrix, x, y, z);
    const expectedMatrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
    expect(result).toEqual(expectedMatrix);
  });
});

describe('calculateTransformMatrix', () => {
  it('should calculate translateX correctly', () => {
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const transforms: TransformFunction[] = [
      new TransformFunction('translateX', 10, 'px')
    ];
    const result = control.calculateTransformMatrix(transforms);
    const expectedMatrix = new DOMMatrixImpl([
      1, 0, 0, 0,  
      0, 1, 0, 0,  
      0, 0, 1, 0,  
      10, 0, 0, 1
    ]);
    expect(result).toEqual(expectedMatrix);
  });

  it('should calculate rotate correctly', () => {
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const transformFunctions: TransformFunction[] = [
      new TransformFunction('rotate', 45, 'deg')
    ];
    const result = control.calculateTransformMatrix(transformFunctions);
    const cosValue = Number(Math.cos(45 * Math.PI / 180).toFixed(2));
    const sinValue = Number(Math.sin(45 * Math.PI / 180).toFixed(2));
    const expectedMatrix = new DOMMatrixImpl([
      cosValue, sinValue, 0, 0,  
      -sinValue, cosValue, 0, 0,  
      0, 0, 1, 0,   
      0, 0, 0, 1
    ]);
    expect(result).toEqual(expectedMatrix);
  });

  it('should calculate multiple transforms correctly', () => {
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const transforms: TransformFunction[] = [
      new TransformFunction('translateX', 10, 'px'),
      new TransformFunction('rotate', 90, 'deg')
    ];
    const result = control.calculateTransformMatrix(transforms);
    const expectedMatrix = new DOMMatrixImpl([
      0, 1, 0, 0,
      -1, 0, 0, 0,
      0, 0, 1, 0,
      10, 0, 0, 1
    ]);
    expect(result).toEqual(expectedMatrix);
  });
});
