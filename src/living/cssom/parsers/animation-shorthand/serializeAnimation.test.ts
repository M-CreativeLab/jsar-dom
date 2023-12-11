import { expect, test } from '@jest/globals';
import { serializeAnimation } from './serializeAnimation';
import { CSSAnimation } from './type';

const testSerializeAnimation = (
  input: Partial<CSSAnimation> & { name: string },
  expected: string,
): void => {
  test(`${JSON.stringify(input)} should serialize to ${expected}`, () => {
    expect(serializeAnimation(input)).toBe(expected);
  });
};

testSerializeAnimation({ name: 'abc' }, 'abc');
testSerializeAnimation(
  {
    name: 'abc',
    duration: 200,
    timingFunction: 'ease-in-out',
  },
  '.2s ease-in-out abc'
);
testSerializeAnimation(
  {
    name: 'abc',
    duration: 200,
    delay: 50,
    iterationCount: 'infinite',
    timingFunction: 'ease-in-out',
    playState: 'running',
    fillMode: 'forwards',
  },
  '.2s 50ms ease-in-out infinite forwards running abc'
);
