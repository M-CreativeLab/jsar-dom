import { defineSpatialProperty } from './helper';
import { shorthandGetter, shorthandSetter, type ShorthandFor } from '../parsers';

import AnimationName from './animation-name';
import AnimationDuration from './animation-duration';
import AnimationIterationCount from './animation-iteration-count';

const shorthandFor: ShorthandFor = {
  'animation-name': AnimationName,
  'animation-duration': AnimationDuration,
  'animation-iteration-count': AnimationIterationCount,
};

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get: shorthandGetter('animation', shorthandFor),
  set: shorthandSetter('animation', shorthandFor),
});
