import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('albedo-texture');
  },
  set(value: string) {
    this._setProperty('albedo-texture', toUrlStr(value), null);
  },
});
