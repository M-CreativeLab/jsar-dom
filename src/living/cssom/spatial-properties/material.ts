import { defineSpatialProperty } from './helper';
import { toStringStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material');
  },
  set(value: string) {
    this._setProperty('material', toStringStr(value), null);
  },
});
