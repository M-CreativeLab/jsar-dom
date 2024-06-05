import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';
import { hslToRgb } from '../utils/color-space';
import { colorNames, namedColors } from './named-colors';
import { defineSpatialProperty } from '../spatial-properties/helper';
import * as animationShorthandParser from './animation-shorthand/index';

const integerRegEx = /^[-+]?[0-9]+$/;
const numberRegEx = /^[-+]?[0-9]*\.?[0-9]+$/;
const lengthRegEx = /^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$/;
const percentRegEx = /^[-+]?[0-9]*\.?[0-9]+%$/;
const timespanRegEx = /^[-+]?[0-9]*\.?[0-9]+(ms|s)$/;
const urlRegEx = /^url\(\s*([^)]*)\s*\)$/;
const stringRegEx = /^("[^"]*"|'[^']*')$/;
const colorRegEx1 = /^#([0-9a-fA-F]{3,4}){1,2}$/;
const colorRegEx2 = /^rgb\(([^)]*)\)$/;
const colorRegEx3 = /^rgba\(([^)]*)\)$/;
const calcRegEx = /^calc\(([^)]*)\)$/;
const colorRegEx4 =
  /^hsla?\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*(,\s*(-?\d+|-?\d*.\d+)\s*)?\)/;
const angleRegEx = /^([-+]?[0-9]*\.?[0-9]+)(deg|grad|rad)$/;

export enum CSSValueType {
  INTEGER = 1,
  NUMBER,
  LENGTH,
  PERCENT,
  TIMESPAN,
  URL,
  COLOR,
  STRING,
  ANGLE,
  KEYWORD,
  NULL_OR_EMPTY_STR,
  CALC,
  SET,
  UNKNOWN = 999,
}

const SupportedLengthUnitsArray = ['px', 'em', 'rem'] as const;
export type SupportedLengthUnit = typeof SupportedLengthUnitsArray[number];

export class PropertyValue<T = any> {
  str: string;
  type: CSSValueType;
  value: T;

  static NULL_OR_EMPTY_STR = new PropertyValue(CSSValueType.NULL_OR_EMPTY_STR, '', null);
  static createInteger(str: string, radix: number = 10): PropertyIntegerValue {
    const value = parseInt(str, radix);
    return new PropertyValue(CSSValueType.INTEGER, String(value), value);
  }

  static createNumber(str: string): PropertyNumberValue {
    const value = parseFloat(str);
    return new PropertyValue(CSSValueType.NUMBER, String(value), value);
  }

  static createLength(number: number, unit: SupportedLengthUnit): PropertyLengthValue {
    return new PropertyValue(
      CSSValueType.LENGTH,
      `${number}${unit || ''}`,
      { number, unit });
  }

  static createPercentage(value: number): PropertyPercentageValue {
    return new PropertyValue(CSSValueType.PERCENT, `${value}%`, value);
  }

  static createTimespan(value: number): PropertyTimespanValue {
    return new PropertyValue(CSSValueType.TIMESPAN, `${value / 1000}s`, value);
  }

  static createUrl(str: string, urlSource: string): PropertyUrlValue {
    return new PropertyValue(CSSValueType.URL, `url(${str})`, urlSource);
  }

  static createString(str: string): PropertyStringValue {
    return new PropertyValue(CSSValueType.STRING, str, str.slice(1, -1));
  }

  static createColor(r: number, g: number, b: number, a?: number): PropertyColorValue {
    let colorStr: string;
    if (typeof a === 'number') {
      colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      colorStr = `rgb(${r}, ${g}, ${b})`;
    }
    return new PropertyValue(CSSValueType.COLOR, colorStr, { r, g, b, a });
  }

  static createAngle(degree: number): PropertyAngleValue {
    return new PropertyValue(CSSValueType.ANGLE, `${degree}deg`, degree);
  }

  static createKeyword(str: string): PropertyKeywordValue {
    return new PropertyValue(CSSValueType.KEYWORD, str, str);
  }

  static createSet(values: PropertyValue[]): PropertySetValue {
    const setStr = values.map(v => v.str).join(' ');
    return new PropertyValue(CSSValueType.SET, setStr, values);
  }

