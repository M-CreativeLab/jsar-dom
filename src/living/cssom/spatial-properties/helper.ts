import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

type SpatialPropertyDescriptor = Omit<PropertyDescriptor, 'get' | 'set'> & {
  get?(this: CSSSpatialStyleDeclaration): string;
  set?(this: CSSSpatialStyleDeclaration, value: string): void;
};

type Extras = {
  isValid: (v: any, ...extra: any[]) => boolean;
};

export function defineSpatialProperty(
  descriptor: SpatialPropertyDescriptor,
  extra?: Partial<Extras>
): SpatialPropertyDescriptor & Extras {
  const combinedDescriptor: SpatialPropertyDescriptor & Extras = {
    ...descriptor,
    isValid: () => true,
  };
  if (typeof extra?.isValid === 'function') {
    combinedDescriptor.isValid = extra.isValid;
  }
  return combinedDescriptor;
}
