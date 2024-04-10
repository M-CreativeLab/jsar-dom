import { loadImplementations } from './interfaces'
import { describe, it, expect } from '@jest/globals'

describe('interfaces', () => {
  it('should successfully dynamically import all libraries', async() => {
    const isParallel = true;
    await expect(loadImplementations(isParallel)).resolves.toBeUndefined();
    return 0;
  })
});