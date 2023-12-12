import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('z');
  },
  set(value: string) {
    this._setProperty('z', toNumberStr(value), null);
  },
});
