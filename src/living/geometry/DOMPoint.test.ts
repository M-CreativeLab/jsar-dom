import { describe, expect, it } from '@jest/globals';
import DOMPointImpl from './DOMPoint';

describe('DOMPoint', () => {
  it('creates a DOMPoint', () => {
    const point = new DOMPointImpl();
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
    expect(point.z).toBe(0);
    expect(point.w).toBe(1);
  });

  it('creates a DOMPoint from specific parameters', () => {
    const point = new DOMPointImpl(1, 0, 1, 0);
    expect(point.x).toBe(1);
    expect(point.y).toBe(0);
    expect(point.z).toBe(1);
    expect(point.w).toBe(0);
  });

  it('supports the static method "fromPoint"', () => {
    const point = DOMPointImpl.fromPoint({ x: 100, y: 200, z: 0, w: 1 });
    expect(point.x).toBe(100);
    expect(point.y).toBe(200);
    expect(point.z).toBe(0);
    expect(point.w).toBe(1);
  });

  it('supports value changes', () => {
    const point = DOMPointImpl.fromPoint({ x: 100, y: 200, z: 0, w: 1 });
    point.x = 50;
    point.y = 10;
    expect(point.x).toBe(50);
    expect(point.y).toBe(10);
  });

  it('supports toJSON()', () => {
    const point = new DOMPointImpl(1, 0, 1, 0);
    expect(point.toJSON()).toStrictEqual({
      x: 1,
      y: 0,
      z: 1,
      w: 0
    });
  });
});
