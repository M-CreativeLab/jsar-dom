import { NativeDocument } from '../../impl-interfaces';
import { childTextContent } from '../helpers/text';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLTitleElementImpl extends HTMLElementImpl implements HTMLTitleElement {
  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {}
  ) {
    super(nativeDocument, args, {
      localName: 'title',
    });
  }

  get text(): string {
    return childTextContent(this);
  }

  set text(value: string) {
    this.textContent = value;
  }
}
