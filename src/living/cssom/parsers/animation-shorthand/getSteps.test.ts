import { expect, test } from '@jest/globals';
import { getSteps } from './getSteps';
import { CSSStepDirection } from './type';

const testGetSteps = (
  input: string,
  start: number,
  expected: string | {
    start: number,
    end: number,
    count: number,
    direction: string,
  },
): void => {
  test(`"${input}" ${start} should return ${typeof expected === 'string' ? 'error' : JSON.stringify(expected)}`, () => {
    if (typeof expected === 'string') {
      expect(() => getSteps(input, start)).toThrowError(expected);
    } else {
      expect(getSteps(input, start)).toEqual({
        start: expected.start,
        end: expected.end,
        value: {
          type: 'steps',
          stepCount: expected.count,
          direction: expected.direction as CSSStepDirection,
        },
      });
    }
  });
};

testGetSteps('(2,jump-start)', 0, { start: 0, end: 14, count: 2, direction: 'jump-start' });
testGetSteps('( 4 , jump-both )', 0, { start: 0, end: 17, count: 4, direction: 'jump-both' });
testGetSteps('( 4 , jump-bo )', 0, 'UnknownStepDirection');
testGetSteps('( 4 , jump-both ', 0, 'UnclosedParenthesis');
testGetSteps(' 4 , jump-both )', 0, 'NoOpenParenthesis');
testGetSteps('( 4 jump-both )', 0, 'UnclosedParenthesis');
testGetSteps('( 10 )', 0, { start: 0, end: 6, count: 10, direction: 'end' });
