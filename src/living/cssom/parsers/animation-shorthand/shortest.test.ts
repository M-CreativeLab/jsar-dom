import { expect, test } from '@jest/globals';
import { shortest } from './shortest';

test('shortest function should return the shortest string when given multiple strings', () => {
  expect(shortest('a', 'b', 'c', 'd')).toBe('a');
  expect(shortest('aa', 'b', 'c', 'd')).toBe('b');
  expect(shortest('aa', 'bb', 'c', 'd')).toBe('c');
  expect(shortest('aa', 'bb', 'cc', 'd')).toBe('d');
  expect(shortest('aa', 'bb', 'cc', 'dd')).toBe('aa');
});
