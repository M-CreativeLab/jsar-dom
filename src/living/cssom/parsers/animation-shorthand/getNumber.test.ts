import { expect, test } from '@jest/globals';
import { getNumber } from './getNumber';

const testGetNumber = (
  input: string,
  start: number,
  expected: null | {
    start: number,
    end: number,
    value: number,
  },
): void => {
  test(`"${input}" ${start} should return ${expected ? JSON.stringify(expected) : 'error'}`, () => {
    if (expected) {
      expect(getNumber(input, start)).toEqual(expected);
    } else {
      expect(() => getNumber(input, start)).toThrow();
    }
  });
};

testGetNumber('12.34', 0, { start: 0, end: 5, value: 12.34 });
testGetNumber('-12.34', 0, { start: 0, end: 6, value: -12.34 });
testGetNumber('0.123', 0, { start: 0, end: 5, value: 0.123 });
testGetNumber('.123', 0, { start: 0, end: 4, value: 0.123 });
testGetNumber('0.0.123', 0, null);
testGetNumber('00.123', 0, null);
