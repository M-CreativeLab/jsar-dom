export const DIRTY_SYMBOL = Symbol('__dirty__');
export const MIME_TYPE_SYMBOL = Symbol('__mimeType__');

/**
 * The Symbol used to store the guid in the transmute protocol, which is such important because it's used to
 * identify a game object in the running mode.
 */
export const SPATIAL_OBJECT_GUID_SYMBOL = Symbol('__spatialObjectGuid__');

/**
 * The Symbol used to store the craft3d node, which is used for layout algorithms in space.
 */
export const SPATIAL_ELEMENT_CRAFT3D_NODE_SYMBOL = Symbol('__spatialElementCraft3dNode__');
