export * from './type';
import {parseSingleAnimationShorthand} from './parseSingleAnimationShorthand';
export const parseSingle = parseSingleAnimationShorthand;
import {parseAnimationShorthand} from './parseAnimationShorthand';
export const parse = (input: string) => [...parseAnimationShorthand(input)];
import {serializeAnimation} from './serializeAnimation';
export const serialize = serializeAnimation;
