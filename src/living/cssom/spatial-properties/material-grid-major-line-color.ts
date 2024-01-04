import { defineSpatialProperty } from './helper';
import { toColorStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material-grid-major-line-color');
  },
  set(value: string) {
    this._setProperty('material-grid-major-line-color', toColorStr(value), null);
  },
});
