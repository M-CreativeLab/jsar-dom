import { it } from '@jest/globals';
import { NodeImpl } from './nodes/Node';

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type Expect<T extends true> = T;

type FindValidFields<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

type CheckStrictCompatible<
  StandardType,
  ImplType extends StandardType,
  Checked = {
    [k in keyof StandardType]: Equal<StandardType[k], ImplType[k]> extends true
      ? never
      : [StandardType[k], ImplType[k]];
  }
> = Pick<Checked, FindValidFields<Checked>>;

/**
 * Check the consistency between the jsar-dom implementation and the standard dom implementation,
 * return the incompatible fields.
 */
type IncompatibleFields = CheckStrictCompatible<Node, NodeImpl>;

type cases = [Expect<Equal<{}, IncompatibleFields>>];

/**
 * placeholder for jest, DO NOT REMOVE IT.
 */
it.todo('placeholder test');
