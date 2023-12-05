import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

// load spatial props
import position from './position';
import rotation from './rotation';
import material from './material';
import wireframe from './wireframe';
import diffuseColor from './diffuse-color';
import ambientColor from './ambient-color';
import emissiveColor from './emissive-color';
import specularColor from './specular-color';
import specularPower from './specular-power';

export interface CSSSpatialStyleProperties {
  position: string;
  rotation: string;
  // scale: string;
  material: string;
  wireframe: string;

  // Standard material
  'diffuse-color': string;
  diffuseColor: string;
  'ambient-color': string;
  ambientColor: string;
  'emissive-color': string;
  emissiveColor: string;
  'specular-color': string;
  specularColor: string;
  'specular-power': string;
  specularPower: string;
}

export function mixinWithSpatialStyleProperties(spatialStyleDeclaration: CSSSpatialStyleDeclaration) {
  Object.defineProperties(spatialStyleDeclaration, {
    position,
    rotation,
    material,
    wireframe,

    diffuseColor,
    'diffuse-color': diffuseColor,
    ambientColor,
    'ambient-color': ambientColor,
    emissiveColor,
    'emissive-color': emissiveColor,
    specularColor,
    'specular-color': specularColor,
    specularPower,
    'specular-power': specularPower,
  });
}
