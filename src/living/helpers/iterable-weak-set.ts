export default class IterableWeakSet<T extends WeakKey> {
  _refSet = new Set<WeakRef<T>>();
  _refMap = new Map<T, WeakRef<T>>();
  _finalizationRegistry = new FinalizationRegistry(({ ref, set }) => set.delete(ref));

  add(value: T): this {
    if (!this._refMap.has(value)) {
      const ref = new WeakRef(value);
      this._refMap.set(value, ref);
      this._refSet.add(ref);
      this._finalizationRegistry.register(value, { ref, set: this._refSet }, ref);
    }
    return this;
  }

  delete(value: T): boolean {
    const ref = this._refMap.get(value);
    if (!ref) {
      return false;
    }
    this._refMap.delete(value);
    this._refSet.delete(ref);
    this._finalizationRegistry.unregister(ref);
    return true;
  }

  has(value: T): boolean {
    return this._refMap.has(value);
  }

  *[Symbol.iterator]() {
    for (const ref of this._refSet) {
      const value = ref.deref();
      if (value === undefined) {
        continue;
      }
      yield value;
    }
  }
}
