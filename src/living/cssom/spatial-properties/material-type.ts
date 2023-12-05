import { defineSpatialProperty } from './helper';
import { PropertyValue } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material-type');
  },
  set(value: string) {
    this._setProperty('material-type', PropertyValue.createKeyword(value), null);
  },
});
