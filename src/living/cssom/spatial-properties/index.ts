import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

// load spatial props
import position from './position';
import rotation from './rotation';
import material from './material';
import diffuseColor from './diffuse-color';
import wireframe from './wireframe';

export interface CSSSpatialStyleProperties {
  position: string;
  rotation: string;
  // scale: string;
  material: string;
  wireframe: string;
  'diffuse-color': string;
  diffuseColor: string;
}

export function mixinWithSpatialStyleProperties(spatialStyleDeclaration: CSSSpatialStyleDeclaration) {
  Object.defineProperties(spatialStyleDeclaration, {
    position,
    rotation,
    material,
    wireframe,
    diffuseColor,
    'diffuse-color': diffuseColor,
  });
}
