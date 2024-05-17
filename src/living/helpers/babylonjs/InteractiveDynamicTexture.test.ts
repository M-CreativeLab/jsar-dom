import { InteractiveDynamicTexture } from './InteractiveDynamicTexture';
import DOMMatrix from '../../geometry/DOMMatrix'
import { describe, it, expect } from '@jest/globals'
import { loadImplementations } from '../../interfaces'

describe('InteractiveDynamicTexture', () => {
  it('should return correct matrix', async () => {
    await loadImplementations();
    const transformStr = "rotate(90deg) translateX(10px)"
    const expectedMatrix = new DOMMatrix([0, 1, 0, 0,   -1, 0, 0, 0,  0, 0, 1, 0,  0, 10, 0, 1]);
    const result = InteractiveDynamicTexture._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  })
  it('should return identity matrix when no transform is applied', async () => {
    await loadImplementations();
    const transformStr = " "
    const expectedMatrix = new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    const result = InteractiveDynamicTexture._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  });
});