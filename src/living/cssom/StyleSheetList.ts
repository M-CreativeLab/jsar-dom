export default class StyleSheetListImpl extends Array<CSSStyleSheet> implements StyleSheetList {
  constructor() {
    super();
  }

  item(index: number): CSSStyleSheet {
    const result = this[index];
    return result !== undefined ? result : null;
  }

  /**
   * @internal
   */
  _add(sheet: CSSStyleSheet) {
    if (!this.includes(sheet)) {
      this.push(sheet);
    }
  }

  /**
   * @internal
   */
  _remove(sheet: CSSStyleSheet) {
    const index = this.indexOf(sheet);
    if (index >= 0) {
      this.splice(index, 1);
    }
  }
}
