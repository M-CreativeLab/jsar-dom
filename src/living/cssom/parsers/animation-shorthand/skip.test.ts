import { describe, it, expect } from '@jest/globals';
import { skip } from './skip';
import { CodePointTest } from './type';
import { isWhiteSpace } from './character';

describe('skip function', () => {
  it('should skip white spaces correctly', () => {
    const input = '   a';
    const start = 0;
    const codePointTest = isWhiteSpace;
    const expected = 3;

    console.info(`${input} ${start} ${codePointTest.name} -> ${expected ? JSON.stringify(expected) : 'Error'}`);
    if (typeof expected === 'string') {
      expect(() => skip(input, start, codePointTest)).toThrowError({ code: expected });
    } else {
      expect(skip(input, start, codePointTest)).toEqual(expected);
    }
  });

  it('should skip pairs correctly', () => {
    const input = '🍎🍎🍎a';
    const start = 0;
    const codePointTest: CodePointTest = (codePoint?: number): codePoint is number => {
      return typeof codePoint === 'number' && 0xFFFF < codePoint;
    };
    const expected = 6;

    console.info(`${input} ${start} ${codePointTest.name} -> ${expected ? JSON.stringify(expected) : 'Error'}`);
    if (typeof expected === 'string') {
      expect(() => skip(input, start, codePointTest)).toThrowError({ code: expected });
    } else {
      expect(skip(input, start, codePointTest)).toEqual(expected);
    }
  });
});
