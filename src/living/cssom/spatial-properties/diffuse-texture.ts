import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('diffuse-texture');
  },
  set(value: string) {
    this._setProperty('diffuse-texture', toUrlStr(value), null);
  },
});
