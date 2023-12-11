import { CSSAnimation, CSSCubicBezier, CSSSteps } from './type';
import { serializeNumber } from './serializeNumber';
import { shortest } from './shortest';

export const serializeAnimationValue = <Key extends keyof CSSAnimation>(
  key: Key,
  value: CSSAnimation[Key],
): string => {
  if (value === 'unset') {
    return '';
  }
  if (typeof value === 'object') {
    const timingFunction = value as CSSCubicBezier | CSSSteps;
    if (timingFunction.type === 'cubic-bezier') {
      return `cubic-bezier(${timingFunction.value.map(serializeNumber).join(',')})`;
    }
    return `steps(${timingFunction.stepCount},${timingFunction.direction})`;
  }
  if (typeof value === 'number') {
    switch (key) {
      case 'duration':
      case 'delay':
        return shortest(
          `${serializeNumber(value)}ms`,
          `${serializeNumber(value * 0.001)}s`,
        );
      default:
        return serializeNumber(value);
    }
  }
  return `${value}`;
};
