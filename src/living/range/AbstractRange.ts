export interface BoundaryPoint {
  node: Node;
  offset: number;
}

// https://dom.spec.whatwg.org/#abstractrange
export class AbstractRangeImpl implements AbstractRange {
  _hostObject: any;
  _start: BoundaryPoint;
  _end: BoundaryPoint;

  constructor(hostObject, args, privateData) {
    const { start, end } = privateData;

    this._start = start;
    this._end = end;
    this._hostObject = hostObject;
  }

  // https://dom.spec.whatwg.org/#dom-range-startcontainer
  get startContainer() {
    return this._start.node;
  }

  // https://dom.spec.whatwg.org/#dom-range-startoffset
  get startOffset() {
    return this._start.offset;
  }

  // https://dom.spec.whatwg.org/#dom-range-endcontainer
  get endContainer() {
    return this._end.node;
  }

  // https://dom.spec.whatwg.org/#dom-range-endoffset
  get endOffset() {
    return this._end.offset;
  }

  // https://dom.spec.whatwg.org/#dom-range-collapsed
  get collapsed() {
    const { _start, _end } = this;
    return _start.node === _end.node && _start.offset === _end.offset;
  }
}
