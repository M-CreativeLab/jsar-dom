import { loadImplementations, getInterfaceWrapper } from './interfaces';
import { describe, it, expect } from '@jest/globals';

describe('interfaces', () => {
  it('should ensure that all modules are loaded', async() => {
    const isParallel = false;
    await loadImplementations(isParallel);

    expect(getInterfaceWrapper('NamedNodeMap').prototype.constructor.name).toBe('NamedNodeMapImpl');
    expect(getInterfaceWrapper('XRSession').prototype.constructor.name).toBe('XRSessionImpl');
    expect(getInterfaceWrapper('SpatialElement').prototype.constructor.name).toBe('SpatialElement');
  });
});
