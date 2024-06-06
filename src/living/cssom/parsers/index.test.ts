import { describe, it, expect } from '@jest/globals';
import * as parsers from './';
import CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

describe('valueType', () => {
  it('returns color for red', () => {
    const input = 'red';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for #nnnnnn', () => {
    const input = '#fefefe';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgb(n, n, n)', () => {
    const input = 'rgb(10, 10, 10)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgb(p, p, p)', () => {
    const input = 'rgb(10%, 10%, 10%)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgba(n, n, n, n)', () => {
    const input = 'rgba(10, 10, 10, 1)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgba(n, n, n, n) with decimal alpha', () => {
    const input = 'rgba(10, 10, 10, 0.5)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgba(p, p, p, n)', () => {
    const input = 'rgba(10%, 10%, 10%, 1)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns color for rgba(p, p, p, n) with decimal alpha', () => {
    const input = 'rgba(10%, 10%, 10%, 0.5)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.COLOR);
  });

  it('returns length for 100ch', () => {
    const input = '100ch';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.LENGTH);
  });

  it('returns calc from calc(100px * 2)', () => {
    const input = 'calc(100px * 2)';
    const output = parsers.valueType(input);
    expect(output).toEqual(parsers.CSSValueType.CALC);
  });
});

describe('toPercentStr', () => {
  it('returns "0%" for 0', () => {
    const input = 0;
    const output = parsers.toPercentStr(input);
    expect(output.str).toEqual('0%');
    expect(output.type).toEqual(parsers.CSSValueType.PERCENT);
    expect(output.value).toEqual(0);
  });

  it('returns "0%" for "0"', () => {
    const input = '0';
    const output = parsers.toPercentStr(input);
    expect(output.str).toEqual('0%');
    expect(output.type).toEqual(parsers.CSSValueType.PERCENT)
  });

  it('returns the input value for null or empty string', () => {
    const input = '';
    const output = parsers.toPercentStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.NULL_OR_EMPTY_STR);
    expect(output.value).toEqual(null);
  });

  it('returns undefined for non-percent values', () => {
    const input = '10px';
    const output = parsers.toPercentStr(input);
    expect(output).toBeUndefined();
  });

  it('returns the input value for percent values', () => {
    const input = '50%';
    const output = parsers.toPercentStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.PERCENT);
  });
});

describe('toUrlStr', () => {
  it('returns the input value for null or empty string', () => {
    const input = '';
    const output = parsers.toUrlStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.NULL_OR_EMPTY_STR);
  });

  it('returns undefined for values that do not match the regex', () => {
    const input = 'example.com';
    const output = parsers.toUrlStr(input);
    expect(output).toBeUndefined();
  });

  it('returns undefined for values that start with quotes but do not end with the same quotes', () => {
    expect(parsers.toUrlStr('"example.com')).toBeUndefined();
    expect(parsers.toUrlStr('\'example.com')).toBeUndefined();
  });

  it('returns the URL string for values that contain no quotes', () => {
    const input = 'url(example.com)';
    const output = parsers.toUrlStr(input);
    expect(output.str).toEqual('url("example.com")');
    expect(output.type).toEqual(parsers.CSSValueType.URL);
    expect(output.value).toEqual('example.com');
  });

  it('returns the URL string for values that contain single quotes', () => {
    const input = 'url(\'example.com\')';
    const output = parsers.toUrlStr(input);
    expect(output.str).toEqual('url("example.com")');
    expect(output.type).toEqual(parsers.CSSValueType.URL);
    expect(output.value).toEqual('example.com');
  });

  it('returns the URL string for valid input', () => {
    const input = 'url("example.com")';
    const output = parsers.toUrlStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.URL);
    expect(output.value).toEqual('example.com');
  });
});

describe('toColorStr', () => {
  it('should convert hsl to rgb values', () => {
    let input = 'hsla(0, 1%, 2%)';
    let output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgb(5, 5, 5)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({ r: 5, g: 5, b: 5, a: undefined });
  });

  it('should convert hsla to rgba values', () => {
    let input = 'hsla(0, 1%, 2%, 0.5)';
    let output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgba(5, 5, 5, 0.5)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 5,
      g: 5,
      b: 5,
      a: 0.5
    });
  });

  it('should convert hex color to rgb values', () => {
    const input = '#abcdef';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgb(171, 205, 239)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 171,
      g: 205,
      b: 239,
      a: undefined
    });
  });

  it('should convert short hex color to rgb values', () => {
    const input = '#abc';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgb(170, 187, 204)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 170,
      g: 187,
      b: 204,
      a: undefined
    });
  });

  it('should convert hex color with alpha to rgba values', () => {
    const input = '#abcdef80';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgba(171, 205, 239, 0.502)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 171,
      g: 205,
      b: 239,
      a: 0.502
    });
  });

  it('should convert rgb color to rgb values', () => {
    const input = 'rgb(100, 150, 200)';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgb(100, 150, 200)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 100,
      g: 150,
      b: 200,
      a: undefined
    });
  });

  it('should convert rgb color with alpha to rgba values', () => {
    const input = 'rgba(100, 150, 200, 0.5)';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgba(100, 150, 200, 0.5)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 100,
      g: 150,
      b: 200,
      a: 0.5
    });
  });

  it('should convert hsl color to rgb values', () => {
    const input = 'hsl(180, 50%, 50%)';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgb(64, 191, 191)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 64,
      g: 191,
      b: 191,
      a: undefined
    });
  });

  it('should convert hsl color with alpha to rgba values', () => {
    const input = 'hsla(180, 50%, 50%, 0.5)';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual('rgba(64, 191, 191, 0.5)');
    expect(output.type).toEqual(parsers.CSSValueType.COLOR);
    expect(output.value).toStrictEqual({
      r: 64,
      g: 191,
      b: 191,
      a: 0.5
    });
  });

  it('should return the input value for null or empty string', () => {
    const input = '';
    const output = parsers.toColorStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.NULL_OR_EMPTY_STR);
  });

  it('should return undefined for invalid color values', () => {
    const input = 'invalid-color';
    const output = parsers.toColorStr(input);
    expect(output).toBeUndefined();
  });
});

