import { NativeDocument } from '../../impl-interfaces';
import { css } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';

export default class CSSStyleRuleImpl extends CSSRuleImpl implements CSSStyleRule {
  cssRules: CSSRuleList;
  selectorText: string;
  style: CSSStyleDeclaration;
  styleMap: StylePropertyMap;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: css.Rule & ConstructorParameters<typeof CSSRuleImpl>[2]
  ) {
    super(hostObject, args, privateData);

    if (privateData) {
      this.selectorText = privateData.selectors.join(',');
    }
  }

  deleteRule(index: number): void {
    throw new Error('Method not implemented.');
  }
  insertRule(rule: string, index?: number): number {
    throw new Error('Method not implemented.');
  }
}
