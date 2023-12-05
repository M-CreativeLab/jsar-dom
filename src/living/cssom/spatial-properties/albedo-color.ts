import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('albedo-color');
  },
  set(value: string) {
    this._setProperty('albedo-color', toColorStr(value), null);
  },
});
