import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLLinkElementImpl extends HTMLElementImpl implements HTMLLinkElement {
  as: string;
  charset: string;
  crossOrigin: string;
  disabled: boolean;
  href: string;
  hreflang: string;
  imageSizes: string;
  imageSrcset: string;
  integrity: string;
  media: string;
  referrerPolicy: string;
  rel: string;
  relList: DOMTokenList;
  rev: string;
  sizes: DOMTokenList;
  target: string;
  type: string;
  sheet: CSSStyleSheet;

  constructor(
    hostObject: NativeDocument,
    args,
    privateData = null
  ) {
    super(hostObject, args, { localName: 'link' });
  }
}
