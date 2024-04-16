import { HTMLContentElement } from '../../nodes/HTMLContentElement';
import { InteractiveDynamicTexture } from './InteractiveDynamicTexture';
import { NativeDocument } from '../../../impl-interfaces';
import DOMMatrix from '../../geometry/DOMMatrix'
import { describe, it, expect } from '@jest/globals'
import { BaseWindowImpl } from '../../../agent/window';
import { loadImplementations } from '../../interfaces'

class MockInteractiveDynamicTexture extends InteractiveDynamicTexture {
  constructor() {
    super(<any>{}, <any>{}, <any>{}, <any>{});
  }
}

class MockHTMLContentElement extends HTMLContentElement {
  constructor(hostObject: NativeDocument) {
    super(hostObject, [], {
      localName: 'mock-element',
      namespace: '',
      prefix: '',
      ceState: '',
      ceDefinition: undefined,
      isValue: false
    });
  }
}

class MockBaseWindowImpl extends BaseWindowImpl {
  constructor() {
    super(<any>{});
  }
}

describe('InteractiveDynamicTexture', () => {
  it('should return correct matrix', async () => {
    await loadImplementations();
    const transformStr = "rotate(90deg) translateX(10px)"
    const expectedMatrix = new DOMMatrix([0, 1, 0, 0,   -1, 0, 0, 0,  0, 0, 1, 0,  0, 10, 0, 1]);
    const result = InteractiveDynamicTexture._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  })
  it('should return identity matrix when no transform is applied', async () => {
    loadImplementations();
    const transformStr = " "
    const expectedMatrix = new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    const result = InteractiveDynamicTexture._parserTransform(transformStr);

    expect(result).toEqual(expectedMatrix);
  });
});