const IS_NAMED_PROPERTY = Symbol('is named property');
const TRACKER = Symbol('named property tracker');

interface ResolverFunction {
  (object: any, name: string, getValues: () => Set<any>): any;
}

export function create(object: any, objectProxy: any, resolverFunc: ResolverFunction) {
  if (object[TRACKER]) {
    throw Error('A NamedPropertiesTracker has already been created for this object');
  }

  const tracker = new NamedPropertiesTracker(object, objectProxy, resolverFunc);
  object[TRACKER] = tracker;
  return tracker;
}

export function get(object: any) {
  if (!object) {
    return null;
  }
  return object[TRACKER] || null;
}

class NamedPropertiesTracker {
  private object: any;
  private objectProxy: any;
  private resolverFunc: ResolverFunction;
  private trackedValues: Map<string, Set<any>> = new Map();

  constructor(object: any, objectProxy: any, resolverFunc: ResolverFunction) {
    this.object = object;
    this.objectProxy = objectProxy;
    this.resolverFunc = resolverFunc;
  }

  private newPropertyDescriptor(name: string) {
    const emptySet = new Set<any>();

    function getValues() {
      return this.trackedValues.get(name) || emptySet;
    }

    const descriptor: PropertyDescriptor = {
      enumerable: true,
      configurable: true,
      get: () => {
        return this.resolverFunc(this.object, name, getValues);
      },
      set: (value: any) => {
        Object.defineProperty(this.object, name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        });
      },
    };

    descriptor.get![IS_NAMED_PROPERTY] = true;
    descriptor.set![IS_NAMED_PROPERTY] = true;
    return descriptor;
  }

  track(name: string, value: any) {
    if (!name) {
      return;
    }

    let valueSet = this.trackedValues.get(name);
    if (!valueSet) {
      valueSet = new Set();
      this.trackedValues.set(name, valueSet);
    }

    valueSet.add(value);

    if (name in this.objectProxy) {
      return;
    }

    const descriptor = this.newPropertyDescriptor(name);
    Object.defineProperty(this.object, name, descriptor);
  }

  untrack(name: string, value: any) {
    if (!name) {
      return;
    }

    const valueSet = this.trackedValues.get(name);
    if (!valueSet) {
      return;
    }

    if (!valueSet.delete(value)) {
      return;
    }

    if (valueSet.size === 0) {
      this.trackedValues.delete(name);
    }

    if (valueSet.size > 0) {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(this.object, name);

    if (!descriptor || !descriptor.get || descriptor.get![IS_NAMED_PROPERTY] !== true) {
      return;
    }

    delete this.object[name];
  }
}
