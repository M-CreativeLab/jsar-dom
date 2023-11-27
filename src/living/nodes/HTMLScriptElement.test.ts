import { describe, expect, it } from '@jest/globals';
import HTMLScriptElementImpl from './HTMLScriptElement';

describe('HTMLScriptElement.supports', () => {
  it('should return supports value', () => {
    expect(HTMLScriptElementImpl.supports('classic')).toBe(true);
    expect(HTMLScriptElementImpl.supports('module')).toBe(true);
    expect(HTMLScriptElementImpl.supports('importmap')).toBe(false);
    expect(HTMLScriptElementImpl.supports('speculationrules')).toBe(false);
  });
});
