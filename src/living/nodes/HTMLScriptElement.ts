import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

const jsMIMETypes = new Set([
  'application/javascript',
  'application/typescript',
  'text/javascript',
  'text/typescript',
]);

export default class HTMLScriptElementImpl extends HTMLElementImpl implements HTMLScriptElement {
  async: boolean;
  charset: string;
  crossOrigin: string;
  defer: boolean;
  event: string;
  htmlFor: string;
  integrity: string;
  noModule: boolean;
  referrerPolicy: string;
  src: string;
  text: string;
  type: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {}
  ) {
    super(nativeDocument, args, {
      localName: 'script',
    });
  }
}
