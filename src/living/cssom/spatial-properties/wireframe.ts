import { defineSpatialProperty } from './helper';
import { PropertyValue, toStringStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('wireframe');
  },
  set(value: string) {
    this._setProperty('wireframe', PropertyValue.createKeyword(value), null);
  },
});
