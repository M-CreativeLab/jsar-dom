export type HandtrackingInputDetail = {
  joints: XRHand;
};

export type RaycastInputDetail = {
  targetSpatialElementInternalGuid: string;
  uvCoord: BABYLON.Vector2;
};

export type RaycastActionInputDetail = {
  type: 'up' | 'down' | 'click';
};

export type JSARInputDetail = HandtrackingInputDetail | RaycastInputDetail | RaycastActionInputDetail;

export class JSARInputEvent extends Event {
  constructor(name: 'handtracking', detail: HandtrackingInputDetail);
  constructor(public name: 'handtracking' | 'raycast' | 'raycast_action', public detail: JSARInputDetail) {
    super(name);
  }
}
