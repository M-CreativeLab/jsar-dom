import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('specular-color');
  },
  set(value: string) {
    this._setProperty('specular-color', toColorStr(value), null);
  },
});
