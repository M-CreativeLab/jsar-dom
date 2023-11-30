import { defineSpatialProperty } from './helper';
import { toAngleStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('rotation');
  },
  set(value: string) {
    this._setProperty('rotation', toAngleStr(value));
  },
});
