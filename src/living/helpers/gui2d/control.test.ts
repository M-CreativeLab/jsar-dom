import { Control2D } from './control';
import { describe, jest, it, expect } from '@jest/globals';
import DOMMatrixImpl from '../../geometry/DOMMatrix';
jest.mock('@jest/globals');

class MockControl extends Control2D {
  constructor() {
    super(<any>{}, <any>{});

    interface MyCanvasRenderingContext2D extends CanvasRenderingContext2D {
      transformMatrix: any;
    }

    const mockContext: Partial<MyCanvasRenderingContext2D> = {
      transformMatrix: DOMMatrixImpl,

      setTransform: (...args: any[]) => {
        if (args.length === 6) {
          mockContext.transformMatrix = new DOMMatrixImpl(args);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          const transformInit: DOMMatrix2DInit = args[0];
          mockContext.transformMatrix = new DOMMatrixImpl([
            transformInit.m11, transformInit.m12, 0, 0,
            transformInit.m21, transformInit.m22, 0, 0,
            0, 0, 1, 0,
            transformInit.m41, transformInit.m42, 0, 1
          ]);           
        }
      },
      getTransform: () => {
        return mockContext.transformMatrix;
      },
    };
    this._renderingContext = mockContext as any;
  }
  prepareTransformMatrix(matrix: DOMMatrixImpl) {
    this.currentTransformMatrix = matrix;
  }
}

describe('Control', () => {
  it('should update currentTransformMatrix to _renderingContext.transformMatrix correctly', () => {
    const control = new MockControl();
    const matrix = new DOMMatrixImpl([
        0, 1, 0, 0,
        -1, 0, 0, 0,
        0, 0, 1, 0,
        10, 0, 0, 1
    ]);
    control.prepareTransformMatrix(matrix);
    control._updateTransform();
    
    expect((control as any)._renderingContext.getTransform()).toEqual(matrix);
  });
});
