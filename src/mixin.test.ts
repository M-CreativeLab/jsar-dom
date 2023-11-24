import { describe, expect, it } from '@jest/globals';
import { applyMixins } from './mixin';

class Foobar {
  foo = 'foo';
  bar = 'bar';
  hello() {
    return `${this.foo}/${this.bar}`;
  }
}

class Countable {
  sum(a: number, b: number) {
    return a + b;
  }
}

describe('mixin', () => {
  it('should mixin one class into another', () => {
    interface Baz extends Foobar {};
    class Baz {
      public baz = 'baz';
      sayHello() {
        return `Hello, ${this.hello()}/${this.baz}`;
      }
    }
    applyMixins(Baz, [Foobar]);

    const baz = new Baz();
    baz.foo = '_foo_';
    baz.bar = '_bar_';
    expect(baz.sayHello()).toBe('Hello, _foo_/_bar_/baz');
  });

  it ('should mixin two classes into another', () => {
    interface CountableBaz extends Foobar, Countable {};
    class CountableBaz {
      public baz = 'baz';
      sayHello() {
        return `Hello, ${this.hello()}/${this.baz}`;
      }
    }
    applyMixins(CountableBaz, [Foobar, Countable]);

    const baz = new CountableBaz();
    baz.foo = '_foo_';
    baz.bar = '_bar_';
    expect(baz.sayHello()).toBe('Hello, _foo_/_bar_/baz');
    expect(baz.sum(1, 2)).toBe(3);
  });

  it('should mixin classes into a class which extends another class', () => {
    class Base {
      public foo = '__foo';
      public bar = '__bar';
    }
    interface CountableExtBaz extends Base, Foobar, Countable {};
    class CountableExtBaz extends Base {
      public baz = 'baz';
      sayHello() {
        return `Hello, ${this.hello()}/${this.baz}`;
      }
    }
    applyMixins(CountableExtBaz, [Foobar, Countable]);

    const baz = new CountableExtBaz();
    expect(baz.sayHello()).toBe('Hello, __foo/__bar/baz');
    expect(baz.sum(1, 2)).toBe(3);
  });
});
