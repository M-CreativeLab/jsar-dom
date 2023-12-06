import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('ambient-texture');
  },
  set(value: string) {
    this._setProperty('ambient-texture', toUrlStr(value), null);
  },
});
