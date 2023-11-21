import { NodeImpl } from './nodes/Node';
import { SpatialDocumentImpl } from './nodes/SpatialDocument';

export function convertNodesIntoNode(document: SpatialDocumentImpl, nodes: (string | Node)[]): NodeImpl {
  if (nodes.length === 1) { // note: I'd prefer to check instanceof Node rather than string
    return typeof nodes[0] === 'string' ? document.createTextNode(nodes[0]) : nodes[0];
  }
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < nodes.length; i++) {
    fragment._append(typeof nodes[i] === 'string' ? document.createTextNode(nodes[i]) : nodes[i]);
  }
  return fragment;
}
