import { CodePointTest } from './type';

export const skip = (
  input: string,
  start: number,
  test: CodePointTest,
): number => {
  let end = start;
  const inputLength = input.length;
  while (end <= inputLength) {
    const cp = input.codePointAt(end);
    if (!test(cp)) {
      break;
    }
    end += 0xFFFF < cp ? 2 : 1;
  }
  return end;
};
