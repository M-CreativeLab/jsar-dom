import { some } from './some';

export function sum(a: number, b: number) {
  return a + b;
}

export function sumWithSome(a: number) {
  return sum(a, some);
}
