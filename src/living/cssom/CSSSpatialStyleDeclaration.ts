import { parseSpatialCss } from '../helpers/spatial-css-parser';
import { autoCreatePropertyValue, type PropertyValue } from './parsers';
import {
  type CSSSpatialStyleProperties,
  mixinWithSpatialStyleProperties
} from './spatial-properties';

type PropertyPriority = 'important' | null;

export default interface CSSSpatialStyleDeclaration extends CSSSpatialStyleProperties { }
export default class CSSSpatialStyleDeclaration {
  _length = 0;
  _dirty = true;
  _values: { [key: string]: PropertyValue } = {};
  _importants: { [key: string]: PropertyPriority } = {};
  _onChange: (cssText?: string) => void;

  constructor(onChange?: (cssText?: string) => void) {
    this._onChange = (cssText: string) => {
      if (typeof onChange === 'function') {
        onChange(cssText);
      }
      this._dirty = true;
    };
  }

  get cssText(): string {
    const properties: string[] = [];
    for (let i = 0; i < this._length; i++) {
      const name = this[i];
      const value = this.getPropertyValue(name);
      let priority = this.getPropertyPriority(name);
      if (priority != null && priority !== undefined && priority !== '') {
        priority = ` !${priority}`;
      }
      properties.push([name, ': ', value, priority, ';'].join(''));
    }
    return properties.join(' ');
  }
  set cssText(value: string) {
    this._values = {};
    this._importants = {};
    Array.prototype.splice.call(this, 0, this.length);

    let dummyRule;
    try {
      dummyRule = parseSpatialCss('#bogus{' + value + '}').stylesheet.rules[0];
    } catch (err) {
      // malformed css, just return
      return;
    }

    // var rule_length = dummyRule.length;
    // var name;
    // for (i = 0; i < rule_length; ++i) {
    //   name = dummyRule[i];
    //   this.setProperty(
    //     dummyRule[i],
    //     dummyRule.getPropertyValue(name),
    //     dummyRule.getPropertyPriority(name)
    //   );
    // }
    // this._onChange(this.cssText);
  }

  get length(): number {
    return this._length;
  }
  set length(value: number) {
    for (let i = value; i < this._length; i++) {
      delete this[i];
    }
    this._length = value;
  }

  get parentRule(): CSSRule {
    return null;
  }

  getPropertyValue(name: string): string {
    const v = this._getPropertyValue(name);
    if (v === null) {
      return '';
    } else {
      return v.str;
    }
  }

  _getPropertyValue(name: string): PropertyValue {
    if (!this._values.hasOwnProperty(name)) {
      return null;
    }
    return this._values[name];
  }

  setProperty(name: string, value: string, priority?: string) {
    if (value === undefined) {
      return;
    }
    if (value === null || value === '') {
      this.removeProperty(name);
      return;
    }
    const isCustomProperty = name.indexOf('--') === 0;
    if (isCustomProperty) {
      this._setProperty(
        name,
        autoCreatePropertyValue(value),
        priority === 'important' ? 'important' : null);
      return;
    }
    const lowercaseName = name.toLowerCase();
    // TODO
    // if (!allProperties.has(lowercaseName) && !allExtraProperties.has(lowercaseName)) {
    //   return;
    // }

    this[lowercaseName] = value;
    this._importants[lowercaseName] = priority === 'important' ? 'important' : null;
  }

  _setProperty(name: string, value: PropertyValue, priority?: PropertyPriority) {
    if (value === undefined) {
      return;
    }
    if (value === null || value.str === '') {
      this.removeProperty(name);
      return;
    }
    if (this._values[name]) {
      // Property already exist. Overwrite it.
      const index = Array.prototype.indexOf.call(this, name);
      if (index < 0) {
        this[this._length] = name;
        this._length++;
      }
    } else {
      // New property.
      this[this._length] = name;
      this._length++;
    }
    this._values[name] = value;
    this._importants[name] = priority;
    this._onChange(this.cssText);
  }

  removeProperty(name: string): string {
    if (!this._values.hasOwnProperty(name)) {
      return '';
    }

    const prevValue = this._values[name];
    delete this._values[name];
    delete this._importants[name];

    const index = Array.prototype.indexOf.call(this, name);
    if (index < 0) {
      return prevValue.str;
    }

    // That's what WebKit and Opera do
    Array.prototype.splice.call(this, index, 1);

    // That's what Firefox does
    //this[index] = ""

    this._onChange(this.cssText);
    return prevValue.str;
  }

  getPropertyPriority(name: string): string {
    return this._importants[name] === 'important' ? 'important' : '';
  }

  getPropertyCSSValue() {
    // TODO
    return;
  }

  getPropertyShorthand() {
    // TODO
    return;
  }

  isPropertyImplicit() {
    // TODO
    return;
  }

  item(index: number | string) {
    if (typeof index === 'string') {
      index = parseInt(index, 10);
    }
    if (index < 0 || index >= this.length) {
      return '';
    }
    return this[index];
  }
}

mixinWithSpatialStyleProperties(CSSSpatialStyleDeclaration.prototype);
