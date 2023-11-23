const hasOwnProperty = Object.prototype.hasOwnProperty;
import * as namedPropertiesTracker from './named-properties-tracker';
import NODE_TYPE from './node-type';
import { treeOrderSorter } from '../utils';
import HTMLCollectionImpl from './nodes/HTMLCollection';
import { ElementImpl } from './nodes/Element';
import { NodeImpl } from './nodes/Node';
import { BaseWindowImpl } from '../agent/window';
import { HTMLElementImpl } from './nodes/HTMLElement';

function isNamedPropertyElement(element: Element): boolean {
  // (for the name attribute)

  // use hasOwnProperty to make sure contentWindow comes from the prototype,
  // and is not set directly on the node by a script.
  if ('contentWindow' in element && !hasOwnProperty.call(element, 'contentWindow')) {
    return true;
  }

  switch (element.nodeName) {
    case 'A':
    case 'AREA':
    case 'EMBED':
    case 'FORM':
    case 'FRAMESET':
    case 'IMG':
    case 'OBJECT':
      return true;
    default:
      return false;
  }
}

function namedPropertyResolver(window: Window, name: string, values: () => Set<Node>): any {
  function getResult(): HTMLElement[] {
    const results: HTMLElement[] = [];

    for (const node of values().keys()) {
      if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
        continue;
      }

      const element = node as HTMLElement;
      if (element.getAttributeNS(null, 'id') === name) {
        results.push(element);
      } else if (element.getAttributeNS(null, 'name') === name && isNamedPropertyElement(element)) {
        results.push(element);
      }
    }
    results.sort(treeOrderSorter);
    return results;
  }

  const document = window.document;
  const objects = new HTMLCollectionImpl((window as BaseWindowImpl)._nativeDocument, [], {
    element: document.documentElement as unknown as ElementImpl,
    query: getResult,
  })

  const { length } = objects;
  for (let i = 0; i < length; ++i) {
    const node = objects[i];

    if ('contentWindow' in node && !hasOwnProperty.call(node, 'contentWindow') &&
      node.getAttributeNS(null, 'name') === name) {
      return node.contentWindow;
    }
  }

  if (length === 0) {
    return undefined;
  }
  if (length === 1) {
    return objects[0];
  }
  return objects;
}

export function initializeWindow(window: Window, windowProxy: Window) {
  namedPropertiesTracker.create(window, windowProxy, namedPropertyResolver.bind(null));
}

export function elementAttributeModified(
  element: ElementImpl,
  name: string,
  value: string,
  oldValue: string
) {
  if (!(element as unknown as ElementImpl)._attached) {
    return;
  }
  const useName = isNamedPropertyElement(element);
  if (name === 'id' || (name === 'name' && useName)) {
    const tracker = namedPropertiesTracker.get(element._ownerDocument._defaultView);

    // (tracker will be null if the document has no Window)
    if (tracker) {
      if (name === 'id' && (!useName || element.getAttributeNS(null, 'name') !== oldValue)) {
        tracker.untrack(oldValue, element);
      }
      if (name === 'name' && element.getAttributeNS(null, 'id') !== oldValue) {
        tracker.untrack(oldValue, element);
      }
      tracker.track(value, element);
    }
  }
}

export function nodeAttachedToDocument(node: NodeImpl) {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return;
  }
  const tracker = namedPropertiesTracker.get(node._ownerDocument._defaultView);
  if (!tracker) {
    return;
  }

  const element = node as unknown as Element;
  tracker.track(element.getAttributeNS(null, "id"), element);
  if (isNamedPropertyElement(element)) {
    tracker.track(element.getAttributeNS(null, "name"), element);
  }
}

export function nodeDetachedFromDocument(node: NodeImpl) {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return;
  }
  const tracker = namedPropertiesTracker.get(node._ownerDocument._defaultView);
  if (!tracker) {
    return;
  }

  const element = node as unknown as Element;
  tracker.untrack(element.getAttributeNS(null, 'id'), element);
  if (isNamedPropertyElement(element)) {
    tracker.untrack(element.getAttributeNS(null, 'name'), element);
  }
}
