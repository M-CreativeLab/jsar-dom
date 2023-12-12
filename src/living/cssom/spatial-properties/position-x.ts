import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('x');
  },
  set(value: string) {
    this._setProperty('x', toNumberStr(value), null);
  },
});
