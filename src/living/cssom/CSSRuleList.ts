export default class CSSRuleListImpl implements CSSRuleList {
  _rules: CSSRule[] = [];

  [index: number]: CSSRule;
  get length(): number {
    return this._rules.length;
  }

  item(index: number): CSSRule {
    return this._rules[index];
  }

  /**
   * @internal
   */
  _add(rule: CSSRule) {
    this._rules.push(rule);
  }
}
