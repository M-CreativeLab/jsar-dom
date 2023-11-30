import { NativeDocument } from '../../impl-interfaces';
import { css, parseCss } from '../helpers/spatial-css-parser';

export default class CSSRuleImpl implements CSSRule {
  parentRule: CSSRule = null;
  parentStyleSheet: CSSStyleSheet = null;

  type: number;
  STYLE_RULE: 1;
  CHARSET_RULE: 2;
  IMPORT_RULE: 3;
  MEDIA_RULE: 4;
  FONT_FACE_RULE: 5;
  PAGE_RULE: 6;
  NAMESPACE_RULE: 10;
  KEYFRAMES_RULE: 7;
  KEYFRAME_RULE: 8;
  SUPPORTS_RULE: 12;

  protected _hostObject: NativeDocument;
  protected _cssText: string;
  private _ast: ReturnType<typeof parseCss>;
  private _node: css.Node;

  constructor(
    hostObject: NativeDocument,
    _args: any[],
    privateData: css.Node & {
      ast: ReturnType<typeof parseCss>;
    }
  ) {
    this._hostObject = hostObject;
    this._ast = privateData.ast;
    this._node = privateData;

    switch (privateData.type) {
      case 'rule':
        this.type = this.STYLE_RULE;
        break;
      case 'keyframes':
        this.type = this.KEYFRAMES_RULE;
        break;
      case 'keyframe':
        this.type = this.KEYFRAME_RULE;
        break;
      case 'media':
        this.type = this.MEDIA_RULE;
        break;
      case 'supports':
        this.type = this.SUPPORTS_RULE;
        break;
      default:
        throw new Error(`Unexpected type ${privateData.type}`);
    }
  }

  get cssText(): string {
    if (this._cssText === undefined) {
      this._cssText = this._ast.getCssText(this._node);
    }
    return this._cssText;
  }
}
