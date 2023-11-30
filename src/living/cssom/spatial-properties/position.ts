import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('position');
  },
  set(value: string) {
    this._setProperty('position', toNumberStr(value));
  },
});
