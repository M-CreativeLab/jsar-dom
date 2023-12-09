import cssstyle from 'cssstyle';
import type { NodeImpl } from '../nodes/Node';
import type { ElementImpl } from '../nodes/Element';
import type { SpatialElement } from '../nodes/SpatialElement';
import type { HTMLElementImpl } from '../nodes/HTMLElement';
import { isDocumentNode, isHTMLElement, isSpatialElement } from '../node-type';

import CSSRuleListImpl from '../cssom/CSSRuleList';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import CSSSpatialStyleRule from '../cssom/CSSSpatialStyleRule';
import CSSStyleRuleImpl from '../cssom/CSSStyleRule';
import { matchesDontThrow } from './selectors';
import { isShadowRoot } from './shadow-dom';

type CSSAndSpatialStyleRule = CSSStyleRule | CSSSpatialStyleRule;
type StyleRuleHander = (rule: CSSAndSpatialStyleRule) => void;
const { forEach } = Array.prototype;

export const propertiesWithResolvedValueImplemented = {
  '__proto__': null,
  'visibility': {
    inherited: true,
    initial: 'visible',
    computedValue: 'as-specified',
  },
  'pointer-events': {
    inherited: true,
    initial: 'auto',
    computedValue: 'as-specified',
  },
  'background-color': {
    inherited: false,
    initial: 'transparent',
    computedValue: 'computed-color',
  },
  'border-block-start-color': {
    inherited: false,
    initial: 'currentcolor',
    computedValue: 'computed-color',
  },
  'border-block-end-color': {
    inherited: false,
    initial: 'currentcolor',
    computedValue: 'computed-color',
  },
  'outline-color': {
    inherited: false,
    initial: 'invert',
    computedValue: 'computed-color',
  },
};

export const invalidateStyleCache = (elementImpl: NodeImpl) => {
  if (elementImpl._attached) {
    elementImpl._ownerDocument._styleCache = null;
  }
};


/**
 * Iterates over the CSS rules of the style sheets associated with the given element,
 * and invokes the provided callback function for each matching style rule.
 *
 * @param elementImpl - The element for which to find matching style rules.
 * @param handleStyleRule - The callback function to handle each matching style rule.
 */
function forEachMatchingSheetRuleOfElement(elementImpl: ElementImpl, handleStyleRule: StyleRuleHander) {
  const handleSheet = (sheet: CSSStyleSheet) => {
    const cssRulesImpl = sheet.cssRules as CSSRuleListImpl;
    forEach.call(cssRulesImpl._rules, (rule: CSSRule) => {
      if (rule instanceof CSSSpatialStyleRule || rule instanceof CSSStyleRuleImpl) {
        if (matchesDontThrow(elementImpl, rule.selectorText)) {
          handleStyleRule(rule);
        }
      }
    });
  };

  const rootOfElement = elementImpl.getRootNode() as NodeImpl;
  if (isShadowRoot(rootOfElement) || isDocumentNode(rootOfElement)) {
    forEach.call(rootOfElement.styleSheets, handleSheet);
  } else {
    // FIXME: do we need throw an error for this case? This might be unreachable.
  }
}

export function getDeclarationForElement(elementImpl: SpatialElement): CSSSpatialStyleDeclaration;
export function getDeclarationForElement(elementImpl: HTMLElementImpl): CSSStyleDeclaration;
export function getDeclarationForElement(elementImpl: ElementImpl): CSSStyleDeclaration;
export function getDeclarationForElement(elementImpl: ElementImpl) {
  /**
   * FIXME: should we move the style cache to DocumentOrShadowRoot even though the _ownerDocument works?
   */
  let styleCache = elementImpl._ownerDocument._styleCache;
  if (!styleCache) {
    styleCache = elementImpl._ownerDocument._styleCache = new WeakMap();
  }

  const cachedDeclaration = styleCache.get(elementImpl);
  if (cachedDeclaration) {
    return cachedDeclaration;
  }

  // TODO: support classic style declaration
  let declaration: CSSSpatialStyleDeclaration | CSSStyleDeclaration;
  if (isSpatialElement(elementImpl)) {
    declaration = new CSSSpatialStyleDeclaration();
  } else {
    declaration = new cssstyle.CSSStyleDeclaration() as unknown as CSSStyleDeclaration;
  }

  function handleProperty(style: CSSAndSpatialStyleRule['style'], property: string) {
    const value = style.getPropertyValue(property);
    if (value === 'unset') {
      declaration.removeProperty(property);
    } else {
      declaration.setProperty(
        property,
        value,
        style.getPropertyPriority(property),
      );
    }
  }

  forEachMatchingSheetRuleOfElement(elementImpl, (rule) => {
    forEach.call(rule.style, (property: string) => {
      handleProperty(rule.style, property);
    });
  });

  if (isSpatialElement(elementImpl) || isHTMLElement(elementImpl)) {
    forEach.call(elementImpl.style, (property: string) => {
      handleProperty(elementImpl.style, property);
    });
  }

  styleCache.set(elementImpl, declaration);
  return declaration;
};
