import { CSSAnimation } from './type';
import { parseSingleAnimationShorthand } from './parseSingleAnimationShorthand';
import { isWhiteSpace, Comma } from './character';
import { skip } from './skip';

export const parseAnimationShorthand = function* (
  input: string,
): Generator<CSSAnimation> {
  let start = 0;
  while (start < input.length) {
    const result = parseSingleAnimationShorthand(input, start);
    yield result.value;
    start = result.end;
    start = skip(input, start, isWhiteSpace);
    if (input.codePointAt(start) === Comma) {
      start = skip(input, start + 1, isWhiteSpace);
    } else {
      break;
    }
  }
};
