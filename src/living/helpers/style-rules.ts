import { NodeImpl } from '../nodes/Node';

export const invalidateStyleCache = (elementImpl: NodeImpl) => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};
