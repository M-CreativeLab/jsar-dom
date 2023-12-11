import { expect, test } from '@jest/globals';
import { getCustomIdent } from './getCustomIdent';

const testGetCustomIdent = (
  input: string,
  start: number,
  expected: null | {
    start: number,
    end: number,
    value: string,
  },
): void => {
  test(`"${input}" ${start} should return ${expected ? JSON.stringify(expected) : 'error'}`, () => {
    if (expected) {
      expect(getCustomIdent(input, start)).toEqual(expected);
    } else {
      expect(() => getCustomIdent(input, start)).toThrow();
    }
  });
};

testGetCustomIdent('"xyz"', 0, null);
testGetCustomIdent('xyz', 0, { start: 0, end: 3, value: 'xyz' });
testGetCustomIdent('-xyz', 0, { start: 0, end: 4, value: '-xyz' });
testGetCustomIdent('--xyz', 0, { start: 0, end: 5, value: '--xyz' });
testGetCustomIdent('_xyz', 0, { start: 0, end: 4, value: '_xyz' });
testGetCustomIdent('_xyz\\?', 0, { start: 0, end: 6, value: '_xyz?' });
testGetCustomIdent('_xyz\\3F', 0, { start: 0, end: 7, value: '_xyz?' });
testGetCustomIdent('_xyz\\3f', 0, { start: 0, end: 7, value: '_xyz?' });
