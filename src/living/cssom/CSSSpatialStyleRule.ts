import { NativeDocument } from '../../impl-interfaces';
import { css, isComment } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

export default class CSSSpatialStyleRule extends CSSRuleImpl {
  selectorText: string;
  readonly style: CSSSpatialStyleDeclaration = new CSSSpatialStyleDeclaration();
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
}
