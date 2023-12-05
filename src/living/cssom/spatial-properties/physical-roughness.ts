import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('physical-roughness');
  },
  set(value: string) {
    this._setProperty('physical-roughness', toNumberStr(value), null);
  },
});
