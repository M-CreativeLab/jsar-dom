import { TreePosition } from 'symbol-tree';
import { domSymbolTree } from './living/helpers/internal-constants';

let memoizeQueryTypeCounter = 0;
/**
 * Returns a version of a method that memoizes specific types of calls on the object
 *
 * - `fn` {Function} the method to be memozied
 */
export function memoizeQuery(fn: Function) {
  if (fn.length > 2) {
    return fn;
  }

  const type = memoizeQueryTypeCounter++;
  return function (...args) {
    if (!this._memoizedQueries) {
      return fn.apply(this, args);
    }

    if (!this._memoizedQueries[type]) {
      this._memoizedQueries[type] = Object.create(null);
    }

    let key;
    if (args.length === 1 && typeof args[0] === 'string') {
      key = args[0];
    } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
      key = args[0] + '::' + args[1];
    } else {
      return fn.apply(this, args);
    }

    if (!(key in this._memoizedQueries[type])) {
      this._memoizedQueries[type][key] = fn.apply(this, args);
    }
    return this._memoizedQueries[type][key];
  };
}

/**
 * Applies memoization to a query function on a prototype.
 * @param {object} proto - The prototype object.
 * @param {string} name - The name of the query function.
 */
export function applyMemoizeQueryOn(proto, name) {
  proto[name] = memoizeQuery(proto[name]);
}

/**
 * Creates an iterator that iterates over two iterators simultaneously.
 * 
 * @generator
 * @param {Iterator} first - The first iterator.
 * @param {Iterator} second - The second iterator.
 * @yields {[any, any]} - An array containing the next value from each iterator.
 */
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

/**
 * Sorts two nodes based on their tree order.
 * @param a - The first node.
 * @param b - The second node.
 * @returns 1 if b is preceding a, -1 if a is preceding b, or 0 if they are disconnected or equal.
 */
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
