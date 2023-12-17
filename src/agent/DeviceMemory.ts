import { NavigatorImpl } from './navigator';

export default interface DeviceMemoryImpl extends NavigatorImpl { };
export default class DeviceMemoryImpl {
  get deviceMemory(): number {
    return this._nativeUserAgent.deviceMemory;
  }
}
