import { Control2D } from './control';
import { describe, jest, it, expect } from '@jest/globals';
import DOMMatrixImpl from '../../geometry/DOMMatrix';
jest.mock('@jest/globals');

class MockControl extends Control2D {
  constructor() {
    super(<any>{}, <any>{});

    const mockContext: Partial<CanvasRenderingContext2D> = {
      setTransform: (...args: any[]) => {
        if (args.length === 6) {
          this.transformMatrix = new DOMMatrixImpl(args);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          const transformInit: DOMMatrix2DInit = args[0];
          this.transformMatrix = new DOMMatrixImpl([
            transformInit.m11, transformInit.m12, 0, 0,
            transformInit.m21, transformInit.m22, 0, 0,
            0, 0, 1, 0,
            transformInit.m41, transformInit.m42, 0, 1
          ]);           
        }
      },
      getTransform: () => {
        return this.transformMatrix;
     },
    };
    this._renderingContext = mockContext as any;
  }
  prepareTransformMatrix(matrix: DOMMatrixImpl) {
    this.transformMatrix = matrix;
  }
}

describe('Control', () => {
  it('should update transform correctly', () => {
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
  
  it('should return correct matrix', () => {
    const transformStr = 'rotate(90deg) translateX(10px)';
    const expectedMatrix = new DOMMatrixImpl([
      0, 1, 0, 0,   
      -1, 0, 0, 0,  
      0, 0, 1, 0,  
      0, 10, 0, 1
    ]);
    const result = Control2D._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  })
  it('should return identity matrix when no transform is applied', () => {
    const transformStr = '';
    const expectedMatrix = new DOMMatrixImpl([
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ]);
    const result = Control2D._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  });
});
