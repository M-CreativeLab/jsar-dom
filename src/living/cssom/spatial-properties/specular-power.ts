import { defineSpatialProperty } from './helper';
import { toNumberStr } from '../parsers';

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('specular-power');
  },
  set(value: string) {
    this._setProperty('specular-power', toNumberStr(value), null);
  },
});
