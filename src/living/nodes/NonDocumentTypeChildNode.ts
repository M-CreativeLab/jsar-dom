import { domSymbolTree } from '../helpers/internal-constants';
import { NodeImpl } from './Node';

export default class NonDocumentTypeChildNodeImpl implements NonDocumentTypeChildNode {
  get nextElementSibling(): Element {
    for (const sibling of domSymbolTree.nextSiblingsIterator(this)) {
      if (sibling.nodeType === NodeImpl.ELEMENT_NODE) {
        return sibling;
      }
    }
    return null;
  }

  get previousElementSibling() {
    for (const sibling of domSymbolTree.previousSiblingsIterator(this)) {
      if (sibling.nodeType === NodeImpl.ELEMENT_NODE) {
        return sibling;
      }
    }
    return null;
  }
}
