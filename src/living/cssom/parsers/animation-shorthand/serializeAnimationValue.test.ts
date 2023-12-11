import { expect, test } from '@jest/globals';
import { serializeAnimationValue } from './serializeAnimationValue';
import { CSSAnimation } from './type';

const testSerializeAnimationValue = <Key extends keyof CSSAnimation>(
  key: Key,
  value: CSSAnimation[Key],
  expected: string,
): void => {
  test(`${key}: ${value} should serialize to ${expected}`, () => {
    expect(serializeAnimationValue(key, value)).toBe(expected);
  });
};

testSerializeAnimationValue('name', 'foo', 'foo');
testSerializeAnimationValue('duration', 1, '1ms');
testSerializeAnimationValue('duration', 10, '10ms');
testSerializeAnimationValue('duration', 100, '.1s');
testSerializeAnimationValue('duration', 1000, '1s');
testSerializeAnimationValue('delay', 1, '1ms');
testSerializeAnimationValue('delay', 10, '10ms');
testSerializeAnimationValue('delay', 100, '.1s');
testSerializeAnimationValue('delay', 1000, '1s');
testSerializeAnimationValue('iterationCount', 10, '10');
testSerializeAnimationValue('iterationCount', 'unset', '');
testSerializeAnimationValue(
  'timingFunction',
  'ease-in',
  'ease-in'
);
testSerializeAnimationValue(
  'timingFunction',
  { type: 'steps', stepCount: 3, direction: 'jump-both' },
  'steps(3,jump-both)'
);
testSerializeAnimationValue(
  'timingFunction',
  { type: 'cubic-bezier', value: [0.01, 0.1, 0.7, 1.0] },
  'cubic-bezier(.01,.1,.7,1)'
);
