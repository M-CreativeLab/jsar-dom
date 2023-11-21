"use strict";
import DOMException from 'domexception';
import { HTML_NS } from './namespaces';
import { asciiLowercase } from './strings';
import { ElementImpl } from '../nodes/element';
import { AttrImpl } from '../attributes/attr';

// const { queueAttributeMutationRecord } = require("./helpers/mutation-observers");
// const { enqueueCECallbackReaction } = require("./helpers/custom-elements");

// The following three are for https://dom.spec.whatwg.org/#concept-element-attribute-has. We don't just have a
// predicate tester since removing that kind of flexibility gives us the potential for better future optimizations.

/* eslint-disable no-restricted-properties */

export const hasAttribute = function (element: ElementImpl, A: AttrImpl) {
  return element._attributeList.includes(A);
};

export const hasAttributeByName = function (element, name) {
  return element._attributesByNameMap.has(name);
};

export const hasAttributeByNameNS = function (element, namespace, localName) {
  return element._attributeList.some(attribute => {
    return attribute._localName === localName && attribute._namespace === namespace;
  });
};

// https://dom.spec.whatwg.org/#concept-element-attributes-change
export const changeAttribute = (element, attribute, value) => {
  const { _localName, _namespace, _value } = attribute;

  // TODO: Mutation observers
  // queueAttributeMutationRecord(element, _localName, _namespace, _value);
  // if (element._ceState === "custom") {
  //   enqueueCECallbackReaction(element, "attributeChangedCallback", [
  //     _localName,
  //     _value,
  //     value,
  //     _namespace
  //   ]);
  // }

  attribute._value = value;

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is changed."
  element._attrModified(attribute._qualifiedName, value, _value);
};

// https://dom.spec.whatwg.org/#concept-element-attributes-append
export const appendAttribute = function (element, attribute) {
  const { _localName, _namespace, _value } = attribute;

  // TODO: Mutation observers
  // queueAttributeMutationRecord(element, _localName, _namespace, null);
  // if (element._ceState === "custom") {
  //   enqueueCECallbackReaction(element, "attributeChangedCallback", [
  //     _localName,
  //     null,
  //     _value,
  //     _namespace
  //   ]);
  // }

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
  element._attrModified(name, _value, null);
};

export const removeAttribute = function (element, attribute) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove

  const { _localName, _namespace, _value } = attribute;

  // TODO: Mutation observers
  // queueAttributeMutationRecord(element, _localName, _namespace, _value);
  // if (element._ceState === "custom") {
  //   enqueueCECallbackReaction(element, "attributeChangedCallback", [
  //     _localName,
  //     _value,
  //     null,
  //     _namespace
  //   ]);
  // }

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
      element._attrModified(name, null, attribute._value);

      return;
    }
  }
};

export const replaceAttribute = function (element, oldAttr, newAttr) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-replace

  const { _localName, _namespace, _value } = oldAttr;

  // TODO: Mutation observers
  // queueAttributeMutationRecord(element, _localName, _namespace, _value);
  // if (element._ceState === "custom") {
  //   enqueueCECallbackReaction(element, "attributeChangedCallback", [
  //     _localName,
  //     _value,
  //     newAttr._value,
  //     _namespace
  //   ]);
  // }

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
      element._attrModified(name, newAttr._value, oldAttr._value);

      return;
    }
  }
};

export const getAttributeByName = function (element: ElementImpl, name: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name

  if (element._namespaceURI === HTML_NS) {
    name = asciiLowercase(name);
  }

  const cache = element._attributesByNameMap;
  const entry = cache.get(name);
  if (!entry) {
    return null;
  }

  return entry[0];
};

export const getAttributeByNameNS = function (element: ElementImpl, namespace: string, localName: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace

  if (namespace === "") {
    namespace = null;
  }

  const attributeList = element._attributeList;
  for (let i = 0; i < attributeList.length; ++i) {
    const attr = attributeList[i];
    if (attr.namespaceURI === namespace && attr.localName === localName) {
      return attr;
    }
  }
  return null;
};

// Both of the following functions implement https://dom.spec.whatwg.org/#concept-element-attributes-get-value.
// Separated them into two to keep symmetry with other functions.
export const getAttributeValue = function (element: ElementImpl, localName: string) {
  const attr = getAttributeByNameNS(element, null, localName);
  if (!attr) {
    return '';
  }
  return attr.value;
};

export const getAttributeValueNS = function (element: ElementImpl, namespace: string, localName: string) {
  const attr = getAttributeByNameNS(element, namespace, localName);
  if (!attr) {
    return '';
  }
  return attr.value;
};

export const setAttribute = function (element: ElementImpl, attr: AttrImpl) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-set
  if (attr.ownerElement !== null && attr.ownerElement !== element as unknown as Element) {
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
};

export const setAttributeValue = function (element: ElementImpl, localName: string, value, prefix: string, namespace: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-set-value

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
};

// https://dom.spec.whatwg.org/#set-an-existing-attribute-value
export const setAnExistingAttributeValue = (attribute: AttrImpl, value: string) => {
  const element = attribute.ownerDocument;
  if (element === null) {
    attribute._setValue(value);
  } else {
    changeAttribute(element, attribute, value);
  }
};

export const removeAttributeByName = function (element: ElementImpl, name: string) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
  const attr = getAttributeByName(element, name);
  if (attr !== null) {
    removeAttribute(element, attr);
  }
  return attr;
};

export const removeAttributeByNameNS = function (element: ElementImpl, namespace, localName) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
  const attr = getAttributeByNameNS(element, namespace, localName);
  if (attr !== null) {
    removeAttribute(element, attr);
  }
  return attr;
};

export const attributeNames = function (element: ElementImpl) {
  // Needed by https://dom.spec.whatwg.org/#dom-element-getattributenames
  return element._attributeList.map(a => a._qualifiedName);
};

export const hasAttributes = function (element: ElementImpl) {
  // Needed by https://dom.spec.whatwg.org/#dom-element-hasattributes
  return element._attributeList.length > 0;
};
