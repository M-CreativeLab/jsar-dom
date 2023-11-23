import { NativeDocument } from '../../impl-interfaces';
import { getAttributeValue, hasAttributeByName } from '../attributes';
import { setAttributeValue } from '../attributes';
import OrderedSet from '../helpers/ordered-set';
import { asciiLowercase } from '../helpers/strings';
import { ElementImpl } from './Element';

function validateTokens(...tokens: string[]) {
  for (const token of tokens) {
    if (token === '') {
      throw new DOMException('The token provided must not be empty.', 'SyntaxError');
    }
  }
  for (const token of tokens) {
    if (/[\t\n\f\r ]/.test(token)) {
      throw new DOMException(
        'The token provided contains HTML space characters, which are not valid in tokens.',
        'InvalidCharacterError'
      );
    }
  }
}

export default class DOMTokenListImpl implements DOMTokenList {
  [index: number]: string;

  _tokenSet = new OrderedSet();
  _element: ElementImpl;
  _attributeLocalName: string;
  _supportedTokens: Set<string>;
  _dirty = true;

  constructor(
    private nativeDocument: NativeDocument,
    args,
    privateData: {
      element: ElementImpl;
      attributeLocalName: string;
      supportedTokens?: Set<string>;
    }
  ) {
    this._element = privateData.element;
    this._attributeLocalName = privateData.attributeLocalName;
    this._supportedTokens = privateData.supportedTokens;
  }

  _validationSteps(token: string) {
    if (!this._supportedTokens) {
      throw new TypeError(`${this._attributeLocalName} attribute has no supported tokens`);
    }
    const lowerToken = asciiLowercase(token);
    return this._supportedTokens.has(lowerToken);
  }

  contains(token: string): boolean {
    this._syncWithElement();
    return this._tokenSet.contains(token);
  }

  item(index: number): string {
    this._syncWithElement();
    if (index >= this._tokenSet.size) {
      return null;
    }
    return this._tokenSet.get(index);
  }

  add(...tokens: string[]): void {
    for (const token of tokens) {
      validateTokens(token);
    }
    this._syncWithElement();
    for (const token of tokens) {
      this._tokenSet.append(token);
    }
    this._updateSteps();
  }

  remove(...tokens: string[]): void {
    for (const token of tokens) {
      validateTokens(token);
    }
    this._syncWithElement();
    this._tokenSet.remove(...tokens);
    this._updateSteps();
  }

  replace(token: string, newToken: string): boolean {
    validateTokens(token, newToken);
    this._syncWithElement();
    if (!this._tokenSet.contains(token)) {
      return false;
    }
    this._tokenSet.replace(token, newToken);
    this._updateSteps();
    return true;
  }

  supports(token: string): boolean {
    return this._validationSteps(token);
  }

  toggle(token: string, force?: boolean): boolean {
    validateTokens(token);
    this._syncWithElement();
    if (this._tokenSet.contains(token)) {
      if (force === undefined || force === false) {
        this._tokenSet.remove(token);
        this._updateSteps();
        return false;
      }
      return true;
    }
    if (force === undefined || force === true) {
      this._tokenSet.append(token);
      this._updateSteps();
      return true;
    }
    return false;
  }

  forEach(_callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: any): void {
    throw new TypeError('DOMTokenList.prototype.forEach is not implemented yet');
  }

  _attrModified() {
    this._dirty = true;
  }

  _syncWithElement() {
    if (!this._dirty) {
      return;
    }
    const val = getAttributeValue(this._element, this._attributeLocalName);
    if (val == null) {
      this._tokenSet.empty();
    } else {
      this._tokenSet = OrderedSet.parse(val);
    }
  }

  _validationStep(token: string) {
    if (!this._supportedTokens) {
      throw new TypeError(`${this._attributeLocalName} attribute has no supported tokens`);
    }
    const lowerToken = asciiLowercase(token);
    return this._supportedTokens.has(lowerToken);
  }

  _updateSteps() {
    if (!hasAttributeByName(this._element, this._attributeLocalName) && this._tokenSet.isEmpty()) {
      return;
    }
    setAttributeValue(this._element, this._attributeLocalName, this._tokenSet.serialize());
  }

  _serializeSteps() {
    return getAttributeValue(this._element, this._attributeLocalName);
  }

  get length() {
    this._syncWithElement();
    return this._tokenSet.size;
  }

  get value(): string {
    return this._serializeSteps();
  }
  set value(value: string) {
    setAttributeValue(this._element, this._attributeLocalName, value);
  }
}
