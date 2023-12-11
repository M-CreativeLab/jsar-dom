import { CSSAnimation } from './type';

const defaults: Omit<CSSAnimation, 'name'> = {
  duration: 'unset',
  delay: 'unset',
  timingFunction: 'unset',
  iterationCount: 'unset',
  direction: 'unset',
  fillMode: 'unset',
  playState: 'unset',
};

export const fillAnimation = (patch: Partial<CSSAnimation> & { name: string }): CSSAnimation => ({ ...defaults, ...patch });
