import { describe, expect, it } from '@jest/globals';
import DOMMatrix from './DOMMatrix';

describe('DOMMatrix', () => {
  it('should return the correct value for the c property', () => {
    const matrix = new DOMMatrix(); 
    expect(matrix.c).toBe(0); 
    
    });
});