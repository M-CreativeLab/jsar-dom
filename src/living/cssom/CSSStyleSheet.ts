import { AtMaterial, css, isAtMaterial, isRule, noParsingErrors, parseCss } from '../helpers/spatial-css-parser';
import { NativeDocument } from '../../impl-interfaces';
import DOMExceptionImpl from '../domexception';
import CSSRuleListImpl from './CSSRuleList';
import StyleSheetImpl from './StyleSheet';
import CSSStyleRuleImpl from './CSSStyleRule';
import CSSSpatialStyleRule from './CSSSpatialStyleRule';
import CSSSpatialMaterialRule from './CSSSpatialMaterialRule';

export default class CSSStyleSheetImpl extends StyleSheetImpl implements CSSStyleSheet {
  cssRules: CSSRuleList;
  ownerRule: CSSRule;

  /**
   * @deprecated
   */
  rules: CSSRuleList;

  protected _hostObject: NativeDocument;
  protected _isSpatial: boolean;

  static createForImpl(
    hostObject: NativeDocument,
    args: [CSSStyleSheetInit?],
    privateData: {
      isSpatial: boolean;
      cssText?: string;
    }
  ) {
    const sheet = new CSSStyleSheetImpl(...args);
    sheet._hostObject = hostObject;
    sheet._isSpatial = privateData.isSpatial;

    if (privateData.cssText) {
      sheet._initWithCssText(privateData.cssText);
    }
    return sheet;
  }

  constructor(init?: CSSStyleSheetInit) {
    super();

    this.cssRules = new CSSRuleListImpl();
    if (init) {
      // this.media = init.media;
      this.disabled = init.disabled;
    }
  }

  protected _initWithCssText(cssText: string) {
    const astResult = parseCss(cssText || '', {}, this._isSpatial ? 'spatial' : 'classic');
    if (astResult.type === 'stylesheet') {
      if (!noParsingErrors(astResult.stylesheet)) {
        let errorMessage = 'Failed to parse css:\n';
        for (const error of astResult.stylesheet.parsingErrors) {
          errorMessage += error.toString() + '\n';
        }
        throw new DOMException(errorMessage, 'SYNTAX_ERR');
      }
      for (let astRule of astResult.stylesheet.rules) {
        if (isRule(astRule)) {
          this._addStyleRule(astRule, astResult);
        } else if (isAtMaterial(astRule)) {
          this._addMaterialRule(astRule, astResult);
        } else {
          // TODO: other rules?
        }
      }
    }
  }

  private _addStyleRule(src: css.Rule, ast: ReturnType<typeof parseCss>) {
    const rulesImpl = this.cssRules as CSSRuleListImpl;
    const ruleImpl = this._isSpatial ?
      new CSSSpatialStyleRule(this._hostObject, [], { ...src, ast }) :
      new CSSStyleRuleImpl(this._hostObject, [], { ...src, ast });
    rulesImpl._add(ruleImpl);
  }

  private _addMaterialRule(src: AtMaterial, ast: ReturnType<typeof parseCss>) {
    const rulesImpl = this.cssRules as CSSRuleListImpl;
    const ruleImpl = new CSSSpatialMaterialRule(this._hostObject, [], { node: src, ast });
    rulesImpl._add(ruleImpl);
  }

  addRule(selector?: string, style?: string, index?: number): number {
    throw new Error('Method not implemented.');
  }

  deleteRule(index: number): void {
    throw new Error('Method not implemented.');
  }

  insertRule(rule: string, index?: number): number {
    if (index < 0 || index > this.cssRules.length) {
      throw new DOMExceptionImpl('index is out of range', 'INDEX_SIZE_ERR');
    }
    return index;
  }

  removeRule(index?: number): void {
    throw new Error('Method not implemented.');
  }

  replace(text: string): Promise<CSSStyleSheet> {
    throw new Error('Method not implemented.');
  }

  replaceSync(text: string): void {
    throw new Error('Method not implemented.');
  }
}
