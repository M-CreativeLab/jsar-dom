import { defineSpatialProperty } from './helper';
import { PropertyValue } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material-orientation');
  },
  set(value: string) {
    this._setProperty('material-orientation', PropertyValue.createKeyword(value), null);
  },
});
