import { HandGesture, HandOrientation, HandtrackingInputDetail } from '../../input-event';

enum HandType {
  Left = 0,
  Right,
}

type InputData = {
  'Type': HandType;
  'Joints': Array<{
    position: DOMPointInit;
    rotation: DOMPointInit;
  }>;
  'ThisPose': any;
  'Gesture': HandGesture;
  'Orientation': HandOrientation;
};

export default class HandTrackingEvent extends Event {
  inputData: InputData;

  constructor(inputDetail: HandtrackingInputDetail) {
    super('handtracking');
    this.inputData = {
      'Type': inputDetail.handId,
      'Joints': inputDetail.joints,
      'ThisPose': inputDetail.pose,
      'Gesture': inputDetail.gesture,
      'Orientation': inputDetail.orientation,
    };
  }
}
