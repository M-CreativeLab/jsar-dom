import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('emissive-color');
  },
  set(value: string) {
    this._setProperty('emissive-color', toColorStr(value), null);
  },
});