  constructor(type: CSSValueType, str: string, value: T) {
    this.type = type;
    this.str = str;
    this.value = value;
  }

  isNumberValue(): this is PropertyNumberValue {
    return this.type === CSSValueType.NUMBER;
  }

  isIntegerValue(): this is PropertyIntegerValue {
    return this.type === CSSValueType.INTEGER;
  }

  isLengthValue(): this is PropertyLengthValue {
    return this.type === CSSValueType.LENGTH;
  }

  isPercentageValue(): this is PropertyPercentageValue {
    return this.type === CSSValueType.PERCENT;
  }

  isTimespanValue(): this is PropertyTimespanValue {
    return this.type === CSSValueType.TIMESPAN;
  }

  isUrlValue(): this is PropertyUrlValue {
    return this.type === CSSValueType.URL;
  }

  isStringValue(): this is PropertyStringValue {
    return this.type === CSSValueType.STRING;
  }

  isColorValue(): this is PropertyColorValue {
    return this.type === CSSValueType.COLOR;
  }

  isAngleValue(): this is PropertyAngleValue {
    return this.type === CSSValueType.ANGLE;
  }

  isKeywordValue(): this is PropertyKeywordValue {
    return this.type === CSSValueType.KEYWORD;
  }

  isSetValue(): this is PropertyValue<PropertyValue[]> {
    return this.type === CSSValueType.SET;
  }

  toNumber() {
    if (this.type === CSSValueType.NUMBER || this.type === CSSValueType.INTEGER) {
      return (this as PropertyNumberValue).value;
    } else {
      return undefined;
    }
  }

  toLength() {
    if (this.type === CSSValueType.LENGTH) {
      return (this as PropertyLengthValue).value;
    } else {
      return undefined;
    }
  }

  toAngle(as: 'deg' | 'rad' | 'grad' = 'deg') {
    if (this.type === CSSValueType.ANGLE) {
      switch (as) {
        case 'deg':
          return (this as PropertyAngleValue).value;
        case 'rad':
          return (this as PropertyAngleValue).value * Math.PI / 180;
        case 'grad':
          return (this as PropertyAngleValue).value * 400 / 360;
        default:
          return undefined;
      }
    } else {
      return undefined;
    }
  }

  toColor(): PropertyColorValue['value'] | undefined {
    if (this.type === CSSValueType.COLOR) {
      return (this as PropertyColorValue).value;
    } else {
      return undefined;
    }
  }

  toUrlString(): string | undefined {
    if (this.type === CSSValueType.URL) {
      return (this as PropertyUrlValue).value;
    } else {
      return undefined;
    }
  }
};
export type PropertyIntegerValue = PropertyValue<number>;
export type PropertyNumberValue = PropertyValue<number>;
export type PropertyLengthValue = PropertyValue<{
  number: number;
  unit: SupportedLengthUnit;
}>;
export type PropertyPercentageValue = PropertyValue<number>;
export type PropertyTimespanValue = PropertyValue<number>;
export type PropertyUrlValue = PropertyValue<string>;
export type PropertyStringValue = PropertyValue<string>;
export type PropertyColorValue = PropertyValue<{
  r: number;
  g: number;
  b: number;
  a: number;
}>;
export type PropertyAngleValue = PropertyValue<number>;
export type PropertyKeywordValue = PropertyValue<string>;
export type PropertySetValue = PropertyValue<PropertyValue[]>;