describe('toAngleStr', () => {
  it('returns the input value for null or empty string', () => {
    const input = '';
    const output = parsers.toAngleStr(input);
    expect(output.str).toEqual(input);
    expect(output.type).toEqual(parsers.CSSValueType.NULL_OR_EMPTY_STR);
  });

  it('returns undefined for non-angle values', () => {
    const input = '10px';
    const output = parsers.toAngleStr(input);
    expect(output).toBeUndefined();
  });

  it('converts radians to degrees', () => {
    const input = '1rad';
    const output = parsers.toAngleStr(input);
    expect(output.str).toEqual('57.29577951308232deg');
    expect(output.type).toEqual(parsers.CSSValueType.ANGLE);
    expect(output.value).toEqual(57.29577951308232);
  });

  it('converts gradians to degrees', () => {
    const input = '100grad';
    const output = parsers.toAngleStr(input);
    expect(output.str).toEqual('90deg');
    expect(output.type).toEqual(parsers.CSSValueType.ANGLE);
    expect(output.value).toEqual(90);
  });

  it('normalizes negative angles', () => {
    const input = '-90deg';
    const output = parsers.toAngleStr(input);
    expect(output.str).toEqual('270deg');
    expect(output.type).toEqual(parsers.CSSValueType.ANGLE);
    expect(output.value).toEqual(270);
  });

  it('normalizes angles greater than 360 degrees', () => {
    const input = '720deg';
    const output = parsers.toAngleStr(input);
    expect(output.str).toEqual('360deg');
    expect(output.type).toEqual(parsers.CSSValueType.ANGLE);
    expect(output.value).toEqual(360);
  });

  it('converts integer numbers to degree', () => {
    expect(parsers.toAngleStr('0').str).toEqual('0deg');
    expect(parsers.toAngleStr('180').str).toEqual('180deg');
    expect(parsers.toAngleStr('720').str).toEqual('360deg');
  });
});

describe('camelToDashed', () => {
  it('converts camel case to dashed case', () => {
    const input = 'backgroundColor';
    const output = parsers.camelToDashed(input);
    expect(output).toEqual('background-color');
  });

  it('converts camel case with multiple words to dashed case', () => {
    const input = 'borderTopWidth';
    const output = parsers.camelToDashed(input);
    expect(output).toEqual('border-top-width');
  });

  it('converts camel case with vendor prefix to dashed case', () => {
    const input = 'webkitTransition';
    const output = parsers.camelToDashed(input);
    expect(output).toEqual('-webkit-transition');
  });

  it('converts camel case with multiple words and vendor prefix to dashed case', () => {
    const input = 'msFlexDirection';
    const output = parsers.camelToDashed(input);
    expect(output).toEqual('-ms-flex-direction');
  });

  it('converts camel case with "rokid" vendor to dashed case', () => {
    expect(parsers.camelToDashed('rokidTransition')).toEqual('-rokid-transition');
    expect(parsers.camelToDashed('rokidFlexDirection')).toEqual('-rokid-flex-direction');
  });

  it('converts camel case with single letter words to dashed case', () => {
    const input = 'aBC';
    const output = parsers.camelToDashed(input);
    expect(output).toEqual('a-b-c');
  });
});

describe('implicitSetter', () => {
  const decl = new CSSSpatialStyleDeclaration();
  const partNames = ['x', 'y', 'z'];
  const validator = (v: string) => v !== '';
  const toStr = (v: any) => parsers.toNumberStr(v);

  it('should return a function', () => {
    const setter = parsers.implicitSetter('position', '', partNames, validator, toStr);
    expect(typeof setter).toEqual('function');
  });

  it('should set the value of the property', () => {
    const setter = parsers.implicitSetter('position', '', partNames, validator, toStr);
    setter.call(decl, '1 1 1');
    expect(decl.position).toBe('1 1 1');
  });
});

describe('parseTransform', () => {
  it('should parse translateX correctly', () => {
    const result = parsers.parseTransform('translateX(10px)');
    expect(result).toEqual([
      new parsers.TranslationTransformFunction('translateX', ['10px'])
    ]);
  });

  it('should parse rotate correctly', () => {
    const result = parsers.parseTransform('rotate(45deg)');
    expect(result).toEqual([
      new parsers.RotationTransformFunction('rotate', ['45deg'])
    ]);
  });

  it('should parse multiple transforms correctly', () => {
    const result = parsers.parseTransform('translateX(10px) rotate(45deg)');
    expect(result).toEqual([
      new parsers.TranslationTransformFunction('translateX', ['10px']),
      new parsers.RotationTransformFunction('rotate', ['45deg'])
    ]);
  });

  it('should process input function name error correctly', () => {
    const result = parsers.parseTransform('translateM(10px)');
    expect(result).toEqual([]);
  })

  it('should process input values error correctly', () => {
    const result = parsers.parseTransform('translateX(10py)');
    expect(result).toEqual([]);
  })
});
