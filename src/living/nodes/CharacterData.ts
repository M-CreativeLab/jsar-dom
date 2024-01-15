import { NativeDocument } from '../../impl-interfaces';
import { MUTATION_TYPE, queueMutationRecord } from '../helpers/mutation-observers';
import { RangeImpl } from '../range/Range';
import { NodeImpl } from './Node';

export default class CharacterDataImpl extends NodeImpl implements CharacterData {
  _data: string;

  constructor(
    hostObject: NativeDocument,
    _args,
    privateData: {
      data: string;
    }
  ) {
    super(hostObject, [], null);
    this._data = privateData.data;
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-data
  get data(): string {
    return this._data;
  }
  set data(data: string) {
    this.replaceData(0, this.length, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-length
  get length(): number {
    return this._data.length;
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-appenddata
  appendData(data: string): void {
    this.replaceData(this.length, 0, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-deletedata
  deleteData(offset: number, count: number): void {
    this.replaceData(offset, count, '');
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-insertdata
  insertData(offset: number, data: string): void {
    this.replaceData(offset, 0, data);
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-replacedata
  // https://dom.spec.whatwg.org/#concept-cd-replace
  replaceData(offset: number, count: number, data: string): void {
    const { length } = this;

    if (offset > length) {
      throw new DOMException(
        'The index is not in the allowed range.',
        'IndexSizeError'
      );
    }

    if (offset + count > length) {
      count = length - offset;
    }

    queueMutationRecord(MUTATION_TYPE.CHARACTER_DATA, this, null, null, this._data, [], [], null, null);

    const start = this._data.slice(0, offset);
    const end = this._data.slice(offset + count);
    this._data = start + data + end;

    for (const range of this._referencedRanges as Set<RangeImpl>) {
      const { _start, _end } = range;

      if (_start.node as unknown as NodeImpl === this && _start.offset > offset && _start.offset <= offset + count) {
        range._setLiveRangeStart(this, offset);
      }

      if (_end.node as unknown as NodeImpl === this && _end.offset > offset && _end.offset <= offset + count) {
        range._setLiveRangeEnd(this, offset);
      }

      if (_start.node as unknown as NodeImpl === this && _start.offset > offset + count) {
        range._setLiveRangeStart(this, _start.offset + data.length - count);
      }

      if (_end.node as unknown as NodeImpl === this && _end.offset > offset + count) {
        range._setLiveRangeEnd(this, _end.offset + data.length - count);
      }
    }

    if (this.nodeType === this.TEXT_NODE && this.parentNode) {
      // this.parentNode._childTextContentChangeSteps();
    }
  }

  // https://dom.spec.whatwg.org/#dom-characterdata-substringdata
  // https://dom.spec.whatwg.org/#concept-cd-substring
  substringData(offset: number, count: number): string {
    const { length } = this;
    if (offset > length) {
      throw new DOMException('The index is not in the allowed range.', 'IndexSizeError');
    }
    if (offset + count > length) {
      return this._data.slice(offset);
    }
    return this._data.slice(offset, offset + count);
  }
  after(...nodes: (string | Node)[]): void {
    throw new Error('The method "CharacterData.prototype.after()" not implemented.');
  }
  before(...nodes: (string | Node)[]): void {
    throw new Error('The method "CharacterData.prototype.before()" not implemented.');
  }
  remove(): void {
    throw new Error('The method "CharacterData.prototype.remove()" not implemented.');
  }
  replaceWith(...nodes: (string | Node)[]): void {
    throw new Error('The method "CharacterData.prototype.replaceWith()" not implemented.');
  }
  nextElementSibling: Element;
  previousElementSibling: Element;
}
