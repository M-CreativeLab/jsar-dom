import type { NativeDocument } from '../../impl-interfaces';
import { parseCss, css, isComment } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

export default class CSSSpatialKeyframeRule extends CSSRuleImpl {
  private _keyText: string;
  private _style: CSSSpatialStyleDeclaration = new CSSSpatialStyleDeclaration();

  /**
   * @readonly
   */
  get keyText(): string {
    return this._keyText;
  }
  /**
   * @readonly
   */
  get style(): CSSSpatialStyleDeclaration {
    return this._style;
  }

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: {
      keyText: string;
      node: css.KeyFrame;
      ast: ReturnType<typeof parseCss>;
    }
  ) {
    super(hostObject, args, {
      ...privateData.node,
      ast: privateData.ast,
    });

    if (privateData.node) {
      this._keyText = privateData.keyText;
      this._initiateStyle(privateData.node.declarations);
    }
  }

  private _initiateStyle(decls: Array<css.Comment | css.Declaration>) {
    for (const decl of decls) {
      if (!isComment(decl)) {
        let priority = null;
        let value = decl.value;
        if (decl.value.endsWith(' !important')) {
          priority = 'important';
          value = decl.value.slice(0, -' !important'.length);
        }
        this._style.setProperty(decl.property, value, priority);
      }
    }
  }
}
