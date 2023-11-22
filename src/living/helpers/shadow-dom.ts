'use strict';

import { nodeRoot } from './node';
import { HTML_NS } from './namespaces';
import { domSymbolTree } from './internal-constants';
import { NodeImpl } from '../nodes/Node';
import { signalSlotList, queueMutationObserverMicrotask } from './mutation-observers';
import { ElementImpl } from '../nodes/Element';

// Valid host element for ShadowRoot.
// Defined in: https://dom.spec.whatwg.org/#dom-element-attachshadow
const VALID_HOST_ELEMENT_NAME = new Set([
  'article',
  'aside',
  'blockquote',
  'body',
  'div',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'main',
  'nav',
  'p',
  'section',
  'span'
]);

export function isValidHostElementName(name: string) {
  return VALID_HOST_ELEMENT_NAME.has(name);
}

// Use an approximation by checking the presence of nodeType instead of instead of using the isImpl from
// '../generated/Node' to avoid introduction of circular dependencies.
export function isNode(nodeImpl: NodeImpl) {
  return Boolean(nodeImpl && 'nodeType' in nodeImpl);
}

// Use an approximation by checking the value of nodeType and presence of nodeType host instead of instead
// of using the isImpl from '../generated/ShadowRoot' to avoid introduction of circular dependencies.
export function isShadowRoot(nodeImpl: NodeImpl) {
  return Boolean(nodeImpl && nodeImpl.nodeType === NodeImpl.prototype.DOCUMENT_FRAGMENT_NODE && 'host' in nodeImpl);
}

// https://dom.spec.whatwg.org/#concept-slotable
export function isSlotable(nodeImpl: NodeImpl) {
  return nodeImpl && (nodeImpl.nodeType === NodeImpl.prototype.ELEMENT_NODE || nodeImpl.nodeType === NodeImpl.prototype.TEXT_NODE);
}

export function isSlot(nodeImpl: NodeImpl) {
  if (!nodeImpl) {
    return false;
  }
  if (nodeImpl.nodeType !== NodeImpl.prototype.ELEMENT_NODE) {
    return false;
  }
  const nodeAsElementImpl = nodeImpl as ElementImpl;
  return nodeAsElementImpl.namespaceURI === HTML_NS && nodeAsElementImpl.localName === 'slot';
}

// https://dom.spec.whatwg.org/#concept-shadow-including-inclusive-ancestor
export function isShadowInclusiveAncestor(ancestor, node) {
  while (isNode(node)) {
    if (node === ancestor) {
      return true;
    }

    if (isShadowRoot(node)) {
      node = node.host;
    } else {
      node = domSymbolTree.parent(node);
    }
  }

  return false;
}

// https://dom.spec.whatwg.org/#retarget
export function retarget(a: NodeImpl, b: NodeImpl) {
  while (true) {
    if (!isNode(a)) {
      return a;
    }

    const aRoot = nodeRoot(a) as NodeImpl;
    if (
      !isShadowRoot(aRoot) ||
      (isNode(b) && isShadowInclusiveAncestor(aRoot, b))
    ) {
      return a;
    }

    a = (nodeRoot(a) as NodeImpl)._host;
  }
}

// https://dom.spec.whatwg.org/#get-the-parent
export function getEventTargetParent(eventTarget, event) {
  // _getTheParent will be missing for Window, since it doesn't have an impl class and we don't want to pollute the
  // user-visible global scope with a _getTheParent value. TODO: remove this entire function and use _getTheParent
  // directly, once Window gets split into impl/wrapper.
  return eventTarget._getTheParent ? eventTarget._getTheParent(event) : null;
}

// https://dom.spec.whatwg.org/#concept-shadow-including-root
export function shadowIncludingRoot(node: NodeImpl) {
  const root = nodeRoot(node) as NodeImpl;
  return isShadowRoot(root) ? shadowIncludingRoot(root._host) : root;
}