export function valueType(val: any): CSSValueType | undefined {
  if (val === '' || val === null) {
    return CSSValueType.NULL_OR_EMPTY_STR;
  }
  if (typeof val === 'number') {
    val = val.toString();
  }
  if (typeof val !== 'string') {
    return undefined;
  }

  if (integerRegEx.test(val)) {
    return CSSValueType.INTEGER;
  }
  if (numberRegEx.test(val)) {
    return CSSValueType.NUMBER;
  }
  if (lengthRegEx.test(val)) {
    return CSSValueType.LENGTH;
  }
  if (percentRegEx.test(val)) {
    return CSSValueType.PERCENT;
  }
  if (timespanRegEx.test(val)) {
    return CSSValueType.TIMESPAN;
  }
  if (urlRegEx.test(val)) {
    return CSSValueType.URL;
  }
  if (calcRegEx.test(val)) {
    return CSSValueType.CALC;
  }
  if (stringRegEx.test(val)) {
    return CSSValueType.STRING;
  }
  if (angleRegEx.test(val)) {
    return CSSValueType.ANGLE;
  }
  if (colorRegEx1.test(val)) {
    return CSSValueType.COLOR;
  }

  let res = colorRegEx2.exec(val);
  var parts: any[];
  if (res !== null) {
    parts = res[1].split(/\s*,\s*/);
    if (parts.length !== 3) {
      return undefined;
    }

    const isEveryPercent = parts.every(percentRegEx.test.bind(percentRegEx));
    const isEveryInteger = parts.every(integerRegEx.test.bind(integerRegEx));
    if (isEveryPercent || isEveryInteger) {
      return CSSValueType.COLOR;
    }
    return undefined;
  }
  res = colorRegEx3.exec(val);
  if (res !== null) {
    parts = res[1].split(/\s*,\s*/);
    if (parts.length !== 4) {
      return undefined;
    }
    if (
      parts.slice(0, 3).every(percentRegEx.test.bind(percentRegEx)) ||
      parts.slice(0, 3).every(integerRegEx.test.bind(integerRegEx))
    ) {
      if (numberRegEx.test(parts[3])) {
        return CSSValueType.COLOR;
      }
    }
    return undefined;
  }

  if (colorRegEx4.test(val)) {
    return CSSValueType.COLOR;
  }

  // could still be a color, one of the standard keyword colors
  val = val.toLowerCase();

  if (colorNames.includes(val)) {
    return CSSValueType.COLOR;
  }

  switch (val) {
    // the following are deprecated in CSS3
    case 'activeborder':
    case 'activecaption':
    case 'appworkspace':
    case 'background':
    case 'buttonface':
    case 'buttonhighlight':
    case 'buttonshadow':
    case 'buttontext':
    case 'captiontext':
    case 'graytext':
    case 'highlight':
    case 'highlighttext':
    case 'inactiveborder':
    case 'inactivecaption':
    case 'inactivecaptiontext':
    case 'infobackground':
    case 'infotext':
    case 'menu':
    case 'menutext':
    case 'scrollbar':
    case 'threeddarkshadow':
    case 'threedface':
    case 'threedhighlight':
    case 'threedlightshadow':
    case 'threedshadow':
    case 'window':
    case 'windowframe':
    case 'windowtext':
      return CSSValueType.COLOR;
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword
    case 'currentcolor':
    case 'initial':
    case 'inherit':
    case 'unset':
      return CSSValueType.KEYWORD;
    default:
      return CSSValueType.UNKNOWN;
  }
}

export function toIntegerStr(val): PropertyIntegerValue {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.INTEGER) {
    return undefined;
  }
  return PropertyValue.createInteger(val, 10);
}

export function toNumberStr(val): PropertyValue<number> {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.NUMBER && type !== CSSValueType.INTEGER) {
    return undefined;
  }
  return PropertyValue.createNumber(val);
}

export function toLengthStr(val): PropertyLengthValue {
  if (val === 0 || val === '0') {
    return PropertyValue.createLength(0, 'px');
  }
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.LENGTH || typeof val !== 'string') {
    return undefined;
  }

  const m = val.match(lengthRegEx);
  if (m == null) {
    return undefined;
  }
  const number = parseFloat(m[1]);
  if (!SupportedLengthUnitsArray.includes(m[2] as any)) {
    return undefined;
  } else {
    return PropertyValue.createLength(number, m[2] as SupportedLengthUnit);
  }
}

export function toPercentStr(val): PropertyPercentageValue {
  if (val === 0 || val === '0') {
    return PropertyValue.createPercentage(0);
  }
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.PERCENT || typeof val !== 'string') {
    return undefined;
  }
  return PropertyValue.createPercentage(parseFloat(val));
}

