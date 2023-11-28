/**
 * Applies mixins to a derived class.
 * 
 * @param derivedCtor - The derived class constructor.
 * @param constructors - An array of mixin constructors.
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      // Skip the name "constructor"
      if (name === 'constructor') {
        return;
      }
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
