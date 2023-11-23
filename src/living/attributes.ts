import { AttrImpl } from './attributes/Attr';
import { ElementImpl } from './nodes/Element';
import { queueAttributeMutationRecord } from './helpers/mutation-observers';
import { HTML_NS } from './helpers/namespaces';
import { asciiLowercase } from './helpers/strings';
import { enqueueCECallbackReaction } from './helpers/custom-elements';

export function hasAttribute(element: ElementImpl, attr: AttrImpl) {
  return element._attributeList.includes(attr);
}

export function hasAttributeByName(element: ElementImpl, name: string) {
  return element._attributesByNameMap.has(name);
}

export function hasAttributeByNameNS(element: ElementImpl, namespace: string, localName: string) {
  return element._attributeList.some(attribute => {
    return attribute.localName === localName && attribute.namespaceURI === namespace;
  });
}

export function changeAttribute(element: ElementImpl, attr: AttrImpl, value: string) {
  const { localName, namespaceURI, value: oldValue } = attr;
  queueAttributeMutationRecord(element, localName, namespaceURI, oldValue);

  if (element._ceState === 'custom') {
    enqueueCECallbackReaction(element, 'attributeChangedCallback', [
      localName,
      oldValue,
      value,
      namespaceURI,
    ]);
  }

  attr.value = value;
  element._attrModified(attr._qualifiedName, value, oldValue);
}

// https://dom.spec.whatwg.org/#concept-element-attributes-append
export function appendAttribute(element: ElementImpl, attribute: AttrImpl) {
  const { localName, namespaceURI, value } = attribute;
  queueAttributeMutationRecord(element, localName, namespaceURI, null);

  if (element._ceState === 'custom') {
    enqueueCECallbackReaction(element, 'attributeChangedCallback', [
      localName,
      null,
      value,
      namespaceURI,
    ]);
  }

  const attributeList = element._attributeList;
  attributeList.push(attribute);
  attribute._element = element;

  // Sync name cache
  const name = attribute._qualifiedName;
  const cache = element._attributesByNameMap;
  let entry = cache.get(name);
  if (!entry) {
    entry = [];
    cache.set(name, entry);
  }
  entry.push(attribute);

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is added."
  element._attrModified(name, value, null);
}

// https://dom.spec.whatwg.org/#concept-element-attributes-remove
export function removeAttribute(element: ElementImpl, attribute: AttrImpl) {
  const { localName, namespaceURI, value } = attribute;
  queueAttributeMutationRecord(element, localName, namespaceURI, value);

  if (element._ceState === 'custom') {
    enqueueCECallbackReaction(element, 'attributeChangedCallback', [
      localName,
      value,
      null,
      namespaceURI,
    ]);
  }

  const attributeList = element._attributeList;
  for (let i = 0; i < attributeList.length; ++i) {
    if (attributeList[i] === attribute) {
      attributeList.splice(i, 1);
      attribute._element = null;

      // Sync name cache
      const name = attribute._qualifiedName;
      const cache = element._attributesByNameMap;
      const entry = cache.get(name);
      entry.splice(entry.indexOf(attribute), 1);
      if (entry.length === 0) {
        cache.delete(name);
      }

      // Run jsdom hooks; roughly correspond to spec's "An attribute is removed."
      element._attrModified(name, null, attribute.value);
      return;
    }
  }
}

// https://dom.spec.whatwg.org/#concept-element-attributes-replace
export function replaceAttribute(element: ElementImpl, oldAttr: AttrImpl, newAttr: AttrImpl) {
  const { localName, namespaceURI, value } = oldAttr;
  queueAttributeMutationRecord(element, localName, namespaceURI, value);

  if (element._ceState === 'custom') {
    enqueueCECallbackReaction(element, 'attributeChangedCallback', [
      localName,
      value,
      newAttr.value,
      namespaceURI,
    ]);
  }

  const attributeList = element._attributeList;
  for (let i = 0; i < attributeList.length; ++i) {
    if (attributeList[i] === oldAttr) {
      attributeList.splice(i, 1, newAttr);
      oldAttr._element = null;
      newAttr._element = element;

      // Sync name cache
      const name = newAttr._qualifiedName;
      const cache = element._attributesByNameMap;
      let entry = cache.get(name);
      if (!entry) {
        entry = [];
        cache.set(name, entry);
      }
      entry.splice(entry.indexOf(oldAttr), 1, newAttr);

      // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is changed."
      element._attrModified(name, newAttr.value, oldAttr.value);
      return;
    }
  }
}

