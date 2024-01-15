import type { BaseWindowImpl } from '../../agent/window';
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
      defaultView: BaseWindowImpl;
    }
  ) {
    super(hostObject, [], {
      defaultView: privateData.defaultView,
    });

    this.nodeType = this.DOCUMENT_TYPE_NODE;
    this.name = privateData.name;
    this.publicId = privateData.publicId;
    this.systemId = privateData.systemId;
  }

  after(...nodes: (string | Node)[]): void {
    throw new Error('The method "DocumentType.prototype.after()" not implemented.');
  }
  before(...nodes: (string | Node)[]): void {
    throw new Error('The method "DocumentType.prototype.before()" not implemented.');
  }
  remove(): void {
    throw new Error('The method "DocumentType.prototype.remove()" not implemented.');
  }
  replaceWith(...nodes: (string | Node)[]): void {
    throw new Error('The method "DocumentType.prototype.replaceWith()" not implemented.');
  }
}
