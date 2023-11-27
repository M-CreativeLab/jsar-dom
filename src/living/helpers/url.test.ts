import { describe, it, expect } from '@jest/globals';
import { join } from './url';

describe('join', () => {
  it('should join sub path with base path', () => {
    const sub = 'sub';
    const base = '/base';
    const expected = '/base/sub';
    expect(join(sub, base)).toBe(expected);
  });

  it('should join sub path with base URL', () => {
    const sub = 'sub';
    const base = 'http://example.com/base';
    const expected = 'http://example.com/base/sub';
    expect(join(sub, base)).toBe(expected);
  });

  it('should handle base URL with trailing slash', () => {
    const sub = 'sub';
    const base = 'http://example.com/base/';
    const expected = 'http://example.com/base/sub';
    expect(join(sub, base)).toBe(expected);
  });

  it('should handle sub path with leading slash', () => {
    const sub = '/sub';
    const base = '/base';
    const expected = '/base/sub';
    expect(join(sub, base)).toBe(expected);
  });

  it('should handle sub path with leading and trailing slashes', () => {
    const sub = '/sub/';
    const base = '/base/';
    const expected = '/base/sub/';
    expect(join(sub, base)).toBe(expected);
  });
});