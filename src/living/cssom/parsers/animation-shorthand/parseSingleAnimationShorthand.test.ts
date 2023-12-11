import { expect, test } from '@jest/globals';
import { parseSingleAnimationShorthand } from './parseSingleAnimationShorthand';
import { CSSAnimation } from './type';
import { fillAnimation } from './fillAnimation';

const testParseSingleAnimationShorthand = (
  input: string,
  expected: string | Partial<CSSAnimation> & {
    name: string,
    start?: number,
    end?: number,
  },
): void => {
  test(`${input} should parse as ${typeof expected === 'string' ? 'error' : JSON.stringify(expected)}`, () => {
    if (typeof expected === 'string') {
      expect(() => parseSingleAnimationShorthand(input)).toThrowError(expected);
    } else {
      const { start = 0, end = input.length, ...value } = expected;
      const result = parseSingleAnimationShorthand(input, 0);
      expect(result).toEqual({
        value: fillAnimation(value),
        start,
        end,
      });
    }
  });
};

testParseSingleAnimationShorthand('none', { name: 'none' });
testParseSingleAnimationShorthand('3s MyAnimation', {
  name: 'MyAnimation',
  duration: 3000,
});
testParseSingleAnimationShorthand('3s 3s', 'NoName');
testParseSingleAnimationShorthand('3s ease-in MyAnimation', {
  name: 'MyAnimation',
  duration: 3000,
  timingFunction: 'ease-in',
});
testParseSingleAnimationShorthand('0.3s 100ms ease-in "ease"', {
  name: 'ease',
  duration: 300,
  delay: 100,
  timingFunction: 'ease-in',
});
testParseSingleAnimationShorthand('100ms ease \'ease-in\' 0.3s', {
  name: 'ease-in',
  duration: 100,
  delay: 300,
  timingFunction: 'ease',
});
testParseSingleAnimationShorthand('100ms \'ease\' ease-in 0.3s', {
  name: 'ease',
  duration: 100,
  delay: 300,
  timingFunction: 'ease-in',
});
testParseSingleAnimationShorthand('100ms \'ease\' \'ease-in\' 0.3s', 'UnexpectedValue');
testParseSingleAnimationShorthand('100ms 0.3s 0.3s MyAnimation', 'UnexpectedValue');
testParseSingleAnimationShorthand('100ms 0.3em MyAnimation', 'InvalidUnit');
testParseSingleAnimationShorthand('3s cubic-bezier(0.3,0.4,0.5,0.6) cubic-bezier', {
  name: 'cubic-bezier',
  duration: 3000,
  timingFunction: {
    type: 'cubic-bezier',
    value: [0.3, 0.4, 0.5, 0.6],
  },
});
testParseSingleAnimationShorthand('  3s steps(4,jump-both) steps  , ', {
  name: 'steps',
  duration: 3000,
  timingFunction: {
    type: 'steps',
    stepCount: 4,
    direction: 'jump-both',
  },
  start: 2,
  end: 29,
});
