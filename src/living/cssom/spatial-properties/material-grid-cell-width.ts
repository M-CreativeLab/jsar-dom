import { defineSpatialProperty } from './helper';
import { toLengthStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material-grid-cell-width');
  },
  set(value: string) {
    this._setProperty('material-grid-cell-width', toLengthStr(value), null);
  },
});
