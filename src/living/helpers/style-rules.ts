import { NodeImpl } from '../nodes/node';

export const invalidateStyleCache = (elementImpl: NodeImpl) => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};
