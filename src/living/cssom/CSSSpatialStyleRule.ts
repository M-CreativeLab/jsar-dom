import CSSRuleImpl from './CSSRule';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

export default class CSSSpatialStyleRule extends CSSRuleImpl {
  selectorText: string;
  readonly cssRules: CSSRuleList;
  readonly style: CSSSpatialStyleDeclaration;
  readonly styleMap: StylePropertyMap;
  deleteRule(index: number): void {
    // TODO
  }
  insertRule(rule: string, index?: number): number {
    // TODO
    return 0;
  }
}