// https://dom.spec.whatwg.org/#assign-a-slot
export function assignSlot(slotable) {
  const slot = findSlot(slotable);

  if (slot) {
    assignSlotable(slot);
  }
}

// https://dom.spec.whatwg.org/#assign-slotables
export function assignSlotable(slot) {
  const slotables = findSlotable(slot);

  let shouldFireSlotChange = false;

  if (slotables.length !== slot._assignedNodes.length) {
    shouldFireSlotChange = true;
  } else {
    for (let i = 0; i < slotables.length; i++) {
      if (slotables[i] !== slot._assignedNodes[i]) {
        shouldFireSlotChange = true;
        break;
      }
    }
  }

  if (shouldFireSlotChange) {
    signalSlotChange(slot);
  }

  slot._assignedNodes = slotables;

  for (const slotable of slotables) {
    slotable._assignedSlot = slot;
  }
}

// https://dom.spec.whatwg.org/#assign-slotables-for-a-tree
export function assignSlotableForTree(root) {
  for (const slot of domSymbolTree.treeIterator(root)) {
    if (isSlot(slot)) {
      assignSlotable(slot);
    }
  }
}

// https://dom.spec.whatwg.org/#find-slotables
export function findSlotable(slot) {
  const result = [];

  const root = nodeRoot(slot) as NodeImpl;
  if (!isShadowRoot(root)) {
    return result;
  }

  for (const slotable of domSymbolTree.treeIterator(root._host)) {
    const foundSlot = findSlot(slotable);

    if (foundSlot === slot) {
      result.push(slotable);
    }
  }

  return result;
}

// https://dom.spec.whatwg.org/#find-flattened-slotables
export function findFlattenedSlotables(slot) {
  const result = [];

  const root = nodeRoot(slot) as NodeImpl;
  if (!isShadowRoot(root)) {
    return result;
  }

  const slotables = findSlotable(slot);

  if (slotables.length === 0) {
    for (const child of domSymbolTree.childrenIterator(slot)) {
      if (isSlotable(child)) {
        slotables.push(child);
      }
    }
  }

  for (const node of slotables) {
    if (isSlot(node) && isShadowRoot(nodeRoot(node) as NodeImpl)) {
      const temporaryResult = findFlattenedSlotables(node);
      result.push(...temporaryResult);
    } else {
      result.push(node);
    }
  }

  return result;
}

// https://dom.spec.whatwg.org/#find-a-slot
export function findSlot(slotable, openFlag?) {
  const { parentNode: parent } = slotable;

  if (!parent) {
    return null;
  }

  const shadow = parent._shadowRoot;

  if (!shadow || (openFlag && shadow.mode !== 'open')) {
    return null;
  }

  for (const child of domSymbolTree.treeIterator(shadow)) {
    if (isSlot(child) && child.name === slotable._slotableName) {
      return child;
    }
  }

  return null;
}

// https://dom.spec.whatwg.org/#signal-a-slot-change
export function signalSlotChange(slot) {
  if (!signalSlotList.some(entry => entry === slot)) {
    signalSlotList.push(slot);
  }

  queueMutationObserverMicrotask();
}

// https://dom.spec.whatwg.org/#concept-shadow-including-descendant
export function* shadowIncludingInclusiveDescendantsIterator(node) {
  yield node;

  if (node._shadowRoot) {
    yield* shadowIncludingInclusiveDescendantsIterator(node._shadowRoot);
  }

  for (const child of domSymbolTree.childrenIterator(node)) {
    yield* shadowIncludingInclusiveDescendantsIterator(child);
  }
}

// https://dom.spec.whatwg.org/#concept-shadow-including-descendant
export function* shadowIncludingDescendantsIterator(node) {
  if (node._shadowRoot) {
    yield* shadowIncludingInclusiveDescendantsIterator(node._shadowRoot);
  }

  for (const child of domSymbolTree.childrenIterator(node)) {
    yield* shadowIncludingInclusiveDescendantsIterator(child);
  }
}