export function toTimespanStr(val): PropertyTimespanValue {
  if (typeof val === 'number') {
    return PropertyValue.createTimespan(val);
  }
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.TIMESPAN || typeof val !== 'string') {
    return undefined;
  }

  let ms: number;
  if (!val.endsWith('ms')) {
    ms = parseFloat(val) * 1000;
  } else {
    ms = parseFloat(val);
  }
  return PropertyValue.createTimespan(ms);
}

export function toUrlStr(val): PropertyUrlValue {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  const res = urlRegEx.exec(val);
  // does it match the regex?
  if (!res) {
    return undefined;
  }
  let str = res[1];
  // if it starts with single or double quotes, does it end with the same?
  if ((str[0] === '"' || str[0] === "'") && str[0] !== str[str.length - 1]) {
    return undefined;
  }
  if (str[0] === '\'') {
    str = str.replace(/'/g, '"');
  } else if (str[0] !== '"') {
    str = `"${str}"`;
  }

  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      // Skip for the following characters "\(\)\s\t\n\'"
      case '(':
      case ')':
      case ' ':
      case '\t':
      case '\n':
      case "'":
        return undefined;
      case '\\':
        i++;
        break;
    }
  }
  return PropertyValue.createUrl(str, str.slice(1, -1));
}

export function toStringStr(val): PropertyValue<string> {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type !== CSSValueType.STRING) {
    return undefined;
  }

  let i = 1;
  for (; i < val.length - 1; i++) {
    switch (val[i]) {
      case val[0]:
        return undefined;
      case '\\':
        i++;
        while (i < val.length - 1 && /[0-9A-Fa-f]/.test(val[i])) {
          i++;
        }
        break;
    }
  }
  if (i >= val.length) {
    return undefined;
  }
  return PropertyValue.createString(val);
}

export function toColorStr(val): PropertyKeywordValue | PropertyColorValue {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  } else if (type === CSSValueType.KEYWORD) {
    return PropertyValue.createKeyword(val);
  }

  let red: number,
    green: number,
    blue: number,
    hue: number,
    saturation: number,
    lightness: number,
    alpha = 1;

  let parts: string[];
  let res = colorRegEx1.exec(val);
  // is it #aaa, #ababab, #aaaa, #abababaa
  if (res) {
    const defaultHex = val.substr(1);
    let hex = val.substr(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      if (defaultHex.length === 4) {
        hex = hex + defaultHex[3] + defaultHex[3];
      }
    }
    red = parseInt(hex.substr(0, 2), 16);
    green = parseInt(hex.substr(2, 2), 16);
    blue = parseInt(hex.substr(4, 2), 16);
    if (hex.length === 8) {
      const hexAlpha = hex.substr(6, 2);
      const hexAlphaToRgbaAlpha = Number((parseInt(hexAlpha, 16) / 255).toFixed(3));
      return PropertyValue.createColor(red, green, blue, hexAlphaToRgbaAlpha);
    } else {
      return PropertyValue.createColor(red, green, blue);
    }
  }

  // is it rbg()?
  res = colorRegEx2.exec(val);
  if (res) {
    parts = res[1].split(/\s*,\s*/);
    if (parts.length !== 3) {
      return undefined;
    }

    const isEveryPercent = parts.every(percentRegEx.test.bind(percentRegEx));
    if (isEveryPercent) {
      red = Math.floor((parseFloat(parts[0].slice(0, -1)) * 255) / 100);
      green = Math.floor((parseFloat(parts[1].slice(0, -1)) * 255) / 100);
      blue = Math.floor((parseFloat(parts[2].slice(0, -1)) * 255) / 100);
    } else if (parts.every(integerRegEx.test.bind(integerRegEx))) {
      red = parseInt(parts[0], 10);
      green = parseInt(parts[1], 10);
      blue = parseInt(parts[2], 10);
    } else {
      return undefined;
    }
    red = Math.min(255, Math.max(0, red));
    green = Math.min(255, Math.max(0, green));
    blue = Math.min(255, Math.max(0, blue));
    return PropertyValue.createColor(red, green, blue);
  }

  // is it rgba()?
  res = colorRegEx3.exec(val);
  if (res) {
    parts = res[1].split(/\s*,\s*/);
    if (parts.length !== 4) {
      return undefined;
    }
    if (parts.slice(0, 3).every(percentRegEx.test.bind(percentRegEx))) {
      red = Math.floor((parseFloat(parts[0].slice(0, -1)) * 255) / 100);
      green = Math.floor((parseFloat(parts[1].slice(0, -1)) * 255) / 100);
      blue = Math.floor((parseFloat(parts[2].slice(0, -1)) * 255) / 100);
      alpha = parseFloat(parts[3]);
    } else if (parts.slice(0, 3).every(integerRegEx.test.bind(integerRegEx))) {
      red = parseInt(parts[0], 10);
      green = parseInt(parts[1], 10);
      blue = parseInt(parts[2], 10);
      alpha = parseFloat(parts[3]);
    } else {
      return undefined;
    }
    if (isNaN(alpha)) {
      alpha = 1;
    }
    red = Math.min(255, Math.max(0, red));
    green = Math.min(255, Math.max(0, green));
    blue = Math.min(255, Math.max(0, blue));
    alpha = Math.min(1, Math.max(0, alpha));
    if (alpha === 1) {
      return PropertyValue.createColor(red, green, blue);
    } else {
      return PropertyValue.createColor(red, green, blue, alpha);
    }
  }

  // is it hsl() or hsla()?
  res = colorRegEx4.exec(val);
  if (res) {
    const [, _hue, _saturation, _lightness, _alphaString = ''] = res;
    const _alpha = parseFloat(_alphaString.replace(',', '').trim());
    if (!_hue || !_saturation || !_lightness) {
      return undefined;
    }
    /**
     * TODO: supports deg, grad, rad or turn?
     */
    hue = parseFloat(_hue);
    saturation = parseInt(_saturation, 10);
    lightness = parseInt(_lightness, 10);
    if (_alpha) {
      alpha = _alpha;
    }

    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    if (!_alphaString || alpha === 1) {
      return PropertyValue.createColor(r, g, b);
    } else {
      return PropertyValue.createColor(r, g, b, alpha);
    }
  }

  if (type === CSSValueType.COLOR) {
    const color = namedColors[val];
    if (color?.length === 3) {
      return PropertyValue.createColor(color[0], color[1], color[2]);
    } else if (color?.length === 4) {
      return PropertyValue.createColor(color[0], color[1], color[2], color[3]);
    }
  }
  return undefined;
}

