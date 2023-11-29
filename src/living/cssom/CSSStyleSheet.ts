import StyleSheetImpl from './StyleSheet';

export default class CSSStyleSheetImpl extends StyleSheetImpl implements CSSStyleSheet {
  cssRules: CSSRuleList;
  ownerRule: CSSRule;
  rules: CSSRuleList;

  /**
   * Creates a classic `CSSStyleSheet` from a CSS AST.
   */
  static createClassicStyleSheet(): CSSStyleSheet {
    return null;
  }

  /**
   * Creates a spatial `CSSStyleSheet` from a CSS AST.
   * 
   * A spatial `CSSStyleSheet` has a different set of rules(`CSSSpatialStyleRule`), and is used 
   * for spatial styling.
   */
  static createSpatialStyleSheet(): CSSStyleSheet {
    return null;
  }

  addRule(selector?: string, style?: string, index?: number): number {
    throw new Error('Method not implemented.');
  }
  deleteRule(index: number): void {
    throw new Error('Method not implemented.');
  }
  insertRule(rule: string, index?: number): number {
    throw new Error('Method not implemented.');
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
