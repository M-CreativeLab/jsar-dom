import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

// load spatial props
import position from './position';
import rotation from './rotation';
import scaling from './scaling';
import material from './material';
import materialType from './material-type';
import materialOrientation from './material-orientation';
import wireframe from './wireframe';
import diffuseColor from './diffuse-color';
import diffuseTexture from './diffuse-texture';
import ambientColor from './ambient-color';
import emissiveColor from './emissive-color';
import specularColor from './specular-color';
import specularPower from './specular-power';
import albedoColor from './albedo-color';
import albedoTexture from './albedo-texture';
import physicalMetallic from './physical-metallic';
import physicalRoughness from './physical-roughness';

export interface CSSSpatialStyleProperties {
  position: string;
  rotation: string;
  scaling: string;
  material: string;
  'material-type': string;
  materialType: string;
  'material-orientation': string;
  materialOrientation: string;
  wireframe: string;

  // Standard material
  'diffuse-color': string;
  diffuseColor: string;
  'diffuse-texture': string;
  diffuseTexture: string;
  'ambient-color': string;
  ambientColor: string;
  'emissive-color': string;
  emissiveColor: string;
  'specular-color': string;
  specularColor: string;
  'specular-power': string;
  specularPower: string;

  // PBR material
  'physical-metallic': string;
  physicalMetallic: string;
  'physical-roughness': string;
  physicalRoughness: string;
  'albedo-color': string;
  albedoColor: string;
  'albedo-texture': string;
  albedoTexture: string;
}

export function mixinWithSpatialStyleProperties(spatialStyleDeclaration: CSSSpatialStyleDeclaration) {
  Object.defineProperties(spatialStyleDeclaration, {
    position,
    rotation,
    scaling,
    material,
    'material-type': materialType,
    materialType,
    'material-orientation': materialOrientation,
    materialOrientation,
    wireframe,

    'diffuse-color': diffuseColor,
    diffuseColor,
    'diffuse-texture': diffuseTexture,
    diffuseTexture,
    'ambient-color': ambientColor,
    ambientColor,
    'emissive-color': emissiveColor,
    emissiveColor,
    'specular-color': specularColor,
    specularColor,
    'specular-power': specularPower,
    specularPower,

    'physical-metallic': physicalMetallic,
    physicalMetallic,
    'physical-roughness': physicalRoughness,
    physicalRoughness,
    'albedo-color': albedoColor,
    albedoColor,
    'albedo-texture': albedoTexture,
    albedoTexture,
  });
}
