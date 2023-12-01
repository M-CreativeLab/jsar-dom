import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { treeOrderSorter } from './utils';
import { domSymbolTree } from './living/helpers/internal-constants';
import symbolTree from 'symbol-tree';

describe('treeOrderSorter', () => {
  let compareTreePosition: ReturnType<typeof jest.spyOn>;
  afterEach(() => {
    compareTreePosition.mockRestore();
  });

  it('should return 1 if b is preceding a', () => {
    // Arrange
    const a = {};
    const b = {};
    compareTreePosition = jest.spyOn(domSymbolTree, 'compareTreePosition')
      .mockReturnValue(symbolTree.TreePosition.PRECEDING);

    // Act
    const result = treeOrderSorter(a, b);

    // Assert
    expect(result).toBe(1);
    expect(compareTreePosition).toHaveBeenCalledWith(a, b);
  });

  it('should return -1 if b is following a', () => {
    // Arrange
    const a = {};
    const b = {};
    compareTreePosition = jest.spyOn(domSymbolTree, 'compareTreePosition')
      .mockReturnValue(symbolTree.TreePosition.FOLLOWING);

    // Act
    const result = treeOrderSorter(a, b);

    // Assert
    expect(result).toBe(-1);
    expect(compareTreePosition).toHaveBeenCalledWith(a, b);
  });

  it('should return 0 if a and b are disconnected or equal', () => {
    // Arrange
    const a = {};
    const b = {};
    compareTreePosition = jest.spyOn(domSymbolTree, 'compareTreePosition')
      .mockReturnValue(0);

    // Act
    const result = treeOrderSorter(a, b);

    // Assert
    expect(result).toBe(0);
    expect(compareTreePosition).toHaveBeenCalledWith(a, b);
  });
});
