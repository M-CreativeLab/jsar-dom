import { defineSpatialProperty } from './helper';
import { toUrlStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('bump-texture');
  },
  set(value: string) {
    this._setProperty('bump-texture', toUrlStr(value), null);
  },
});
