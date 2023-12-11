import {
  DoubleQuote,
  SingleQuote,
  Backslash,
  isNot,
} from './character';
import { skip } from './skip';
import { $Error as Error } from './Error';

export const getString = (
  input: string,
  start: number,
): { start: number, end: number, value: string } => {
  const quote = input.codePointAt(start);
  if (quote !== DoubleQuote && quote !== SingleQuote) {
    throw new Error('InvalidQuote', input[start]);
  }
  const isNotQuoteOrBackslash = isNot(quote, Backslash);
  const fragments: Array<string> = [];
  let end = start + 1;
  while (1) {
    const fragmentStart = end;
    end = skip(input, end, isNotQuoteOrBackslash);
    fragments.push(input.slice(fragmentStart, end));
    const charCode = input.codePointAt(end);
    if (charCode === Backslash) {
      fragments.push(input.charAt(end + 1));
      end += 2;
    } else if (charCode === quote) {
      return {
        start,
        end: end + 1,
        value: fragments.join(''),
      };
    } else {
      break;
    }
  }
  throw new Error('UnterminatedString');
};
