import cssstyle from 'cssstyle';
import { NativeDocument } from '../../impl-interfaces';
import { css, isComment } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';

export default class CSSStyleRuleImpl extends CSSRuleImpl implements CSSStyleRule {
  cssRules: CSSRuleList;
  selectorText: string;
  readonly style: CSSStyleDeclaration = new cssstyle.CSSStyleDeclaration() as unknown as CSSStyleDeclaration;
  readonly styleMap: StylePropertyMap;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: css.Rule & ConstructorParameters<typeof CSSRuleImpl>[2]
  ) {
    super(hostObject, args, privateData);

    if (privateData) {
      this.selectorText = privateData.selectors.join(',');
      this._initiateStyle(privateData.declarations);
    }
  }

  _initiateStyle(decls: Array<css.Comment | css.Declaration>) {
    for (const decl of decls) {
      if (!isComment(decl)) {
        let priority = null;
        let value = decl.value;
        if (decl.value.endsWith(' !important')) {
          priority = 'important';
          value = decl.value.slice(0, -' !important'.length);
        }
        this.style.setProperty(decl.property, value, priority);
      }
    }
  }

  deleteRule(index: number): void {
    throw new Error('Method not implemented.');
  }
  insertRule(rule: string, index?: number): number {
    throw new Error('Method not implemented.');
  }
}
