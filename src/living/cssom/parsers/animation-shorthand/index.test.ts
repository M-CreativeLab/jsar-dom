import { expect, test } from '@jest/globals';
import { parse } from './index';

const testParse = (
  input: string,
  expected: ReturnType<typeof parse>,
): void => {
  test(`${input} should parse as ${JSON.stringify(expected)}`, () => {
    expect(parse(input)).toEqual(expected);
  });
};

testParse(
  'play1 .8s steps(10) infinite, play2 .8s steps(10) infinite',
  [
    {
      duration: 800,
      delay: 'unset',
      timingFunction: {
        direction: 'end',
        stepCount: 10,
        type: 'steps',
      },
      iterationCount: 'infinite',
      direction: 'unset',
      fillMode: 'unset',
      playState: 'unset',
      name: 'play1',
    },
    {
      duration: 800,
      delay: 'unset',
      timingFunction: {
        direction: 'end',
        stepCount: 10,
        type: 'steps',
      },
      iterationCount: 'infinite',
      direction: 'unset',
      fillMode: 'unset',
      playState: 'unset',
      name: 'play2',
    },
  ]
);
