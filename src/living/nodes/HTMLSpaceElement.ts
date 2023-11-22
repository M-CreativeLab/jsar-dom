import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLSpaceElement extends HTMLElementImpl {
  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'space',
    });
  }
}
