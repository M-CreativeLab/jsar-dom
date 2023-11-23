import { NodeImpl } from '../nodes/Node';
import NodeIteratorImpl from './NodeIterator';

export const FILTER_ACCEPT = 1; // NodeFilter.FILTER_ACCEPT
export const FILTER_REJECT = 2; // NodeFilter.FILTER_REJECT
export const FILTER_SKIP = 3; // NodeFilter.FILTER_SKIP

export function filter(nodeIteratorOrTreeWalkerImpl: NodeIteratorImpl, nodeImpl: NodeImpl) {
  if (nodeIteratorOrTreeWalkerImpl._active) {
    throw new DOMException(
      'Recursive node filtering',
      'InvalidStateError'
    );
  }

  const n = nodeImpl.nodeType - 1;
  if (!((1 << n) & nodeIteratorOrTreeWalkerImpl.whatToShow)) {
    return exports.FILTER_SKIP;
  }

  // Saving in a variable is important so we don't accidentally call it as a method later.
  const { filter } = nodeIteratorOrTreeWalkerImpl;
  if (filter === null) {
    return exports.FILTER_ACCEPT;
  }

  nodeIteratorOrTreeWalkerImpl._active = true;

  let result: number;
  // https://github.com/whatwg/dom/issues/494
  try {
    if (typeof filter === 'function') {
      result = filter(nodeImpl);
    } else if (typeof filter.acceptNode === 'function') {
      result = filter.acceptNode(nodeImpl);
    }
  } finally {
    nodeIteratorOrTreeWalkerImpl._active = false;
  }
  return result;
}
