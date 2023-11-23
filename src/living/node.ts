import { domSymbolTree } from './helpers/internal-constants';
import { HTML_NS } from './helpers/namespaces';
import OrderedSet from './helpers/ordered-set';
import { asciiCaseInsensitiveMatch, asciiLowercase } from './helpers/strings';
import DocumentFragmentImpl from './nodes/DocumentFragment';
import HTMLCollectionImpl from './nodes/HTMLCollection';
import { NodeImpl } from './nodes/Node';
import { SpatialDocumentImpl } from './nodes/SpatialDocument';

// https://dom.spec.whatwg.org/#concept-getElementsByClassName
export function listOfElementsWithClassNames(classNames: string, root: NodeImpl) {
  const classes = OrderedSet.parse(classNames);
  if (classes.size === 0) {
    return new HTMLCollectionImpl(root._hostObject, [], { element: root, query: () => [] });
  }

  return new HTMLCollectionImpl(root._hostObject, [], {
    element: root,
    query: () => {
      const isQuirksMode = root._ownerDocument.compatMode === 'BackCompat';
      return domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
            return false;
          }
          const { classList } = node;
          if (isQuirksMode) {
            for (const className of classes) {
              if (!classList.tokenSet.some(cur => asciiCaseInsensitiveMatch(cur, className))) {
                return false;
              }
            }
          } else {
            for (const className of classes) {
              if (!classList.tokenSet.contains(className)) {
                return false;
              }
            }
          }
          return true;
        }
      });
    }
  });
}

// https://dom.spec.whatwg.org/#concept-getelementsbytagname
export function listOfElementsWithQualifiedName(qualifiedName: string, root: NodeImpl) {
  if (qualifiedName === '*') {
    return new HTMLCollectionImpl(root._hostObject, [], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter: node => node.nodeType === NodeImpl.ELEMENT_NODE && node !== root
      })
    });
  }

  if (root._ownerDocument._parsingMode === 'html') {
    const lowerQualifiedName = asciiLowercase(qualifiedName);
    return new HTMLCollectionImpl(root._hostObject, [], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
            return false;
          }
          if (node._namespaceURI === HTML_NS) {
            return node._qualifiedName === lowerQualifiedName;
          }
          return node._qualifiedName === qualifiedName;
        }
      })
    });
  }

  return new HTMLCollectionImpl(root._hostObject, [], {
    element: root,
    query: () => domSymbolTree.treeToArray(root, {
      filter(node) {
        if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
          return false;
        }
        return node._qualifiedName === qualifiedName;
      }
    })
  });
}

// https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
export function listOfElementsWithNamespaceAndLocalName(
  namespace: string,
  localName: string,
  root: NodeImpl
) {
  if (namespace === '') {
    namespace = null;
  }
  if (namespace === '*' && localName === '*') {
    return new HTMLCollectionImpl(root._hostObject, [], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter: node => node.nodeType === NodeImpl.ELEMENT_NODE && node !== root
      })
    });
  }

  if (namespace === '*') {
    return new HTMLCollectionImpl(root._hostObject, [], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
            return false;
          }
          return node._localName === localName;
        }
      })
    });
  }

  if (localName === '*') {
    return new HTMLCollectionImpl(root._hostObject, [], {
      element: root,
      query: () => domSymbolTree.treeToArray(root, {
        filter(node) {
          if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
            return false;
          }
          return node._namespaceURI === namespace;
        }
      }),
    });
  }

  return new HTMLCollectionImpl(root._hostObject, [], {
    element: root,
    query: () => domSymbolTree.treeToArray(root, {
      filter(node) {
        if (node.nodeType !== NodeImpl.ELEMENT_NODE || node === root) {
          return false;
        }
        return node._localName === localName && node._namespaceURI === namespace;
      }
    })
  });
}

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


