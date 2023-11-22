import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLMetaElementImpl extends HTMLElementImpl implements HTMLMetaElement {
  content: string;
  httpEquiv: string;
  media: string;
  name: string;
  scheme: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'meta',
    });
  }
}