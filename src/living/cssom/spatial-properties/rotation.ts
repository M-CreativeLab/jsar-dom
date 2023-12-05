import { defineSpatialProperty } from './helper';
import {
  CSSValueType,
  valueType,
  implicitSetter,
  toAngleStr,
} from '../parsers';

function rotationValidator(v): boolean {
  if (v.toLowerCase() === 'auto') {
    return true;
  }
  const type = valueType(v);
  return (
    type === CSSValueType.ANGLE ||
    type === CSSValueType.INTEGER
  );
}

function toRotationStr(v: string) {
  v = v.toLowerCase();
  if (v === 'auto') {
    return v;
  }
  return toAngleStr(v);
}

// TODO: support quaternion(x, y, z, w)?
const parts = ['x', 'y', 'z'];
const valueSetter = implicitSetter(
  'rotation',
  '',
  parts,
  rotationValidator,
  toRotationStr
);
const globalSetter = implicitSetter(
  'rotation',
  '',
  parts,
  () => true,
  (v) => v
);

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('rotation');
  },
  set(value: string) {
    if (typeof value === 'number') {
      value = String(value);
    }
    if (typeof value !== 'string') {
      return;
    }

    const _v = value.trim().toLowerCase();
    switch (_v) {
      case 'inherit':
      case 'initial':
      case 'unset':
      case '':
        globalSetter.call(this, _v);
        break;
      default:
        valueSetter.call(this, _v);
        break;
    }
  },
});
