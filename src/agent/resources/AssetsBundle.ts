export class AssetsBundle {
  meshes: BABYLON.AbstractMesh[] = [];
  particleSystems: BABYLON.IParticleSystem[] = [];
  skeletons: BABYLON.Skeleton[] = [];
  animationGroups: BABYLON.AnimationGroup[] = [];
  transformNodes: BABYLON.TransformNode[] = [];
  geometries: BABYLON.Geometry[] = [];
  lights: BABYLON.Light[] = [];

  get meshesOrTransformNodes(): (BABYLON.AbstractMesh | BABYLON.TransformNode)[] {
    return [...this.meshes, ...this.transformNodes];
  }

  constructor(assets: BABYLON.ISceneLoaderAsyncResult, isGltf: boolean) {
    this.meshes = assets?.meshes || [];
    this.particleSystems = assets?.particleSystems || [];
    this.skeletons = assets?.skeletons || [];
    this.animationGroups = assets?.animationGroups || [];
    this.transformNodes = assets?.transformNodes || [];
    this.geometries = assets?.geometries || [];
    this.lights = assets?.lights || [];

    // Set the assets to disabled by default.
    this._invalidate();

    /**
     * If the extension is .glb or .gltf, we assume the nodes are in right-handed system.
     * 
     * Babylon.js doesn't convert the mesh to left-handed system even though the loader and scene are in left-handed system, it
     * works with root node's rotation and scaling correction and the renderer, thus it doesn't work for our case, that requires
     * the right data in the left-handed system for mesh itself.
     * 
     * Thus we add a tag to the node to indicate that the mesh is in right-handed system, and we will convert it to left-handed
     * at serializer.
     */
    if (isGltf) {
      this.meshesOrTransformNodes.forEach(node => {
        /**
         * The tag will be copied when this node is cloned, so this is a exact match for our use case and don't need to handle the
         * same tagging on the cloned nodes.
         */
        BABYLON.Tags.AddTagsTo(node, 'right-handed-system');
      });
    }
  }

  private _invalidate() {
    for (const mesh of this.meshes) {
      mesh.setEnabled(false);
    }
    for (const transformNode of this.transformNodes) {
      transformNode.setEnabled(false);
    }
    for (const light of this.lights) {
      light.setEnabled(false);
    }
  }

  /**
   * Instantiate a new nodes from the assets bundle, it will create the related meshes, transform nodes, skeletons and animation
   * groups.
   * 
   * @param selector The selector of the root node to be instantiated, currently only support the name of the node.
   * @param name The name of the new node.
   */
  public instantiate(selector: string, name: string): BABYLON.TransformNode {
    const rootSource = this.meshesOrTransformNodes.find(node => node.name === selector);
    if (!rootSource) {
      throw new DOMException(`No mesh or transform with selector(${selector}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }

    const sourceUidToCopied: Map<number, BABYLON.Node | BABYLON.Skeleton | BABYLON.AnimationGroup> = new Map();
    const newMeshes: BABYLON.AbstractMesh[] = [];
    const newTransformNodes: BABYLON.TransformNode[] = [];
    const newSkeletons: BABYLON.Skeleton[] = [];
    const newAnimationGroups: BABYLON.AnimationGroup[] = [];
    let defaultRoot: BABYLON.TransformNode = null;
    let sourceRoot: BABYLON.TransformNode = null;

    for (const mesh of this.meshes) {
      if (mesh.name === selector) {
        sourceRoot = mesh;
      }
      const newMesh = mesh.clone(`${name}.${mesh.name}`, null, true);
      newMeshes.push(newMesh);
      sourceUidToCopied.set(mesh.uniqueId, newMesh);
    }
    for (const transformNode of this.transformNodes) {
      if (transformNode.name === selector) {
        sourceRoot = transformNode;
      }
      if (transformNode.name === '__root__') {
        defaultRoot = transformNode;
      }
      const newTransformNode = transformNode.clone(`${name}.${transformNode.name}`, null, true);
      newTransformNodes.push(newTransformNode);
      sourceUidToCopied.set(transformNode.uniqueId, newTransformNode);
    }
    /**
     * TODO: supports geometry, lights and particle systems?
     */

    /** create a copy of `Skeleton`s */
    for (const skeleton of this.skeletons) {
      const newSkeleton = skeleton.clone(`${name}.${skeleton.name}`);
      if (Array.isArray(newSkeleton.bones)) {
        newSkeleton.bones.forEach(bone => {
          const linked = bone.getTransformNode();
          if (linked && sourceUidToCopied.has(linked.uniqueId)) {
            const copied = sourceUidToCopied.get(linked.uniqueId);
            if (copied instanceof BABYLON.TransformNode) {
              bone.linkTransformNode(copied);
            }
          }
        });
      }
      newSkeletons.push(newSkeleton);
      sourceUidToCopied.set(skeleton.uniqueId, newSkeleton);
    }

    /** create copies of `AnimationGroup`s */
    for (const animationGroup of this.animationGroups) {
      if (animationGroup.targetedAnimations?.length === 0) {
        continue;
      }
      const newAnimationGroup = animationGroup.clone(
        `${name}.${animationGroup.name}`,
        (oldTarget) => {
          if (oldTarget instanceof BABYLON.TransformNode) {
            if (sourceUidToCopied.has(oldTarget.uniqueId)) {
              return sourceUidToCopied.get(oldTarget.uniqueId);
            } else {
              console.warn(
                `Could not find the target(${oldTarget.name}) for animation group(${animationGroup.name})`, oldTarget);
            }
          } else if (oldTarget instanceof BABYLON.MorphTarget) {
            return oldTarget.clone();
          } else {
            console.warn(
              `The target(${oldTarget.name}) for animation group(${animationGroup.name}) is not a transform node, actual type is "${oldTarget.getClassName()}".`, oldTarget);
          }
          return oldTarget;
        },
        false
      );

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
      }
      newAnimationGroups.push(newAnimationGroup);
    }

    /**
     * Start creating the new root node.
     */
    if (sourceRoot == null) {
      sourceRoot = defaultRoot;
    }
    const rootNew = sourceUidToCopied.has(sourceRoot.uniqueId);
    if (!rootNew) {
      throw new DOMException(
        `No mesh or transform with selector(${selector}) is found from preloaded resource`, 'INVALID_STATE_ERR');
    }

    return this._walkTransformNodesTree(
      sourceRoot,
      (sourceNode) => {
        const { uniqueId } = sourceNode;
        if (!sourceUidToCopied.has(uniqueId)) {
          return null;
        }
        const copied = sourceUidToCopied.get(uniqueId);
        if (copied instanceof BABYLON.Skeleton || copied instanceof BABYLON.AnimationGroup) {
          return null;
        }
        if (sourceNode instanceof BABYLON.AbstractMesh) {
          if (sourceNode.skeleton) {
            const newSkeleton = sourceUidToCopied.get(sourceNode.skeleton.uniqueId);
            if (newSkeleton instanceof BABYLON.Skeleton) {
              (copied as BABYLON.AbstractMesh).skeleton = newSkeleton;
            }
          }
        }
        return copied;
      }
    ) as BABYLON.TransformNode;
  }

  private _walkTransformNodesTree(
    sourceNode: BABYLON.Node,
    getNewNode: (node: BABYLON.Node) => BABYLON.Node | null
  ): BABYLON.Node {
    const newNode = getNewNode(sourceNode);
    if (newNode == null) {
      return null;
    }
    newNode.setEnabled(true);
    // TODO: creates SpatialElement for each node.

    const directDescendantsOfSource = sourceNode.getDescendants(true);
    for (let sourceChild of directDescendantsOfSource) {
      const newChild = this._walkTransformNodesTree(sourceChild, getNewNode);
      if (newChild != null) {
        newChild.parent = newNode;
      }
    }
    return newNode;
  }
}
