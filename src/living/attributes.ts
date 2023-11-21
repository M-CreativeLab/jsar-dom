import { AttrImpl } from './attributes/attr';
import { ElementImpl } from './nodes/element';
import { queueAttributeMutationRecord } from './helpers/mutation-observers';
import { HTML_NS } from './helpers/namespaces';
import { asciiLowercase } from './helpers/strings';

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
    // TODO: Implement this custom element behavior.
  }

  attr.value = value;
  // element._attrModified(attribute._qualifiedName, value, _value);
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
