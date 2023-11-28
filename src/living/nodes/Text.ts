import DOMException from 'domexception';
import { domSymbolTree } from '../helpers/internal-constants';
import { RangeImpl } from '../range/Range';
import { NodeImpl } from './Node';
import { assignSlot, assignSlotable, findSlot } from '../helpers/shadow-dom';
import { NativeDocument } from '../../impl-interfaces';
import CharacterDataImpl from './CharacterData';

export class TextImpl extends CharacterDataImpl implements Text {
  _slotableName: string = '';
  get assignedSlot() {
    return findSlot(this, 'open');
  }

  constructor(
    hostObject: NativeDocument,
    args,
    privateData: ConstructorParameters<typeof CharacterDataImpl>[2]
  ) {
    super(hostObject, args, privateData);
    this.nodeType = NodeImpl.TEXT_NODE;
  }

  _attrModifiedSlotableMixin(name, value, oldValue) {
    if (name === 'slot') {
      if (value === oldValue) {
        return;
      }

      if (value === null && oldValue === '') {
        return;
      }

      if (value === '' && oldValue === null) {
        return;
      }

      if (value === null || value === '') {
        this._slotableName = '';
      } else {
        this._slotableName = value;
      }

      if (this._assignedSlot) {
        assignSlotable(this._assignedSlot);
      }
      assignSlot(this);
    }
  }

  // https://dom.spec.whatwg.org/#dom-text-splittext
  // https://dom.spec.whatwg.org/#concept-text-split
  splitText(offset: number): Text {
    const { length } = this;
    if (offset > length) {
      throw new DOMException('The index is not in the allowed range.', 'IndexSizeError');
    }

    const count = length - offset;
    const newData = this.substringData(offset, count);
    const newNode = this._ownerDocument.createTextNode(newData);
    const parent = domSymbolTree.parent(this);

    if (parent !== null) {
      parent._insert(newNode, this.nextSibling);
      for (const range of this._referencedRanges as Set<RangeImpl>) {
        const { _start, _end } = range;
        if (_start.node as unknown as NodeImpl === this && _start.offset > offset) {
          range._setLiveRangeStart(newNode, _start.offset - offset);
        }
        if (_end.node as unknown as NodeImpl === this && _end.offset > offset) {
          range._setLiveRangeEnd(newNode, _end.offset - offset);
        }
      }

      const nodeIndex = domSymbolTree.index(this);
      for (const range of parent._referencedRanges) {
        const { _start, _end } = range;
        if (_start.node === parent && _start.offset === nodeIndex + 1) {
          range._setLiveRangeStart(parent, _start.offset + 1);
        }
        if (_end.node === parent && _end.offset === nodeIndex + 1) {
          range._setLiveRangeEnd(parent, _end.offset + 1);
        }
      }
    }
    this.replaceData(offset, count, '');
    return newNode;
  }

  // https://dom.spec.whatwg.org/#dom-text-wholetext
  get wholeText(): string {
    let wholeText = this.textContent;
    let next;
    let current = this;
    while ((next = domSymbolTree.previousSibling(current)) && next.nodeType === NodeImpl.prototype.TEXT_NODE) {
      wholeText = next.textContent + wholeText;
      current = next;
    }
    current = this;
    while ((next = domSymbolTree.nextSibling(current)) && next.nodeType === NodeImpl.prototype.TEXT_NODE) {
      wholeText += next.textContent;
      current = next;
    }
    return wholeText;
  }

  _initSlotableMixin() {
    this._slotableName = '';
  }
}
