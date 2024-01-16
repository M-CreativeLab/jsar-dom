export default class XRInputSourceArrayImpl extends Array<XRInputSource> implements XRInputSourceArray {
  static createFromIterator(sourcesIterator: IterableIterator<XRInputSource>): XRInputSourceArrayImpl {
    const arr = new XRInputSourceArrayImpl();
    for (const source of sourcesIterator) {
      arr.push(source);
    }
    return arr;
  }
}
