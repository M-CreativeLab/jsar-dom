import type { NativeDocument } from '../../impl-interfaces';
import HTMLMediaElementImpl from './HTMLMediaElement';

export default class HTMLAudioElementImpl extends HTMLMediaElementImpl implements HTMLAudioElement {
  constructor(
    hostObject: NativeDocument,
    args: any[],
    _privateData = null
  ) {
    super(hostObject, args, { localName: 'audio' });
  }
}
