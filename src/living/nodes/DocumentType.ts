import { NativeDocument } from '../../impl-interfaces';
import { NodeImpl } from './Node';

export class DocumentTypeImpl extends NodeImpl implements DocumentType {
  name: string;
  publicId: string;
  systemId: string;

  constructor(
    hostObject: NativeDocument,
    _args,
    privateData: {
      name: string;
      publicId: string;
      systemId: string;
    }
  ) {
    super(hostObject, [], null);

    this.nodeType = this.DOCUMENT_TYPE_NODE;
    this.name = privateData.name;
    this.publicId = privateData.publicId;
    this.systemId = privateData.systemId;
  }

  after(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  before(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
  remove(): void {
    throw new Error('Method not implemented.');
  }
  replaceWith(...nodes: (string | Node)[]): void {
    throw new Error('Method not implemented.');
  }
}
