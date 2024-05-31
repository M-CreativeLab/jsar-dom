import { Control2D } from './control';
import { describe, jest, it, expect, beforeAll } from '@jest/globals';
import DOMMatrixImpl from '../../geometry/DOMMatrix';
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

describe('Control', () => {
  it('should update currentTransformMatrix to _renderingContext.transformMatrix correctly', () => {
    const matrix = new DOMMatrixImpl([
        0, 1, 0, 0,
        -1, 0, 0, 0,
        0, 0, 1, 0,
        10, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    control._updateTransform();
    
    expect((control as any)._renderingContext.getTransform()).toEqual(matrix);
  });
});
describe('_calculateTransformMatrix', () => {
  it('should calculate translateX correctly', () => {
    const matrix = new DOMMatrixImpl([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    const control = new MockControl(matrix);
    const transforms = [{ type: 'translateX', value: '10', unit: 'px' }];
    const result = control._calculateTransformMatrix(transforms);
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
    const transforms = [{ type: 'rotate', value: '45', unit: 'deg' }];
    const result = control._calculateTransformMatrix(transforms);
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
    const transforms = [
      { type: 'translateX', value: '10', unit: 'px' },
      { type: 'rotate', value: '90', unit: 'deg' },
    ];
    const result = control._calculateTransformMatrix(transforms);
    const expectedMatrix = new DOMMatrixImpl([
      0, 1, 0, 0,
      -1, 0, 0, 0,
      0, 0, 1, 0,
      10, 0, 0, 1
    ]);

    expect(result).toEqual(expectedMatrix);
  });
});
