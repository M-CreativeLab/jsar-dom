import { defineSpatialProperty } from './helper';
import { PropertyValue } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('animation-name');
  },
  set(value: string) {
    this._setProperty('animation-name', PropertyValue.createKeyword(value), null);
  },
});
