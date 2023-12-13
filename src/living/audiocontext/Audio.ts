import type { NativeDocument } from '../../impl-interfaces';
import HTMLAudioElementImpl from '../nodes/HTMLAudioElement';

export function createAudioConstructor(hostObject: NativeDocument) {
  return class Audio extends HTMLAudioElementImpl {
    constructor(src?: string) {
      super(hostObject, []);
      this.src = src;
    }
  };
}