export function toAngleStr(val): PropertyAngleValue {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type === CSSValueType.INTEGER) {
    val = `${val}deg`;
  } else if (type !== CSSValueType.ANGLE) {
    return undefined;
  }
  const res = angleRegEx.exec(val);
  let flt = parseFloat(res[1]);
  if (res[2] === 'rad') {
    flt *= 180 / Math.PI;
  } else if (res[2] === 'grad') {
    flt *= 360 / 400;
  }

  while (flt < 0) {
    flt += 360;
  }
  while (flt > 360) {
    flt -= 360;
  }
  return PropertyValue.createAngle(flt);
}

export function autoCreatePropertyValue(val): PropertyValue {
  let type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return PropertyValue.NULL_OR_EMPTY_STR;
  }
  if (type === CSSValueType.KEYWORD) {
    type = CSSValueType.STRING;
  }
  switch (type) {
    case CSSValueType.INTEGER:
      return toIntegerStr(val);
    case CSSValueType.NUMBER:
      return toNumberStr(val);
    case CSSValueType.LENGTH:
      return toLengthStr(val);
    case CSSValueType.PERCENT:
      return toPercentStr(val);
    case CSSValueType.URL:
      return toUrlStr(val);
    case CSSValueType.STRING:
      return toStringStr(val);
    case CSSValueType.COLOR:
      return toColorStr(val);
    case CSSValueType.ANGLE:
      return toAngleStr(val);
    default:
      return undefined;
  }
}

const reCamelToDashed = /[A-Z]/g;
const reFirstSegment = /^(?<vendor>[^-]+)-/;
const reVendorPrefixes = ['o', 'moz', 'ms', 'webkit', 'rokid'];

