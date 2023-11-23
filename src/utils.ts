import { TreePosition } from 'symbol-tree';
import { domSymbolTree } from './living/helpers/internal-constants';

export const simultaneousIterators = function* (first, second) {
  for (; ;) {
    const firstResult = first.next();
    const secondResult = second.next();

    if (firstResult.done && secondResult.done) {
      return;
    }

    yield [
      firstResult.done ? null : firstResult.value,
      secondResult.done ? null : secondResult.value
    ];
  }
};

export const treeOrderSorter = function (a, b) {
  const compare = domSymbolTree.compareTreePosition(a, b);
  if (compare & TreePosition.PRECEDING) { // b is preceding a
    return 1;
  }
  if (compare & TreePosition.FOLLOWING) {
    return -1;
  }
  // disconnected or equal:
  return 0;
};
