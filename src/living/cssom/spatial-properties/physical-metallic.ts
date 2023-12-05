import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('physical-metallic');
  },
  set(value: string) {
    this._setProperty('physical-metallic', toNumberStr(value), null);
  },
});
