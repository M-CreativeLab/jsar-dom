import type { NativeDocument } from '../../impl-interfaces';
import { parseCss, css, isComment } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';
import CSSSpatialKeyframeRule from './CSSSpatialKeyframeRule';

export default class CSSSpatialKeyframesRule extends CSSRuleImpl {
  private _name: string;
  private _keyframeRules: CSSSpatialKeyframeRule[] = [];

  [index: number]: CSSSpatialKeyframeRule;
  cssRules: CSSRuleList;
  get length(): number {
    return this._keyframeRules.length;
  }
  get name(): string {
    return this._name;
  }

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: {
      node: css.KeyFrames;
      ast: ReturnType<typeof parseCss>;
    }
  ) {
    super(hostObject, args, {
      ...privateData.node,
      ast: privateData.ast,
    });

    if (privateData.node) {
      this._name = privateData.node.name;
      for (let i = 0; i < privateData.node.keyframes.length; i++) {
        const sharedKeyframe = privateData.node.keyframes[i];
        if (isComment(sharedKeyframe)) {
          continue;
        }
        for (const keyText of sharedKeyframe.values) {
          this._appendRule(keyText, sharedKeyframe);
        }
      }
    }
  }

  private _appendRule(keyText: string, keyframeData: css.KeyFrame) {
    const rule = new CSSSpatialKeyframeRule(this._hostObject, [], {
      keyText,
      node: keyframeData,
      ast: this._ast,
    });
    const index = this._keyframeRules.length;
    this._keyframeRules.push(rule);
    this[index] = rule;
  }

  appendRule(rule: string): void {
    throw new Error('The method "CSSSpatialKeyframesRule.prototype.appendRule()" not implemented.');
  }

  deleteRule(select: string): void {
    throw new Error('The method "CSSSpatialKeyframesRule.prototype.deleteRule()" not implemented.');
  }

  findRule(select: string): CSSSpatialKeyframeRule {
    return this._keyframeRules.find(rule => rule.keyText === select);
  }
}