export function camelToDashed(input: string): string {
  let match: ReturnType<typeof String.prototype.match>;
  let dashed = input.replace(reCamelToDashed, '-$&').toLowerCase();
  match = dashed.match(reFirstSegment);
  if (match?.groups && reVendorPrefixes.indexOf(match.groups['vendor']) !== -1) {
    dashed = `-${dashed}`;
  }
  return dashed;
}

export function dashedToCamel(input: string): string {
  let camel = '';
  let nextCap = false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== '-') {
      camel += nextCap ? input[i].toUpperCase() : input[i];
      nextCap = false;
    } else {
      nextCap = true;
    }
  }
  return camel;
}

const reIsSpace = /\s/;
const openingDeliminators = ['"', "'", '('];
const closingDeliminators = ['"', "'", ')'];

function getParts(v: string): string[] {
  const deliminatorStack = [] as number[];
  const parts = [] as string[];
  let currentPart = '';
  let openingIndex: number;
  let closingIndex: number;

  for (let i = 0; i < v.length; i++) {
    openingIndex = openingDeliminators.indexOf(v[i]);
    closingIndex = closingDeliminators.indexOf(v[i]);
    if (reIsSpace.test(v[i])) {
      if (deliminatorStack.length === 0) {
        if (currentPart !== '') {
          parts.push(currentPart);
        }
        currentPart = '';
      } else {
        currentPart += v[i];
      }
    } else {
      if (v[i] === '\\') {
        i++;
        currentPart += v[i];
      } else {
        currentPart += v[i];
        if (
          closingIndex !== -1 &&
          closingIndex === deliminatorStack[deliminatorStack.length - 1]
        ) {
          deliminatorStack.pop();
        } else if (openingIndex !== -1) {
          deliminatorStack.push(openingIndex);
        }
      }
    }
  }
  if (currentPart !== '') {
    parts.push(currentPart);
  }
  return parts;
}

/**
 * isValid(){1,4} | inherit
 * if one, it applies to all
 * if two, the first applies to the top and bottom, and the second to left and right
 * if three, the first applies to the top, the second to left and right, the third bottom
 * if four, top, right, bottom, left
 * 
 * @param before 
 * @param after 
 * @param validator 
 * @param parser 
 */
export function implicitSetter(
  before: string,
  after: string,
  partNames: string[],
  validator: (v: string) => boolean,
  toPropertyValue: (v: any) => PropertyValue
) {
  after = after || '';
  if (after !== '') {
    after = `-${after}`;
  }
  return function (this: CSSSpatialStyleDeclaration, v: any) {
    if (typeof v === 'number') {
      v = v.toString();
    }
    if (typeof v !== 'string') {
      return;
    }

    let parts: string[];
    if (v.toLowerCase() === 'inherit' || v === '') {
      parts = [v];
    } else {
      parts = getParts(v);
    }

    if (parts.length < 1 || parts.length > 4) {
      return undefined;
    }
    if (!parts.every(validator)) {
      return undefined;
    }

    let values = parts.map(toPropertyValue);
    this._setProperty(
      before + after,
      PropertyValue.createSet(values),
      null
    );
    /** (x, y) */
    if (values.length === 1 && partNames.length >= 2) {
      values[1] = values[0];
    }
    /** (x, y, z) */
    if (values.length === 2 && partNames.length >= 3) {
      values[2] = values[0];
    }
    /** (x, y, z, w) */
    if (values.length === 3 && partNames.length >= 4) {
      values[3] = values[1];
    }

    for (let i = 0; i < partNames.length; i++) {
      let propertyName: string;
      const partName = partNames[i];
      if (partName.startsWith(':')) {
        propertyName = `${partName.slice(1)}${after}`;
      } else {
        propertyName = `${before}-${partNames[i]}${after}`;
      }
      this.removeProperty(propertyName);
      if (values[i] !== PropertyValue.NULL_OR_EMPTY_STR) {
        this._values[propertyName] = values[i];
      }
    }
    return v;
  }
}

export type ShorthandFor = { [key: string]: ReturnType<typeof defineSpatialProperty> };

