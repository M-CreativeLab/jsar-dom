import { loadImplementations, implementationLoaded } from './interfaces'
import { describe, it, expect } from '@jest/globals'

describe('interfaces', () => {
  it('should successfully dynamically import all libraries', async() => {
    const isParallel = false;
    await expect(loadImplementations(isParallel)).resolves.toBeUndefined();
  });

  it('should ensure that all modules are loaded', () => {
    expect(implementationLoaded).toEqual(true);
  });
});