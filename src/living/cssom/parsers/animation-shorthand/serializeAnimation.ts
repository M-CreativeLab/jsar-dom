import { CSSAnimation } from './type';
import { fillAnimation } from './fillAnimation';
import { serializeAnimationValue } from './serializeAnimationValue';

export const serializeAnimation = (animation: Partial<CSSAnimation> & { name: string }): string => {
  const result: Array<string> = [];
  const filled = fillAnimation(animation);
  for (const key of Object.keys(filled) as Array<keyof CSSAnimation>) {
    const serialized = serializeAnimationValue(key, filled[key]);
    if (serialized) {
      result.push(serialized);
    }
  }
  return result.join(' ');
};
