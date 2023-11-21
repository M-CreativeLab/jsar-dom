import type BABYLON from 'babylonjs';
import { SpatialDocumentImpl } from './living/nodes/SpatialDocument';

export interface Runtime {
  
}

export interface NativeEngine extends EventTarget {
  addEventListener(type: 'DOMContentLoaded', listener: (event: Event) => void): void;
}

export interface NativeLogger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export interface NativeDocument {
  engine: NativeEngine;
  baseURI: string;
  logger: NativeLogger;
  attachedDocument: SpatialDocumentImpl;

  getNativeScene(): BABYLON.Scene;
  getContainerPose(): XRPose;

  getPreloadedMeshes(): Map<string, BABYLON.AbstractMesh[]>;
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]>;

  observeInputEvent(name?: string): void;
  createBoundTransformNode(nameOrId: string): BABYLON.TransformNode;
}
