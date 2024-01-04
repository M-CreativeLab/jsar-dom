import type CSSSpatialStyleDeclaration from '../CSSSpatialStyleDeclaration';

// load spatial props
import position from './position';
import rotation from './rotation';
import scaling from './scaling';
import positionX from './position-x';
import positionY from './position-y';
import positionZ from './position-z';
import animation from './animation';
import animationName from './animation-name';
import animationDuration from './animation-duration';
import animationIterationCount from './animation-iteration-count';
import material from './material';
import materialType from './material-type';
import materialAlphaMode from './material-alpha-mode';
import materialOrientation from './material-orientation';
import materialGridBackgroundColor from './material-grid-background-color';
import materialGridWidth from './material-grid-width';
import materialGridHeight from './material-grid-height';
import materialGridCellWidth from './material-grid-cell-width';
import materialGridCellHeight from './material-grid-cell-height';
import materialGridMajorLineColor from './material-grid-major-line-color';
import materialGridMinorLineColor from './material-grid-minor-line-color';
import wireframe from './wireframe';
import diffuseColor from './diffuse-color';
import diffuseTexture from './diffuse-texture';
import ambientColor from './ambient-color';
import ambientTexture from './ambient-texture';
import emissiveColor from './emissive-color';
import emissiveTexture from './emissive-texture';
import specularColor from './specular-color';
import specularTexture from './specular-texture';
import specularPower from './specular-power';
import bumpTexture from './bump-texture';
import albedoColor from './albedo-color';
import albedoTexture from './albedo-texture';
import physicalMetallic from './physical-metallic';
import physicalRoughness from './physical-roughness';

export interface CSSSpatialStyleProperties {
  position: string;
  rotation: string;
  scaling: string;
  x: string;
  y: string;
  z: string;
  animation: string;
  'animation-name': string;
  animationName: string;
  'animation-duration': string;
  animationDuration: string;
  'animation-iteration-count': string;
  animationIterationCount: string;
  material: string;
  'material-type': string;
  materialType: string;
  'material-alpha-mode': string;
  materialAlphaMode: string;
  'material-orientation': string;
  materialOrientation: string;
  'material-grid-background-color': string;
  materialGridBackgroundColor: string;
  'material-grid-width': string;
  materialGridWidth: string;
  'material-grid-height': string;
  materialGridHeight: string;
  'material-grid-cell-width': string;
  materialGridCellWidth: string;
  'material-grid-cell-height': string;
  materialGridCellHeight: string;
  'material-grid-major-line-color': string;
  materialGridMajorLineColor: string;
  'material-grid-minor-line-color': string;
  materialGridMinorLineColor: string;
  wireframe: string;

  // Standard material
  'diffuse-color': string;
  diffuseColor: string;
  'diffuse-texture': string;
  diffuseTexture: string;
  'ambient-color': string;
  ambientColor: string;
  'ambient-texture': string;
  ambientTexture: string;
  'emissive-color': string;
  emissiveColor: string;
  'emissive-texture': string;
  emissiveTexture: string;
  'specular-color': string;
  specularColor: string;
  'specular-texture': string;
  specularTexture: string;
  'specular-power': string;
  specularPower: string;
  'bump-texture': string;
  bumpTexture: string;

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
    x: positionX,
    y: positionY,
    z: positionZ,
    animation,
    'animation-name': animationName,
    animationName,
    'animation-duration': animationDuration,
    animationDuration,
    'animation-iteration-count': animationIterationCount,
    animationIterationCount,
    material,
    'material-type': materialType,
    materialType,
    'material-alpha-mode': materialAlphaMode,
    materialAlphaMode,
    'material-orientation': materialOrientation,
    materialOrientation,
    'material-grid-background-color': materialGridBackgroundColor,
    materialGridBackgroundColor,
    'material-grid-width': materialGridWidth,
    materialGridWidth,
    'material-grid-height': materialGridHeight,
    materialGridHeight,
    'material-grid-cell-width': materialGridCellWidth,
    materialGridCellWidth,
    'material-grid-cell-height': materialGridCellHeight,
    materialGridCellHeight,
    'material-grid-major-line-color': materialGridMajorLineColor,
    materialGridMajorLineColor,
    'material-grid-minor-line-color': materialGridMinorLineColor,
    materialGridMinorLineColor,
    wireframe,

    'diffuse-color': diffuseColor,
    diffuseColor,
    'diffuse-texture': diffuseTexture,
    diffuseTexture,
    'ambient-color': ambientColor,
    ambientColor,
    'ambient-texture': ambientTexture,
    ambientTexture,
    'emissive-color': emissiveColor,
    emissiveColor,
    'emissive-texture': emissiveTexture,
    emissiveTexture,
    'specular-color': specularColor,
    specularColor,
    'specular-texture': specularTexture,
    specularTexture,
    'specular-power': specularPower,
    specularPower,
    'bump-texture': bumpTexture,
    bumpTexture,

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
