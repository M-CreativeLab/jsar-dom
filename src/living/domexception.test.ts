import { describe, expect, it } from '@jest/globals';
import DOMExceptionImpl from './domexception';

describe('DOMExceptionImpl', () => {
  it('should create a DOMException with the correct code', () => {
    const message = 'Test message';
    const name = 'INDEX_SIZE_ERR';
    const exception = new DOMExceptionImpl(message, name);

    expect(exception.message).toBe(message);
    expect(exception.name).toBe(name);
    expect(exception.code).toBe(DOMExceptionImpl[name]);
  });
});
