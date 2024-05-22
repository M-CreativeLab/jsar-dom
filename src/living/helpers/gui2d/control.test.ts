import { Control2D } from './control';
import { describe, jest, it, expect } from '@jest/globals';
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
