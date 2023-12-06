import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('specular-texture');
  },
  set(value: string) {
    this._setProperty('specular-texture', toUrlStr(value), null);
  },
});