export function parseShorthand(v: any, shorthandFor: ShorthandFor): { [key: string]: string } {
  const shorthandDescriptor = {} as { [key: string]: string };
  const type = valueType(v);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    Object.keys(shorthandFor).forEach(function (property) {
      shorthandDescriptor[property] = '';
    });
    return shorthandDescriptor;
  }

  if (typeof v === 'number') {
    v = v.toString();
  }
  if (typeof v !== 'string') {
    return undefined;
  }

  if (v.toLowerCase() === 'inherit') {
    return {};
  }

  const parts = getParts(v);
  let valid = true;
  parts.forEach(function (part, i) {
    let isPartValid = false;
    Object.keys(shorthandFor).forEach(function (property) {
      if (shorthandFor[property].isValid(part, i)) {
        isPartValid = true;
        shorthandDescriptor[property] = part;
      }
    });
    valid = valid && isPartValid;
  });
  if (!valid) {
    return undefined;
  }
  return shorthandDescriptor;
}

export function shorthandGetter(property: string, shorthandFor: ShorthandFor) {
  return function (this: CSSSpatialStyleDeclaration) {
    if (this._values[property] !== undefined) {
      return this.getPropertyValue(property);
    }
    return Object.keys(shorthandFor)
      .map(function (subprop) {
        return this.getPropertyValue(subprop);
      }, this)
      .filter(function (value) {
        return value !== '';
      })
      .join(' ');
  };
}

export function shorthandSetter(
  property: string,
  shorthandFor: { [key: string]: ReturnType<typeof defineSpatialProperty> }
) {
  return function (this: CSSSpatialStyleDeclaration, v: any) {
    let obj: { [key: string]: string | number };
    if (property === 'animation') {
      const parsed = animationShorthandParser.parseSingle(v);
      obj = {
        'animation-name': parsed.value.name,
        'animation-duration': parsed.value.duration,  // a number in ms.
        'animation-iteration-count': parsed.value.iterationCount,
      };
    } else {
      obj = parseShorthand(v, shorthandFor);
    }

    // Just ignore invalid values
    if (obj === undefined) {
      return;
    }

    Object.keys(obj).forEach((subprop) => {
      // in case subprop is an implicit property, this will clear
      // *its* subpropertiesX
      const camel = dashedToCamel(subprop);
      this[camel] = obj[subprop];
      // in case it gets translated into something else (0 -> 0px)
      obj[subprop] = this[camel];
    });

    Object.keys(shorthandFor).forEach(function (subprop) {
      if (!obj.hasOwnProperty(subprop)) {
        this.removeProperty(subprop);
        delete this._values[subprop];
      }
    }, this);

    // in case the value is something like 'none' that removes all values,
    // check that the generated one is not empty, first remove the property
    // if it already exists, then call the shorthandGetter, if it's an empty
    // string, don't set the property
    this.removeProperty(property);
    const calculated = shorthandGetter(property, shorthandFor).call(this);
    if (calculated !== '') {
      this._setProperty(property, calculated);
    }
  };
}

export class TransformFunction {
  name: PropertyStringValue;
  values: PropertyLengthValue | PropertyAngleValue;

  constructor(name: string, value: number, unit: string) {
    this.name = PropertyValue.createString(name);
    if (name === 'rotate') {
      this.values = PropertyValue.createAngle(value);
    } else if (name ==='translateX') {
      this.values = PropertyValue.createLength(value, unit as SupportedLengthUnit);
    }
  }
}

export function parseTransform(transformStr: string) {
  const matches = [];
  const transformValues = transformStr.split(')');
  for (let i = 0; i < transformValues.length - 1; i++) {
    const transformValue = transformValues[i];
    const transformParts = transformValue.split('(');
    const transformName = transformParts[0].trim();
    const valueWithUnit = transformParts[1];
    const value = parseFloat(valueWithUnit);
    const unit = valueWithUnit.replace(value.toString(), '');
    if (transformName === 'rotate') {
      matches.push(new TransformFunction(
        transformName,
        value,
        unit
      ));
    } else if (transformName === 'translateX') {
      matches.push(new TransformFunction(
        transformName,
        value,
        unit
      ));
    }
  }
  return matches;
}
