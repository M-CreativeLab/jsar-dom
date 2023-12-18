import { NativeDocument } from '../../impl-interfaces';
import DOMExceptionImpl from '../domexception';
import { SpatialElement } from './SpatialElement';

export function cloneWithOriginalRefs(
  source: BABYLON.Node,
  name: string,
  newParent: BABYLON.Node,
  onClonedObversaval?: (origin: BABYLON.Node, cloned: BABYLON.Node) => void
) {
  const result = source.clone(name, newParent, true);
  result.setEnabled(true);

  if (typeof onClonedObversaval === 'function') {
    onClonedObversaval(source, result);
  }
  const directDescendantsOfSource = source.getDescendants(true);
  for (let child of directDescendantsOfSource) {
    cloneWithOriginalRefs(child, child.name, result, onClonedObversaval);
  }
  return result;
}

export default class SpatialMeshElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'mesh',
    });
  }

  get ref(): string {
    return this.getAttribute('ref');
  }
  set ref(value: string) {
    this.setAttribute('ref', value);
  }

  get selector(): string {
    return this.getAttribute('selector') || '__root__';
  }
  set selector(value: string) {
    this.setAttribute('selector', value);
  }

  async _attach() {
    const { ref } = this;
    if (!ref) {
      throw new DOMExceptionImpl('ref is required in <mesh>', 'INVALID_STATE_ERR');
    }

    // Wait for the mesh to be preloaded if it is in the preloading queue.
    const queue = this._ownerDocument._preloadingSpatialModelObservers;
    if (queue.has(ref)) {
      if (!await queue.get(ref)) {
        throw new DOMExceptionImpl(`Failed to preload the mesh with ref(${ref})`, 'INVALID_STATE_ERR');
      }
    }
    super._attach(this._instantiate());
  }

  _instantiate(): BABYLON.Node {
    const { ref, selector } = this;
    if (!this._hostObject.getPreloadedMeshes().has(ref)) {
      throw new DOMExceptionImpl(`No mesh with ref(${ref}) is preloaded`, 'INVALID_STATE_ERR');
    }

    const transformNodesAndMeshes = this._hostObject.getPreloadedMeshes().get(ref);
    if (!transformNodesAndMeshes || !transformNodesAndMeshes.length) {
      throw new DOMExceptionImpl(`No mesh or transforms with ref(${ref}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }

    const targetMesh = transformNodesAndMeshes.find((node) => node.name === selector);
    if (!targetMesh) {
      throw new DOMExceptionImpl(`No mesh or transform with selector(${selector}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }

    const rootName = this.id || this.getAttribute('name') || this.localName;
    const originUidToClonedMap: { [key: number]: BABYLON.Node } = {};
    const clonedMesh = cloneWithOriginalRefs(targetMesh, rootName, null, (origin, cloned) => {
      originUidToClonedMap[origin.uniqueId] = cloned;
    });

    if (this.id) {
      clonedMesh.id = this.id;
      clonedMesh.name = this.id;
    }

    /** Set the cloned skeleton, it set the new bone's linking transforms to new. */
    clonedMesh.getChildMeshes().forEach((childMesh) => {
      if (childMesh.skeleton) {
        const clonedSkeleton = childMesh.skeleton.clone(`${childMesh.skeleton.name}-cloned`);
        clonedSkeleton.bones.forEach(bone => {
          const linkedTransformNode = bone.getTransformNode();
          if (!originUidToClonedMap[linkedTransformNode.uniqueId]) {
            throw new TypeError(`Could not find the linked transform node(${linkedTransformNode.name}) for bone(${bone.name})`);
          } else {
            const newTransform = originUidToClonedMap[linkedTransformNode.uniqueId];
            if (newTransform.getClassName() === 'TransformNode') {
              bone.linkTransformNode(newTransform as BABYLON.TransformNode);
            } else {
              throw new TypeError(`The linked transform node(${linkedTransformNode.name}) for bone(${bone.name}) is not a transform node, actual type is "${newTransform.getClassName()}".`);
            }
          }
        });
        childMesh.skeleton = clonedSkeleton;
      }
    });

    /**
     * The Babylonjs won't clone the animation group when the related meshes are cloned.
     * 
     * In this case, we need to clone the animation groups manually, and set the new targets
     * to the cloned meshes and its related animation groups.
     */
    const animationGroups = this._hostObject.getPreloadedAnimationGroups().get(ref);
    if (animationGroups) {
      for (let i = 0; i < animationGroups.length; i++) {
        const animationGroup = animationGroups[i];
        if (animationGroup.targetedAnimations.length <= 0) {
          continue;
        }
        let id = `${i}`;
        if (this.id) {
          id = `#${this.id}`;
        }
        const newAnimationGroup = animationGroup.clone(
          `${animationGroup.name}/${id}`,
          (oldTarget: BABYLON.Node) => {
            if (originUidToClonedMap[oldTarget.uniqueId]) {
              return originUidToClonedMap[oldTarget.uniqueId];
            } else {
              this._hostObject.console.warn(
                `Could not find the target(${oldTarget.name}) for animation group(${animationGroup.name})`, oldTarget);
              return null;
            }
          },
          false
        );

        /**
         * Remove the targeted animations if the target is null or undefined.
         */
        (newAnimationGroup as any)._targetedAnimations = newAnimationGroup.targetedAnimations
          .filter((anim) => {
            return anim.target != null && anim.target !== undefined;
          });

        /**
         * When an animation group is cloned into space, we added the following listeners to mark
         * the animation group as dirty.
         */
        function markDirty(animationGroup: BABYLON.AnimationGroup) {
          /** FIXME(Yorkie): we use the metadata._isDirty as the dirty-update flag for animation group */
          if (!animationGroup.metadata) {
            animationGroup.metadata = {};
          }
          animationGroup.metadata._isDirty = true;
        }
        newAnimationGroup.onAnimationGroupPlayObservable.add(markDirty);
        newAnimationGroup.onAnimationGroupEndObservable.add(markDirty);
        newAnimationGroup.onAnimationGroupPauseObservable.add(markDirty);

        // If the animation group is playing, stop it and start the new one.
        if (animationGroup.isPlaying === true) {
          try {
            newAnimationGroup.start(animationGroup.loopAnimation);
          } catch (err) {
            console.warn(`Failed to start the animation group(${newAnimationGroup.name}): ${err.message}`);
          }
          animationGroup.stop();
        }
      }
    }
    return clonedMesh;
  }
}
