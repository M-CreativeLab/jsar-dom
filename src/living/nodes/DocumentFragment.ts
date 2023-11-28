import { NodeImpl } from './Node';
import ParentNodeImpl from './ParentNode';
import { domSymbolTree } from '../helpers/internal-constants';
import { applyMixins } from '../../mixin';
import { NativeDocument } from '../../impl-interfaces';

export default interface DocumentFragmentImpl extends NodeImpl, ParentNodeImpl { };
export default class DocumentFragmentImpl extends NodeImpl implements DocumentFragment {
  constructor(
    hostObject: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(hostObject, args, privateData);
    this.nodeType = NodeImpl.DOCUMENT_FRAGMENT_NODE;
  }

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

applyMixins(DocumentFragmentImpl, [ParentNodeImpl]);
