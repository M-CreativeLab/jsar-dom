import {
  CSSAnimation,
  CSSTimingFunctionKeyword,
  CSSAnimationPlayState,
  CSSAnimationFillMode,
  CSSAnimationDirection,
} from './type';
import {
  DoubleQuote,
  SingleQuote,
  OpenParenthesis,
  isWhiteSpace,
  isNumberStart,
  isAlpha,
} from './character';
import { skip } from './skip';
import { getString } from './getString';
import { getCustomIdentOrNull } from './getCustomIdent';
import { fillAnimation } from './fillAnimation';
import {
  TimingFunctionKeyword,
  AnimationPlayState,
  AnimationFillMode,
  AnimationDirection,
} from './keyword';
import { getNumber } from './getNumber';
import { getCubicBezier } from './getCubicBezier';
import { getSteps } from './getSteps';
import { $Error as Error } from './Error';

export const parseSingleAnimationShorthand = (
  input: string,
  startFrom = 0,
): { start: number, end: number, value: CSSAnimation } => {
  const result: Partial<CSSAnimation> = {};
  const set = <Key extends keyof CSSAnimation>(
    value: CSSAnimation[Key],
    ...keys: Array<Key>
  ): void => {
    for (const key of keys) {
      if (!(key in result)) {
        result[key] = value;
        return;
      }
    }
    throw new Error('UnexpectedValue', `${value} (${keys.join(', ')})`);
  };
  let index = skip(input, startFrom, isWhiteSpace);
  const inputLength = input.length;
  const start = index;
  let lastEnd = index;
  while (index < inputLength) {
    index = skip(input, index, isWhiteSpace);
    const cp = input.codePointAt(index);
    if (isNumberStart(cp)) {
      const { value, end } = getNumber(input, index);
      index = skip(input, end, isAlpha);
      const unit = input.slice(end, index).toLowerCase();
      if (unit === 'ms') {
        set(value, 'duration', 'delay');
      } else if (unit === 's') {
        set(value * 1000, 'duration', 'delay');
      } else if (unit === '') {
        set(value, 'iterationCount');
      } else {
        throw new Error('InvalidUnit');
      }
    } else if (cp === DoubleQuote || cp === SingleQuote) {
      const { value, end } = getString(input, index);
      set(value, 'name');
      index = end;
    } else {
      const ident = getCustomIdentOrNull(input, index);
      if (ident) {
        const { value, end } = ident;
        index = end;
        if (value === 'infinite') {
          set(value, 'iterationCount');
        } else if (value === 'cubic-bezier') {
          if (input.codePointAt(end) === OpenParenthesis) {
            const result = getCubicBezier(input, index);
            set(result.value, 'timingFunction');
            index = result.end;
          } else {
            set(value, 'name');
          }
        } else if (value === 'steps') {
          if (input.codePointAt(end) === OpenParenthesis) {
            const result = getSteps(input, index);
            set(result.value, 'timingFunction');
            index = result.end;
          } else {
            set(value, 'name');
          }
        } else if (TimingFunctionKeyword.has(value)) {
          set(value as CSSTimingFunctionKeyword, 'timingFunction', 'name');
        } else if (AnimationFillMode.has(value)) {
          set(value as CSSAnimationFillMode, 'fillMode', 'name');
        } else if (AnimationDirection.has(value)) {
          set(value as CSSAnimationDirection, 'direction', 'name');
        } else if (AnimationPlayState.has(value)) {
          set(value as CSSAnimationPlayState, 'playState', 'name');
        } else {
          set(value, 'name');
        }
      } else {
        break;
      }
    }
    lastEnd = index;
  }
  if (!result.name) {
    if (result.fillMode === 'none') {
      result.name = 'none';
      delete result.fillMode;
    } else {
      throw new Error('NoName');
    }
  }
  return {
    start,
    end: lastEnd,
    value: fillAnimation(result as Partial<CSSAnimation> & { name: string }),
  };
};
