import { Mixin } from 'ts-mixer';
import { NodeImpl } from './Node';
import ParentNodeImpl from './ParentNode';
import { domSymbolTree } from '../helpers/internal-constants';

export default class DocumentFragmentImpl extends Mixin(NodeImpl, ParentNodeImpl) implements DocumentFragment {
  getElementById(elementId: string): HTMLElement {
    if (elementId === '') {
      return null;
    }
    for (const descendant of domSymbolTree.treeIterator(this)) {
      if (descendant.nodeType === NodeImpl.ELEMENT_NODE && 
        descendant.getAttributeNS(null, 'id') === elementId) {
        return descendant;
      }
    }
    return null;
  }
}
