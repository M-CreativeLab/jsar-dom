import { Control2D } from './control';
import { describe, jest, it, expect } from '@jest/globals';
import DOMMatrix from '../../geometry/DOMMatrix';
jest.mock('@jest/globals');

class MockControl extends Control2D {
  constructor() {
    super(<any>{}, <any>{});

    const mockContext: Partial<CanvasRenderingContext2D> = {
      setTransform: (...args: any[]) => {
        if (args.length === 6) {
          this.transform = new DOMMatrix(args);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          const transformInit: DOMMatrix2DInit = args[0];
          this.transform = new DOMMatrix([
            transformInit.m11, transformInit.m12, 0, 0,
            transformInit.m21, transformInit.m22, 0, 0,
            0, 0, 1, 0,
            transformInit.m41, transformInit.m42, 0, 1
          ]);           
        }
      },
      getTransform: () => {
        return this.transform;
     },
    };
    this._renderingContext = mockContext as any;
  }
  prepareTransformMatrix(matrix: DOMMatrix) {
    this.transform = matrix;
  }
  expect(matrix: DOMMatrix) {
    expect(this._renderingContext.getTransform()).toEqual(matrix);
  }
}

describe('Control', () => {
  it('should update transform correctly', () => {
    const control = new MockControl();
    const matrix = new DOMMatrix([
        0, 1, 0, 0,    
        -1, 0, 0, 0,    
        0, 0, 1, 0,    
        10, 0, 0, 1
    ]);
    control.prepareTransformMatrix(matrix);
    control._updateTransform();
    control.expect(matrix);
  });
});
