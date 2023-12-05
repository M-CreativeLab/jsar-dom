import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';
import { hslToRgb } from '../utils/color-space';
import namedColors from './named-colors';

const integerRegEx = /^[-+]?[0-9]+$/;
const numberRegEx = /^[-+]?[0-9]*\.?[0-9]+$/;
const lengthRegEx = /^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$/;
const percentRegEx = /^[-+]?[0-9]*\.?[0-9]+%$/;
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
  NUMBER = 2,
  LENGTH = 3,
  PERCENT = 4,
  URL = 5,
  COLOR = 6,
  STRING = 7,
  ANGLE = 8,
  KEYWORD = 9,
  NULL_OR_EMPTY_STR = 10,
  CALC = 11,
}

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

  if (namedColors.includes(val)) {
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
    default:
      return CSSValueType.KEYWORD;
  }
}

export function toIntegerStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
  }
  if (type !== CSSValueType.INTEGER) {
    return undefined;
  }
  return String(parseInt(val, 10));
}

export function toNumberStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
  }
  if (type !== CSSValueType.NUMBER && type !== CSSValueType.INTEGER) {
    return undefined;
  }
  return String(parseFloat(val));
}

export function toLengthStr(val): string {
  if (val === 0 || val === '0') {
    return '0px';
  }
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
  }
  if (type !== CSSValueType.LENGTH) {
    return undefined;
  }
  return val;
}

export function toPercentStr(val): string {
  if (val === 0 || val === '0') {
    return '0%';
  }
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
  }
  if (type !== CSSValueType.PERCENT) {
    return undefined;
  }
  return val;
}

export function toUrlStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
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
    str = '"' + str + '"';
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
  return `url(${str})`;
}

export function toStringStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
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
  return val;
}

export function toColorStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
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
      return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + hexAlphaToRgbaAlpha + ')';
    }
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
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
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
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
      return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    }
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
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
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  if (type === CSSValueType.COLOR) {
    return val;
  }
  return undefined;
}

export function toAngleStr(val): string {
  const type = valueType(val);
  if (type === CSSValueType.NULL_OR_EMPTY_STR) {
    return val;
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
  return flt + 'deg';
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
  toStr: (v: any) => string
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

    parts = parts.map(toStr);
    this._setProperty(before + after, parts.join(' '), null);
    /** (x, y) */
    if (parts.length === 1 && partNames.length >= 2) {
      parts[1] = parts[0];
    }
    /** (x, y, z) */
    if (parts.length === 2 && partNames.length >= 3) {
      parts[2] = parts[0];
    }
    /** (x, y, z, w) */
    if (parts.length === 3 && partNames.length >= 4) {
      parts[3] = parts[1];
    }

    for (let i = 0; i < partNames.length; i++) {
      const propertyName = `${before}-${partNames[i]}${after}`;
      this.removeProperty(propertyName);
      if (parts[i] !== '') {
        this._values[propertyName] = parts[i];
      }
    }
    return v;
  }
}
