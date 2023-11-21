import { NodeListImpl } from '../nodes/NodeList';

// https://dom.spec.whatwg.org/#mutationrecord
export class MutationRecordImpl implements MutationRecord {
  attributeName: string;
  attributeNamespace: string;
  nextSibling: Node;
  oldValue: string;
  previousSibling: Node;
  target: Node;
  type: MutationRecordType;

  _hostObject: any;
  _addedNodes: Node[];
  _removedNodes: Node[];

  constructor(hostObject, args, privateData) {
    this._hostObject = hostObject;

    this.type = privateData.type;
    this.target = privateData.target;
    this.previousSibling = privateData.previousSibling;
    this.nextSibling = privateData.nextSibling;
    this.attributeName = privateData.attributeName;
    this.attributeNamespace = privateData.attributeNamespace;
    this.oldValue = privateData.oldValue;

    this._addedNodes = privateData.addedNodes;
    this._removedNodes = privateData.removedNodes;
  }

  get addedNodes() {
    return new NodeListImpl(this._hostObject, [], {
      nodes: this._addedNodes,
    });
  }

  get removedNodes() {
    return new NodeListImpl(this._hostObject, [], {
      nodes: this._removedNodes,
    });
  }
}
