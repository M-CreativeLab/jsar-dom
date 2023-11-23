export default class OrderedSet<T extends string> {
  _items: T[] = [];

  get size() {
    return this._items.length;
  }

  isEmpty() {
    return this.size === 0;
  }

  contains(item: T): boolean {
    return this._items.includes(item);
  }

  append(item: T) {
    if (!this.contains(item)) {
      this._items.push(item);
    }
  }

  prepend(item: T) {
    if (!this.contains(item)) {
      this._items.unshift(item);
    }
  }

  replace(item: T, replacement: T) {
    let seen = false;
    for (let i = 0; i < this._items.length;) {
      const isInstance = this._items[i] === item || this._items[i] === replacement;
      if (seen && isInstance) {
        this._items.splice(i, 1);
      } else {
        if (isInstance) {
          this._items[i] = replacement;
          seen = true;
        }
        i++;
      }
    }
  }

  remove(...items: T[]) {
    this.removePredicate(item => items.includes(item));
  }

  removePredicate(predicate: (item: T) => boolean) {
    for (let i = 0; i < this._items.length;) {
      if (predicate(this._items[i])) {
        this._items.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  empty() {
    this._items.length = 0;
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }

  keys() {
    return this._items.keys();
  }

  get(index: number) {
    return this._items[index];
  }

  some(predicate: (item: T) => boolean) {
    return this._items.some(predicate);
  }

  // https://dom.spec.whatwg.org/#concept-ordered-set-serializer
  serialize() {
    return this._items.join(' ');
  }

  // https://dom.spec.whatwg.org/#concept-ordered-set-parser
  static parse(input: string) {
    const tokens = new OrderedSet();
    for (const token of input.split(/[\t\n\f\r ]+/)) {
      if (token) {
        tokens.append(token);
      }
    }
    return tokens;
  }
}
