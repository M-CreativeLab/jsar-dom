import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

type SpatialPropertyDescriptor = Omit<PropertyDescriptor, 'get' | 'set'> & {
  get?(this: CSSSpatialStyleDeclaration): string;
  set?(this: CSSSpatialStyleDeclaration, value: string): void;
};

export function defineSpatialProperty(descriptor: SpatialPropertyDescriptor) {
  return descriptor;
}
