import { domSymbolTree } from '../helpers/internal-constants';
import { NativeDocument } from '../../impl-interfaces';

import { NodeImpl } from './Node';
import ParentNodeImpl from './ParentNode';
import NonElementParentNodeImpl from './NonElementParentNode';
import { applyMixins } from '../../mixin';

export default interface DocumentFragmentImpl extends NodeImpl, NonElementParentNodeImpl, ParentNodeImpl { };
export default class DocumentFragmentImpl extends NodeImpl implements DocumentFragment {
  constructor(
    hostObject: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(hostObject, args, privateData);
    this.nodeType = NodeImpl.DOCUMENT_FRAGMENT_NODE;
  }

  getElementById(id: string): HTMLElement {
    if (id === '') {
      return null;
    }
    for (const descendant of domSymbolTree.treeIterator(this)) {
      if (descendant.nodeType === NodeImpl.ELEMENT_NODE && 
        descendant.getAttributeNS(null, 'id') === id) {
        return descendant;
      }
    }
    return null;
  }
}

applyMixins(DocumentFragmentImpl, [NonElementParentNodeImpl, ParentNodeImpl]);
