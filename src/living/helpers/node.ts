import { XSMLBaseDocument, XSMLNode } from '../../xsml-interfaces';
import { AttrImpl } from '../attributes/Attr';
import { ElementImpl } from '../nodes/Element';
import { NodeImpl } from '../nodes/Node';
import { cloningSteps, domSymbolTree } from './internal-constants';

// https://dom.spec.whatwg.org/#concept-node-length
export function nodeLength(node: XSMLNode) {
  switch (node.nodeType) {
    case node.DOCUMENT_TYPE_NODE:
      return 0;

    case node.TEXT_NODE:
    case node.PROCESSING_INSTRUCTION_NODE:
    case node.COMMENT_NODE:
    // return node.data.length;

    default:
      return domSymbolTree.childrenCount(node);
  }
}

// https://dom.spec.whatwg.org/#concept-tree-root
export function nodeRoot(node: XSMLNode) {
  while (domSymbolTree.parent(node)) {
    node = domSymbolTree.parent(node);
  }
  return node;
}

// https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
export function isInclusiveAncestor(ancestorNode: XSMLNode, node: XSMLNode) {
  while (node) {
    if (ancestorNode === node) {
      return true;
    }
    node = domSymbolTree.parent(node);
  }
  return false;
}

// https://dom.spec.whatwg.org/#concept-tree-following
export function isFollowing(nodeA: XSMLNode, nodeB: XSMLNode) {
  if (nodeA === nodeB) {
    return false;
  }

  let current = nodeB;
  while (current) {
    if (current === nodeA) {
      return true;
    }
    current = domSymbolTree.following(current);
  }
  return false;
}

export function clone(node: NodeImpl, document?: XSMLBaseDocument, cloneChildren?: boolean) {
  if (document === undefined) {
    document = node.ownerDocument;
  }

  let copy;
  switch (node.nodeType) {
    case node.DOCUMENT_NODE:
      throw new DOMException('Document node is not allowed to be cloned.', 'NotSupportedError');
    case node.DOCUMENT_TYPE_NODE:
      throw new DOMException('DocumentType node is not allowed to be cloned.', 'NotSupportedError');
    case node.ELEMENT_NODE:
      throw new DOMException('Element node is not supported.', 'NotSupportedError');
    case node.CDATA_SECTION_NODE:
    case node.COMMENT_NODE:
    case node.PROCESSING_INSTRUCTION_NODE:
    case node.DOCUMENT_FRAGMENT_NODE:
    case node.TEXT_NODE:
      throw new DOMException('clone() is not supported.', 'NotSupportedError');

    case node.ATTRIBUTE_NODE:
      const nodeAsAttr = node as AttrImpl;
      copy = document._createAttribute({
        namespace: nodeAsAttr.namespaceURI,
        namespacePrefix: nodeAsAttr.prefix,
        localName: nodeAsAttr.localName,
        value: nodeAsAttr.value,
      });
      break;
  }

  if (node[cloningSteps]) {
    node[cloningSteps](copy, node, document, cloneChildren);
  }

  if (cloneChildren) {
    for (const child of domSymbolTree.childrenIterator(node)) {
      const childCopy = exports.clone(child, document, true);
      copy._append(childCopy);
    }
  }

  return copy;
};
