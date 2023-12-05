import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('ambient-color');
  },
  set(value: string) {
    this._setProperty('ambient-color', toColorStr(value), null);
  },
});
