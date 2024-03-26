import { describe, expect, it } from '@jest/globals';
import DOMMatrix from './DOMMatrix';
import exp from 'node:constants';

describe('DOMMatrix', () => {
  it('should return the correct value for the c property', () => {
    const matrix = new DOMMatrix(); 
    expect(matrix.c).toBe(0); 
    });

    it('create a DOMMatrix from a sequence with 6 elements', () => {
      const matrix = new DOMMatrix([1, 2, 3, 4, 5, 6]);
      expect(matrix.a).toBe(1);
      expect(matrix.b).toBe(2);
      expect(matrix.c).toBe(3);
      expect(matrix.d).toBe(4);
      expect(matrix.e).toBe(5);
      expect(matrix.f).toBe(6);
      expect(matrix.m11).toBe(1);
      expect(matrix.m12).toBe(2);
      expect(matrix.m21).toBe(3);
      expect(matrix.m22).toBe(4);
      expect(matrix.m41).toBe(5);
      expect(matrix.m42).toBe(6);
    });

    it('create a DOMMatrix from a sequence with 16 elements', () => {
      const matrix = new DOMMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      expect(matrix.m11).toBe(1);
      expect(matrix.m12).toBe(2);
      expect(matrix.m13).toBe(3);
      expect(matrix.m14).toBe(4);
      expect(matrix.m21).toBe(5);
      expect(matrix.m22).toBe(6);
      expect(matrix.m23).toBe(7);
      expect(matrix.m24).toBe(8);
      expect(matrix.m31).toBe(9);
      expect(matrix.m32).toBe(10);
      expect(matrix.m33).toBe(11);
      expect(matrix.m41).toBe(13);
      expect(matrix.m42).toBe(14);
      expect(matrix.m43).toBe(15);
      expect(matrix.m44).toBe(16);
    });

    it('create a DOMMatrix from omittable arguments', () => {
      const matrix = new DOMMatrix([1, 0, 0, 1, 0, 0]);
      expect(matrix.m11).toBe(1);
      expect(matrix.m12).toBe(0);
      expect(matrix.m21).toBe(0);
      expect(matrix.m22).toBe(1);
      expect(matrix.m41).toBe(0);
      expect(matrix.m42).toBe(0);
    });

});