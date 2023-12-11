import { getNumber } from './getNumber';
import { getCustomIdent } from './getCustomIdent';
import {
  isWhiteSpace,
  Comma,
  CloseParenthesis,
  OpenParenthesis,
} from './character';
import { skip } from './skip';
import { StepDirection } from './keyword';
import { CSSSteps, CSSStepDirection } from './type';
import { $Error as Error } from './Error';

export const getSteps = (
  input: string,
  start: number,
): { start: number, end: number, value: CSSSteps } => {
  if (input.codePointAt(start) !== OpenParenthesis) {
    throw new Error('NoOpenParenthesis');
  }
  let end = skip(input, start + 1, isWhiteSpace);
  const count = getNumber(input, end);
  const value: CSSSteps = {
    type: 'steps',
    stepCount: count.value,
    direction: 'end',
  };
  end = skip(input, count.end, isWhiteSpace);
  if (input.codePointAt(end) === Comma) {
    end = skip(input, end + 1, isWhiteSpace);
    const direction = getCustomIdent(input, end);
    if (!StepDirection.has(direction.value)) {
      throw new Error('UnknownStepDirection', direction.value);
    }
    value.direction = direction.value as CSSStepDirection;
    end = direction.end;
  }
  end = skip(input, end, isWhiteSpace);
  if (input.codePointAt(end) !== CloseParenthesis) {
    throw new Error('UnclosedParenthesis');
  }
  return { start, end: end + 1, value };
};
