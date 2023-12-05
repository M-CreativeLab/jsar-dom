import { defineSpatialProperty } from './helper';
import {
  CSSValueType,
  valueType,
  PropertyValue,
  implicitSetter,
  toNumberStr,
  toIntegerStr,
} from '../parsers';

function scalingValidator(v): boolean {
  switch (valueType(v)) {
    case CSSValueType.NUMBER:
    case CSSValueType.INTEGER:
      return true;
    default:
      return false;
  }
}

function toScalingStr(v: string) {
  const type = valueType(v);
  if (type === CSSValueType.NUMBER) {
    return toNumberStr(v);
  } else if (type === CSSValueType.INTEGER) {
    return toIntegerStr(v);
  }
}

const valueSetter = implicitSetter(
  'scaling',
  '',
  ['x', 'y', 'z'],
  scalingValidator,
  toScalingStr
);
const globalSetter = implicitSetter(
  'scaling',
  '',
  ['x', 'y', 'z'],
  () => true,
  (v) => PropertyValue.createKeyword(v),
);

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('scaling');
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
