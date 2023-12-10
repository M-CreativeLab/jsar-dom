export type HandtrackingInputDetail = {
  joints: XRHand;
};

export type RaycastInputDetail = {
  sourceId: string;
  sourceType?: 'hand' | 'head' | 'gamepad' | 'mouse' | 'custom';
  targetSpatialElementInternalGuid: string;
  uvCoord: BABYLON.Nullable<BABYLON.Vector2>;
};

export type RaycastActionInputDetail = {
  type: 'up' | 'down' | 'click';
  sourceId: RaycastInputDetail['sourceId'];
};

export type JSARInputDetail = HandtrackingInputDetail | RaycastInputDetail | RaycastActionInputDetail;

export class JSARInputEvent extends Event {
  constructor(subType: 'handtracking', detail: HandtrackingInputDetail);
  constructor(subType: 'raycast', detail: RaycastInputDetail);
  constructor(subType: 'raycast_action', detail: RaycastActionInputDetail);
  constructor(public subType: 'handtracking' | 'raycast' | 'raycast_action', public detail: JSARInputDetail) {
    super('input');
  }
}
