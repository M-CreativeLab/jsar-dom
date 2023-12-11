import { expect, test } from '@jest/globals';
import { getString } from './getString';

const testGetString = (
  input: string,
  start: number,
  expected: string | {
    start: number,
    end: number,
    value: string,
  },
): void => {
  test(`"${input}" ${start} should return ${typeof expected === 'string' ? 'error' : JSON.stringify(expected)}`, () => {
    if (typeof expected === 'string') {
      expect(() => getString(input, start)).toThrowError(expected);
    } else {
      expect(getString(input, start)).toEqual(expected);
    }
  });
};

testGetString('"abc"', 0, { start: 0, end: 5, value: 'abc' });
testGetString('abc', 0, 'InvalidQuote');
testGetString('"abc', 0, 'UnterminatedString');
testGetString('"abc\\"def"', 0, { start: 0, end: 10, value: 'abc"def' });
testGetString('\'abc\'', 0, { start: 0, end: 5, value: 'abc' });
testGetString('\'abc', 0, 'UnterminatedString');
testGetString('\'abc\\"def\'', 0, { start: 0, end: 10, value: 'abc"def' });
