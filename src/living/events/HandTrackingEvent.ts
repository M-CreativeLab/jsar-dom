import { HandGesture, HandOrientation, HandtrackingInputDetail } from '../../input-event';

type HandPoint = {
  x: number;
  y: number;
  z: number;
};

enum HandType {
  Left = 0,
  Right,
}

type InputData = {
  'Type': HandType;
  'Joints': HandPoint[];
  'ThisPose': any;
  'Gesture': HandGesture;
  'Orientation': HandOrientation;
};

export default class HandTrackingEvent extends Event {
  inputData: InputData;

  constructor(inputDetail: HandtrackingInputDetail) {
    super('handtracking');
    this.inputData = {
      'Type': inputDetail.id,
      'Joints': [],
      'ThisPose': inputDetail.pose,
      'Gesture': inputDetail.gesture,
      'Orientation': inputDetail.orientation,
    };
  }
}
