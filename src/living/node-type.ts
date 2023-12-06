import type { SpatialElement } from './nodes/SpatialElement';
import type { HTMLContentElement } from './nodes/HTMLContentElement';
import { getInterfaceWrapper } from './interfaces';

const NodeTypes = Object.freeze({
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4, // historical
  ENTITY_REFERENCE_NODE: 5, // historical
  ENTITY_NODE: 6, // historical
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12 // historical
});

export function isElementNode(node: Node): node is Element {
  return node.nodeType === NodeTypes.ELEMENT_NODE;
}

export function isAttributeNode(node: Node): node is Attr {
  return node.nodeType === NodeTypes.ATTRIBUTE_NODE;
}

export function isTextNode(node: Node): node is Text {
  return node.nodeType === NodeTypes.TEXT_NODE;
}

export function isDocumentNode(node: Node): node is Document {
  return node.nodeType === NodeTypes.DOCUMENT_NODE;
}

export function isHTMLElement(node: Node): node is HTMLElement {
  return isElementNode(node) && node instanceof getInterfaceWrapper('HTMLElement');
}

export function isHTMLContentElement(node: Node): node is HTMLContentElement {
  return isElementNode(node) && node instanceof getInterfaceWrapper('HTMLContentElement');
}

export function isSpatialElement(node: Node): node is SpatialElement {
  return isElementNode(node) && node instanceof getInterfaceWrapper('SpatialElement');
}

export default NodeTypes;
