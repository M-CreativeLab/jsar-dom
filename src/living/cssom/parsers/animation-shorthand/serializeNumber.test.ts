import { expect, test } from '@jest/globals';
import { serializeNumber } from './serializeNumber';

test('serializeNumber should serialize 0 to "0"', () => {
  expect(serializeNumber(0)).toBe('0');
});

test('serializeNumber should serialize 1 to "1"', () => {
  expect(serializeNumber(1)).toBe('1');
});

test('serializeNumber should serialize 1.1 to "1.1"', () => {
  expect(serializeNumber(1.1)).toBe('1.1');
});

test('serializeNumber should serialize 0.010 to ".01"', () => {
  expect(serializeNumber(0.010)).toBe('.01');
});
