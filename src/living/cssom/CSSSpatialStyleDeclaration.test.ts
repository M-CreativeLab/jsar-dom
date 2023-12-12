import { describe, it, expect } from '@jest/globals';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';
import { CSSValueType } from './parsers';

describe('CSSSpatialStyleDeclaration', () => {
  it.todo('has only valid properties implemented');

  it('has all functions', () => {
    const style = new CSSSpatialStyleDeclaration();
    expect(typeof style.item).toEqual('function');
    expect(typeof style.getPropertyValue).toEqual('function');
    expect(typeof style.setProperty).toEqual('function');
    expect(typeof style.getPropertyPriority).toEqual('function');
    expect(typeof style.removeProperty).toEqual('function');

    // TODO - deprecated according to MDN and not implemented at all, can we remove?
    expect(typeof style.getPropertyCSSValue).toEqual('function');
  });

  it('has special properties', () => {
    const style = new CSSSpatialStyleDeclaration();
    expect(style).toHaveProperty('cssText');
    expect(style).toHaveProperty('length');
    expect(style).toHaveProperty('parentRule');
  });

  it.todo('from style string');

  it('from properties', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.diffuseColor = 'blue';
    expect(style.length).toEqual(1);
    expect(style[0]).toEqual('diffuse-color');
    expect(style.cssText).toEqual('diffuse-color: rgb(0, 0, 255);');
    expect(style.item(0)).toEqual('diffuse-color');
    expect(style.diffuseColor).toEqual('rgb(0, 0, 255)');
    style.position = '1';
    expect(style.length).toEqual(2);
    expect(style[0]).toEqual('diffuse-color');
    expect(style[1]).toEqual('position');
    expect(style.cssText).toEqual('diffuse-color: rgb(0, 0, 255); position: 1;');
    expect(style.position).toEqual('1');
    style.removeProperty('diffuse-color');
    expect(style[0]).toEqual('position');
  });

  it.todo('shorthand properties');
  it.todo('width and height properties and null and empty strings');
  it.todo('implicit properties');

  it('colors', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.diffuseColor = 'rgba(0,0,0,0)';
    expect(style.diffuseColor).toEqual('rgba(0, 0, 0, 0)');
    style.diffuseColor = 'rgba(5%, 10%, 20%, 0.4)';
    expect(style.diffuseColor).toEqual('rgba(12, 25, 51, 0.4)');
    style.diffuseColor = 'rgb(33%, 34%, 33%)';
    expect(style.diffuseColor).toEqual('rgb(84, 86, 84)');
    style.diffuseColor = 'rgba(300, 200, 100, 1.5)';
    expect(style.diffuseColor).toEqual('rgb(255, 200, 100)');
    style.diffuseColor = 'hsla(0, 1%, 2%, 0.5)';
    expect(style.diffuseColor).toEqual('rgba(5, 5, 5, 0.5)');
    style.diffuseColor = 'hsl(0, 1%, 2%)';
    expect(style.diffuseColor).toEqual('rgb(5, 5, 5)');
    style.diffuseColor = 'rebeccapurple';
    expect(style.diffuseColor).toEqual('rgb(102, 51, 153)');
    style.diffuseColor = 'transparent';
    expect(style.diffuseColor).toEqual('rgba(0, 0, 0, 0)');
    style.diffuseColor = 'currentcolor';
    expect(style.diffuseColor).toEqual('currentcolor');
    style.diffuseColor = '#ffffffff';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 1)');
    style.diffuseColor = '#fffa';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 0.667)');
    style.diffuseColor = '#ffffff66';
    expect(style.diffuseColor).toEqual('rgba(255, 255, 255, 0.4)');
  });

  it.todo('short hand properties with embedded spaces');
  it.todo('setting shorthand properties to an empty string should clear all dependent properties');

  it('onchange callback should be called when the csstext changes', () => {
    const style = new CSSSpatialStyleDeclaration(function (cssText) {
      expect(cssText).toEqual('diffuse-color: rgb(255, 0, 0);');
    });
    style.setProperty('diffuse-color', 'red');
    expect(style.length).toEqual(1);
    expect(style.diffuseColor).toEqual('rgb(255, 0, 0)');
  });

  it.todo('setting improper css to csstext should not throw');
  it.todo('url parsing works with quotes');
  it.todo('setting ex units to a padding or margin works');

  it('camelcase properties are not assigned with `.setproperty()`', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('diffuseColor', 'red');
    expect(style.cssText).toEqual('');
  });

  it('casing is ignored in `.setproperty()`', () => {
    var style = new CSSSpatialStyleDeclaration();
    style.setProperty('DiFfUsE-CoLoR', 'red');
    expect(style.diffuseColor).toEqual('rgb(255, 0, 0)');
    expect(style.getPropertyValue('diffuse-color')).toEqual('rgb(255, 0, 0)');
  });

  it.skip('getPropertyValue for custom properties in cssText', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.cssText = '--foo: red';
    expect(style.getPropertyValue('--foo')).toEqual('red');
  });

  it('getPropertyValue for custom properties with setProperty', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('--bar', '"blue"');
    expect(style.getPropertyValue('--bar')).toEqual('"blue"');
    expect(style._values['--bar'].str).toEqual('"blue"');
    expect(style._values['--bar'].type).toEqual(CSSValueType.STRING);
  });

  it('getPropertyValue for custom properties with object setter', () => {
    const style = new CSSSpatialStyleDeclaration();
    style['--baz'] = 'yellow';
    expect(style.getPropertyValue('--baz')).toEqual('');
  });

  it.skip('custom properties are case-sensitive', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.cssText = '--fOo: purple';
    expect(style.getPropertyValue('--foo')).toEqual('');
    expect(style.getPropertyValue('--fOo')).toEqual('purple');
  });

  it.skip('supports calc', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.setProperty('width', 'calc(100% - 100px)');
    expect(style.getPropertyValue('width')).toEqual('calc(100% - 100px)');
  });

  it('supports position', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.position = '1 2 3';
    expect(style._getPropertyValue('position').str).toEqual('1 2 3');
    expect(style._getPropertyValue('x').value).toEqual(1);
    expect(style._getPropertyValue('y').value).toEqual(2);
    expect(style._getPropertyValue('z').value).toEqual(3);
    style.position = '0.1 0.2 0.3';
    expect(style._getPropertyValue('position').str).toEqual('0.1 0.2 0.3');
    expect(style._getPropertyValue('x').value).toEqual(.1);
    expect(style._getPropertyValue('y').value).toEqual(.2);
    expect(style._getPropertyValue('z').value).toEqual(.3);
  });

  it('supports x, y, z', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.x = '20';
    style.y = '10';
    expect(style._getPropertyValue('x').value).toEqual(20);
    expect(style._getPropertyValue('y').value).toEqual(10);
    expect(style._getPropertyValue('z')).toBeNull();
  });

  it('supports rotation', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.rotation = '180 0 0';
    expect(style._getPropertyValue('rotation').str).toEqual('180deg 0deg 0deg');
    expect(style._getPropertyValue('rotation-x').value).toEqual(180);
    expect(style._getPropertyValue('rotation-y').value).toEqual(0);
    expect(style._getPropertyValue('rotation-z').value).toEqual(0);
    style.rotation = '320deg 45deg 10';
    expect(style._getPropertyValue('rotation').str).toEqual('320deg 45deg 10deg');
    expect(style._getPropertyValue('rotation-x').value).toEqual(320);
    expect(style._getPropertyValue('rotation-y').value).toEqual(45);
    expect(style._getPropertyValue('rotation-z').value).toEqual(10);
    style.rotation = '1rad 1rad 100deg';
    expect(style._getPropertyValue('rotation').str).toEqual('57.29577951308232deg 57.29577951308232deg 100deg');
    expect(style._getPropertyValue('rotation-x').value).toEqual(57.29577951308232);
    expect(style._getPropertyValue('rotation-y').value).toEqual(57.29577951308232);
    expect(style._getPropertyValue('rotation-z').value).toEqual(100);
  });

  it('supports scaling', () => {
    const style = new CSSSpatialStyleDeclaration();
    style.scaling = '1 2 3';
    expect(style._getPropertyValue('scaling').str).toEqual('1 2 3');
    expect(style._getPropertyValue('scaling-x').value).toEqual(1);
    expect(style._getPropertyValue('scaling-y').value).toEqual(2);
    expect(style._getPropertyValue('scaling-z').value).toEqual(3);
    style.scaling = '0.1 0.2 0.3';
    expect(style._getPropertyValue('scaling').str).toEqual('0.1 0.2 0.3');
    expect(style._getPropertyValue('scaling-x').value).toEqual(.1);
    expect(style._getPropertyValue('scaling-y').value).toEqual(.2);
    expect(style._getPropertyValue('scaling-z').value).toEqual(.3);
  });
});
