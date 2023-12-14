import type {
    IScene,
    INode,
    IMesh,
    ISkin,
    ICamera,
    IMeshPrimitive,
    IMaterial,
    ITextureInfo,
    IAnimation,
    ITexture,
    IBufferView,
    IBuffer,
    IAnimationChannel,
} from './glTFLoaderInterfaces';
import type { IGLTFLoaderExtension as IGLTFBaseLoaderExtension } from '../glTFFileLoader';
import type { IProperty } from 'babylonjs-gltf2interface';

/**
 * Interface for a glTF loader extension.
 */
export interface IGLTFLoaderExtension extends IGLTFBaseLoaderExtension, BABYLON.IDisposable {
    /**
     * Called after the loader state changes to LOADING.
     */
    onLoading?(): void;

    /**
     * Called after the loader state changes to READY.
     */
    onReady?(): void;

    /**
     * Define this method to modify the default behavior when loading scenes.
     * @param context The context when loading the asset
     * @param scene The glTF scene property
     * @returns A promise that resolves when the load is complete or null if not handled
     */
    loadSceneAsync?(context: string, scene: IScene): BABYLON.Nullable<Promise<void>>;

    /**
     * Define this method to modify the default behavior when loading nodes.
     * @param context The context when loading the asset
     * @param node The glTF node property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon transform node when the load is complete or null if not handled
     */
    loadNodeAsync?(context: string, node: INode, assign: (babylonMesh: BABYLON.TransformNode) => void): BABYLON.Nullable<Promise<BABYLON.TransformNode>>;

    /**
     * Define this method to modify the default behavior when loading cameras.
     * @param context The context when loading the asset
     * @param camera The glTF camera property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon camera when the load is complete or null if not handled
     */
    loadCameraAsync?(context: string, camera: ICamera, assign: (babylonCamera: BABYLON.Camera) => void): BABYLON.Nullable<Promise<BABYLON.Camera>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading vertex data for mesh primitives.
     * @param context The context when loading the asset
     * @param primitive The glTF mesh primitive property
     * @returns A promise that resolves with the loaded geometry when the load is complete or null if not handled
     */
    _loadVertexDataAsync?(context: string, primitive: IMeshPrimitive, babylonMesh: BABYLON.Mesh): BABYLON.Nullable<Promise<BABYLON.Geometry>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading data for mesh primitives.
     * @param context The context when loading the asset
     * @param name The mesh name when loading the asset
     * @param node The glTF node when loading the asset
     * @param mesh The glTF mesh when loading the asset
     * @param primitive The glTF mesh primitive property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
     */
    _loadMeshPrimitiveAsync?(
        context: string,
        name: string,
        node: INode,
        mesh: IMesh,
        primitive: IMeshPrimitive,
        assign: (babylonMesh: BABYLON.AbstractMesh) => void
    ): BABYLON.Nullable<Promise<BABYLON.AbstractMesh>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading materials. Load material creates the material and then loads material properties.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon material when the load is complete or null if not handled
     */
    _loadMaterialAsync?(
        context: string,
        material: IMaterial,
        babylonMesh: BABYLON.Nullable<BABYLON.Mesh>,
        babylonDrawMode: number,
        assign: (babylonMaterial: BABYLON.Material) => void
    ): BABYLON.Nullable<Promise<BABYLON.Material>>;

    /**
     * Define this method to modify the default behavior when creating materials.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonDrawMode The draw mode for the Babylon material
     * @returns The Babylon material or null if not handled
     */
    createMaterial?(context: string, material: IMaterial, babylonDrawMode: number): BABYLON.Nullable<BABYLON.Material>;

    /**
     * Define this method to modify the default behavior when loading material properties.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete or null if not handled
     */
    loadMaterialPropertiesAsync?(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;

    /**
     * Define this method to modify the default behavior when loading texture infos.
     * @param context The context when loading the asset
     * @param textureInfo The glTF texture info property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
     */
    loadTextureInfoAsync?(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BABYLON.BaseTexture) => void): BABYLON.Nullable<Promise<BABYLON.BaseTexture>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading textures.
     * @param context The context when loading the asset
     * @param texture The glTF texture property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
     */
    _loadTextureAsync?(context: string, texture: ITexture, assign: (babylonTexture: BABYLON.BaseTexture) => void): BABYLON.Nullable<Promise<BABYLON.BaseTexture>>;

    /**
     * Define this method to modify the default behavior when loading animations.
     * @param context The context when loading the asset
     * @param animation The glTF animation property
     * @returns A promise that resolves with the loaded Babylon animation group when the load is complete or null if not handled
     */
    loadAnimationAsync?(context: string, animation: IAnimation): BABYLON.Nullable<Promise<BABYLON.AnimationGroup>>;

    /**
     * @internal
     * Define this method to modify the default behvaior when loading animation channels.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete or null if not handled
     */
    _loadAnimationChannelAsync?(
        context: string,
        animationContext: string,
        animation: IAnimation,
        channel: IAnimationChannel,
        onLoad: (babylonAnimatable: BABYLON.IAnimatable, babylonAnimation: BABYLON.Animation) => void
    ): BABYLON.Nullable<Promise<void>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading skins.
     * @param context The context when loading the asset
     * @param node The glTF node property
     * @param skin The glTF skin property
     * @returns A promise that resolves when the load is complete or null if not handled
     */
    _loadSkinAsync?(context: string, node: INode, skin: ISkin): BABYLON.Nullable<Promise<void>>;

    /**
     * @internal
     * Define this method to modify the default behavior when loading uris.
     * @param context The context when loading the asset
     * @param property The glTF property associated with the uri
     * @param uri The uri to load
     * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
     */
    _loadUriAsync?(context: string, property: IProperty, uri: string): BABYLON.Nullable<Promise<ArrayBufferView>>;

    /**
     * Define this method to modify the default behavior when loading buffer views.
     * @param context The context when loading the asset
     * @param bufferView The glTF buffer view property
     * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
     */
    loadBufferViewAsync?(context: string, bufferView: IBufferView): BABYLON.Nullable<Promise<ArrayBufferView>>;

    /**
     * Define this method to modify the default behavior when loading buffers.
     * @param context The context when loading the asset
     * @param buffer The glTF buffer property
     * @param byteOffset The byte offset to load
     * @param byteLength The byte length to load
     * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
     */
    loadBufferAsync?(context: string, buffer: IBuffer, byteOffset: number, byteLength: number): BABYLON.Nullable<Promise<ArrayBufferView>>;
}
