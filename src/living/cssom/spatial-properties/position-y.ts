import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('y');
  },
  set(value: string) {
    this._setProperty('y', toNumberStr(value), null);
  },
});