export function getAttributeByName(element: ElementImpl, name: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
  if (element.namespaceURI === HTML_NS) {
    name = asciiLowercase(name);
  }

  const cache = element._attributesByNameMap;
  const entry = cache.get(name);
  if (!entry) {
    return null;
  }
  return entry[0];
}

export function getAttributeByNameNS(element: ElementImpl, namespace: string, localName: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
  if (namespace === '') {
    namespace = null;
  }

  const attributeList = element._attributeList;
  for (let i = 0; i < attributeList.length; i++) {
    const attr = attributeList[i];
    if (attr.localName === localName && attr.namespaceURI === namespace) {
      return attr;
    }
  }
  return null;
}

export function getAttributeValue(element: ElementImpl, localName: string) {
  const attr = getAttributeByNameNS(element, null, localName);
  if (!attr) {
    return '';
  }
  return attr.value;
}

export function getAttributeValueNS(element: ElementImpl, namespace: string, localName: string) {
  const attr = getAttributeByNameNS(element, namespace, localName);
  if (!attr) {
    return '';
  }
  return attr.value;
}

// https://dom.spec.whatwg.org/#concept-element-attributes-set
export function setAttribute(element: ElementImpl, attr: AttrImpl) {

  if (attr._element !== null && attr._element !== element) {
    throw new DOMException('The attribute is in use.', 'InUseAttributeError');
  }

  const oldAttr = getAttributeByNameNS(element, attr.namespaceURI, attr.localName);
  if (oldAttr === attr) {
    return attr;
  }
  if (oldAttr !== null) {
    replaceAttribute(element, oldAttr, attr);
  } else {
    appendAttribute(element, attr);
  }
  return oldAttr;
}

// https://dom.spec.whatwg.org/#concept-element-attributes-set-value
export function setAttributeValue(
  element: ElementImpl,
  localName: string,
  value: string,
  prefix?: string,
  namespace?: string
) {
  if (prefix === undefined) {
    prefix = null;
  }
  if (namespace === undefined) {
    namespace = null;
  }

  const attribute = getAttributeByNameNS(element, namespace, localName);
  if (attribute === null) {
    const newAttribute = element._ownerDocument._createAttribute({
      namespace,
      namespacePrefix: prefix,
      localName,
      value
    });
    appendAttribute(element, newAttribute);
    return;
  }
  changeAttribute(element, attribute, value);
}

// https://dom.spec.whatwg.org/#set-an-existing-attribute-value
export function setAnExistingAttributeValue(attribute: AttrImpl, value: string) {
  const element = attribute._element as ElementImpl;
  if (element === null) {
    attribute.value = value;
  } else {
    changeAttribute(element, attribute, value);
  }
}

// https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
export function removeAttributeByName(element: ElementImpl, name: string) {
  const attr = getAttributeByName(element, name);
  if (attr !== null) {
    removeAttribute(element, attr);
  }
  return attr;
}

// https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
export function removeAttributeByNameNS(element: ElementImpl, namespace: string, localName: string) {
  const attr = getAttributeByNameNS(element, namespace, localName);
  if (attr !== null) {
    removeAttribute(element, attr);
  }
  return attr;
}

// Needed by https://dom.spec.whatwg.org/#dom-element-getattributenames
export function attributeNames(element: ElementImpl) {
  return element._attributeList.map(a => a._qualifiedName);
}

// Needed by https://dom.spec.whatwg.org/#dom-element-hasattributes
export function hasAttributes(element: ElementImpl) {
  return element._attributeList.length > 0;
}
