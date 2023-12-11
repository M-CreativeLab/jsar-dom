import { defineSpatialProperty } from './helper';
import { PropertyValue, toTimespanStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('animation-iteration-count');
  },
  set(value: string) {
    this._setProperty('animation-iteration-count', PropertyValue.createKeyword(value), null);
  },
});
