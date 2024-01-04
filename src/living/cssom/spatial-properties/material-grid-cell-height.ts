import { defineSpatialProperty } from './helper';
import { toLengthStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('material-grid-cell-height');
  },
  set(value: string) {
    this._setProperty('material-grid-cell-height', toLengthStr(value), null);
  },
});
