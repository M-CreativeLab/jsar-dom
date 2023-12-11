import CSSSpatialKeyframesRule from '../cssom/CSSSpatialKeyframesRule';
import type { PropertyValue } from '../cssom/parsers';
import { SpatialElement } from '../nodes/SpatialElement';

const defaultFps = 60;
const defaultDuration = 1000;

export type SpatialAnimationKeyframe = {
  offset?: number;
  values: {
    [property: string]: PropertyValue;
  };
};

export type SpatialAnimationKeyframesData = {
  propertyNames: string[];
  keyframes: SpatialAnimationKeyframe[];
};

export function createKeyframesData(keyframesRule: CSSSpatialKeyframesRule): SpatialAnimationKeyframesData {
  const keyframesData: SpatialAnimationKeyframesData = {
    propertyNames: [],
    keyframes: [],
  };
  for (let i = 0; i < keyframesRule.length; i++) {
    const keyframeRule = keyframesRule[i];
    const { keyText, style } = keyframeRule;
    let keyframe: (typeof keyframesData)['keyframes']['0'] = {
      values: {},
    };
    if (keyText === 'from') {
      keyframe.offset = 0;
    } else if (keyText === 'to') {
      keyframe.offset = 100;
    } else {
      keyframe.offset = parseInt(keyText, 10);
    }
    Array.prototype.forEach.call(style, (property: string) => {
      if (!keyframesData.propertyNames.includes(property)) {
        keyframesData.propertyNames.push(property);
      }
      keyframe.values[property] = style._getPropertyValue(property);
    });
    keyframesData.keyframes.push(keyframe);
  }
  return keyframesData;
}

type AnimationInit = {
  fps: number;
  duration: number;
  iterationCount: number | 'infinite';
};

function toAnimationNumberOrAngle(propertyValue: PropertyValue<any>): number {
  if (propertyValue.isAngleValue()) {
    return propertyValue.toAngle('rad');
  } else {
    return propertyValue.toNumber();
  }
}

function toAnimationDataWithType(propertyValue: PropertyValue<any>): [any, number] {
  let type: number;
  let data: any;
  if (propertyValue.isColorValue()) {
    const { value } = propertyValue;
    type = BABYLON.Animation.ANIMATIONTYPE_COLOR4;
    data = new BABYLON.Color4(value.r, value.g, value.b, value.a);
  } else if (propertyValue.isAngleValue()) {
    const { value } = propertyValue;
    type = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
    data = value;
  } else if (propertyValue.isLengthValue()) {
    const { value } = propertyValue;
    type = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
    data = value;
  } else if (propertyValue.isSetValue()) {
    const value = propertyValue.value;
    if (value.length === 2) {
      type = BABYLON.Animation.ANIMATIONTYPE_VECTOR2;
      data = new BABYLON.Vector2(
        toAnimationNumberOrAngle(value[0]),
        toAnimationNumberOrAngle(value[1])
      );
    } else if (value.length === 3) {
      type = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
      data = new BABYLON.Vector3(
        toAnimationNumberOrAngle(value[0]),
        toAnimationNumberOrAngle(value[1]),
        toAnimationNumberOrAngle(value[2])
      );
    } else if (value.length === 4) {
      type = BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
      data = new BABYLON.Quaternion(
        value[0].toNumber(),
        value[1].toNumber(),
        value[2].toNumber(),
        value[3].toNumber()
      );
    }
  } else {
    type = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
    data = propertyValue.toNumber();
  }
  return [data, type];
}

function playAnimationGroup(animationGroup: BABYLON.AnimationGroup, iterationCount: number | 'infinite') {
  if (iterationCount === 'infinite') {
    animationGroup.play(true);
  } else if (iterationCount === 1) {
    animationGroup.play(false);
  } else if (iterationCount > 1) {
    animationGroup.play(false);
    animationGroup.onAnimationGroupEndObservable.addOnce(() => {
      playAnimationGroup(animationGroup, iterationCount - 1);
    });
  }
}

export function createSpatialAnimation(
  name: string,
  sourceStyleRule: CSSSpatialKeyframesRule,
  element: SpatialElement,
  init: Partial<AnimationInit> = {
    fps: defaultFps,
    duration: defaultDuration,
    iterationCount: 1,
  }
) {
  const scene = element._ownerDocument._hostObject.getNativeScene();
  const fps = init.fps || defaultFps;
  const duration = init.duration || defaultDuration;
  const iterationCount = init.iterationCount || 1;

  const animationGroup = new BABYLON.AnimationGroup(`${name}#AnimationGroup`, scene);
  const keyframesData = createKeyframesData(sourceStyleRule);

  for (const property of keyframesData.propertyNames) {
    let animationDataType: number;
    const animationKeys: BABYLON.IAnimationKey[] = [];

    keyframesData.keyframes.forEach(keyframe => {
      const propertyValue = keyframe.values[property];
      const [animationValue, type] = toAnimationDataWithType(propertyValue);
      if (!animationDataType) {
        animationDataType = type;
      }
      animationKeys.push({
        frame: fps * (duration / 1000) * (keyframe.offset / 100),
        value: animationValue,
      });
    });

    const animation = new BABYLON.Animation(
      `${name}.${property}#Animation`,
      property,
      fps,
      animationDataType,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    animation.setKeys(animationKeys);
    animationGroup.addTargetedAnimation(animation, element.asNativeType());
  }

  /**
   * Play the animation group after the next render.
   */
  scene.onBeforeRenderObservable.addOnce(() => {
    playAnimationGroup(animationGroup, iterationCount);
  });
}
