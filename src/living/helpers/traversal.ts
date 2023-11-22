import { domSymbolTree } from './internal-constants';
import { HTML_NS } from './namespaces';

export function closest(e: Element, localName: string, namespace = HTML_NS) {
  while (e) {
    if (e.localName === localName && e.namespaceURI === namespace) {
      return e;
    }
    e = domSymbolTree.parent(e);
  }

  return null;
}

export function childrenByLocalName(parent: Node, localName: string, namespace = HTML_NS) {
  return domSymbolTree.childrenToArray(parent, {
    filter(node) {
      return node._localName === localName && node._namespaceURI === namespace;
    }
  });
}

export function descendantsByLocalName(parent: Node, localName: string, namespace = HTML_NS) {
  return domSymbolTree.treeToArray(parent, {
    filter(node) {
      return node._localName === localName && node._namespaceURI === namespace && node !== parent;
    }
  });
}

export function childrenByLocalNames(parent: Node, localNamesSet: Set<string>, namespace = HTML_NS) {
  return domSymbolTree.childrenToArray(parent, {
    filter(node) {
      return localNamesSet.has(node._localName) && node._namespaceURI === namespace;
    }
  });
}

export function descendantsByLocalNames(parent: Node, localNamesSet: Set<string>, namespace = HTML_NS) {
  return domSymbolTree.treeToArray(parent, {
    filter(node) {
      return localNamesSet.has(node._localName) &&
        node._namespaceURI === namespace &&
        node !== parent;
    }
  });
}

export function firstChildWithLocalName(parent: Node, localName: string, namespace = HTML_NS) {
  const iterator = domSymbolTree.childrenIterator(parent);
  for (const child of iterator) {
    if (child._localName === localName && child._namespaceURI === namespace) {
      return child;
    }
  }
  return null;
}

export function firstChildWithLocalNames(parent: Node, localNamesSet: Set<string>, namespace = HTML_NS) {
  const iterator = domSymbolTree.childrenIterator(parent);
  for (const child of iterator) {
    if (localNamesSet.has(child._localName) && child._namespaceURI === namespace) {
      return child;
    }
  }
  return null;
}

export function firstDescendantWithLocalName(parent: Node, localName: string, namespace = HTML_NS) {
  const iterator = domSymbolTree.treeIterator(parent);
  for (const descendant of iterator) {
    if (descendant._localName === localName && descendant._namespaceURI === namespace) {
      return descendant;
    }
  }
  return null;
}
