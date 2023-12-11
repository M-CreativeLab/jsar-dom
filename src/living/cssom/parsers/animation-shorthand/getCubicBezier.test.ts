import { describe, it, expect } from '@jest/globals';
import { getCubicBezier } from './getCubicBezier';

const test = (
  input: string,
  start: number,
  expected: string | {
    start: number,
    end: number,
    value: [number, number, number, number],
  },
): void => {
  it(`${input} ${start} -> ${expected ? JSON.stringify(expected) : 'Error'}`, function () {
    if (typeof expected == 'string') {
      expect(() => getCubicBezier(input, start)).toThrowError(expected);
    } else {
      const result = getCubicBezier(input, start);
      expect(result).toEqual({
        start: expected.start,
        end: expected.end,
        value: {
          type: 'cubic-bezier',
          value: expected.value,
        },
      });
    }
  });
};

describe('getCubicBezier', () => {
  test('(0,0,1,1)', 0, { start: 0, end: 9, value: [0, 0, 1, 1] });
  test('( 0.1 , 0.2 , 0.3 , 0.4 )', 0, { start: 0, end: 25, value: [0.1, 0.2, 0.3, 0.4] });
  test('( 0.68, -0.82, 0.42, 1.52 )', 0, { start: 0, end: 27, value: [0.68, -0.82, 0.42, 1.52] });
  test('( 0.1 , 0.2 , 0.3 , 0.4 ', 0, 'UnclosedParenthesis');
  test(' 0.1 , 0.2 , 0.3 , 0.4 )', 0, 'NoOpenParenthesis');
  test('(0,0,1 1)', 0, 'NoComma');
});
