import DocumentFragmentImpl from './nodes/DocumentFragment';
import { SpatialDocumentImpl } from './nodes/SpatialDocument';

export function convertNodesIntoNode<T = Node>(document: SpatialDocumentImpl, nodes: (string | Node)[]): T {
  if (nodes.length === 1) { // note: I'd prefer to check instanceof Node rather than string
    return (typeof nodes[0] === 'string' ? document.createTextNode(nodes[0]) : nodes[0]) as T;
  }
  const fragment = document.createDocumentFragment() as DocumentFragmentImpl;
  for (let i = 0; i < nodes.length; i++) {
    const child = typeof nodes[i] === 'string' ? document.createTextNode(nodes[i] as string) : nodes[i];
    fragment.appendChild(child as Node);
  }
  return fragment as T;
}
