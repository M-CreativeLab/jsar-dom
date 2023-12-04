import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

// load spatial props
import position from './position';
import rotation from './rotation';
import diffuseColor from './diffuse-color';

export interface CSSSpatialStyleProperties {
  position: string;
  rotation: string;
  // scale: string;
  'diffuse-color': string;
  diffuseColor: string;
}

export function mixinWithSpatialStyleProperties(spatialStyleDeclaration: CSSSpatialStyleDeclaration) {
  Object.defineProperties(spatialStyleDeclaration, {
    position,
    rotation,
    diffuseColor,
    'diffuse-color': diffuseColor,
  });
}
