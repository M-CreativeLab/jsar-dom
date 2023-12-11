export interface CodePointTest {
  (cp?: number): cp is number,
}

export interface CSSCubicBezier {
  type: 'cubic-bezier',
  value: [number, number, number, number],
}

export type CSSStepDirection =
  | 'jump-start'
  | 'jump-end'
  | 'jump-none'
  | 'jump-both'
  | 'start'
  | 'end';

export interface CSSSteps {
  type: 'steps',
  stepCount: number,
  direction: CSSStepDirection,
}

export type CSSTimingFunctionKeyword =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'step-start'
  | 'step-end';

export type CSSTimingFunction = CSSCubicBezier | CSSSteps | CSSTimingFunctionKeyword;

export type CSSAnimationDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

export type CSSAnimationFillMode =
  | 'none'
  | 'forwards'
  | 'backwards'
  | 'both';

export type CSSAnimationPlayState =
  | 'paused'
  | 'running';

export interface CSSAnimation {
  name: string,
  duration: number | 'unset',
  timingFunction: CSSTimingFunction | 'unset',
  delay: number | 'unset',
  iterationCount: number | 'infinite' | 'unset',
  direction: CSSAnimationDirection | 'unset',
  fillMode: CSSAnimationFillMode | 'unset',
  playState: CSSAnimationPlayState | 'unset',
}
