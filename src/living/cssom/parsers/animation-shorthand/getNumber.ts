import { isNumberStart } from './character';
import { skip } from './skip';
import { $Error as Error } from './Error';

export const getNumber = (
  input: string,
  start: number,
): { start: number, end: number, value: number } => {
  const end = skip(input, start, isNumberStart);
  const literal = input.slice(start, end);
  const parts = literal.split('.');
  if (parts.length <= 2 && /^-?(?:[1-9]\d*|0)?$/.test(parts[0])) {
    return {
      start,
      end,
      value: Number(literal),
    };
  }
  throw new Error('InvalidNumber', literal);
};
