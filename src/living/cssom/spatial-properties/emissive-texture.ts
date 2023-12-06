import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('emissive-texture');
  },
  set(value: string) {
    this._setProperty('emissive-texture', toUrlStr(value), null);
  },
});
