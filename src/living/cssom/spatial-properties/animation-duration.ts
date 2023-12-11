import { defineSpatialProperty } from './helper';
import { toTimespanStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('animation-duration');
  },
  set(value: string | number) {
    this._setProperty('animation-duration', toTimespanStr(value), null);
  },
});
