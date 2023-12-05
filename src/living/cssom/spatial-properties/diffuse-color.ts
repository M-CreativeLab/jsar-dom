import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('diffuse-color');
  },
  set(value: string) {
    this._setProperty('diffuse-color', toColorStr(value), null);
  },
});
