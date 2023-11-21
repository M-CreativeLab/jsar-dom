import { NodeImpl } from '../nodes/Node';
import { domSymbolTree } from './internal-constants';

export function childTextContent(node: NodeImpl) {
  let result = "";
  const iterator = domSymbolTree.childrenIterator(node);
  for (const child of iterator) {
    if (child.nodeType === NodeImpl.TEXT_NODE ||
      // The CDataSection extends Text.
      child.nodeType === NodeImpl.CDATA_SECTION_NODE) {
      result += child.data;
    }
  }
  return result;
}
