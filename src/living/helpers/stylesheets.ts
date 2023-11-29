import { parse as parseCss, type StyleRules } from 'css';
import DOMException from '../domexception';
import StyleSheetListImpl from '../cssom/StyleSheetList';
import { ElementImpl } from '../nodes/Element';
import CSSStyleSheetImpl from '../cssom/CSSStyleSheet';
import { invalidateStyleCache } from './style-rules';

export function removeStylesheet(sheet: CSSStyleSheet, elementImpl: ElementImpl) {
  const { styleSheets } = elementImpl._ownerDocument;
  (styleSheets as StyleSheetListImpl)._remove(sheet);

  // Remove the association explicitly; in the spec it's implicit so this step doesn't exist.
  (elementImpl as any).sheet = null;

  invalidateStyleCache(elementImpl);
  // TODO: "Set the CSS style sheet’s parent CSS style sheet, owner node and owner CSS rule to null."
  // Probably when we have a real CSSOM implementation.
}

// https://drafts.csswg.org/cssom/#add-a-css-style-sheet
function addStylesheet(sheet: CSSStyleSheet, elementImpl: ElementImpl) {
  (elementImpl._ownerDocument.styleSheets as StyleSheetListImpl)._add(sheet);

  // Set the association explicitly; in the spec it's implicit.
  (elementImpl as any).sheet = sheet;

  invalidateStyleCache(elementImpl);
  // TODO: title and disabled stuff
}

// https://drafts.csswg.org/cssom/#create-a-css-style-sheet kinda:
// - Parsing failures are not handled gracefully like they should be
// - The import rules stuff seems out of place, and probably should affect the load event...
export function createStylesheet(sheetText: string, elementImpl: ElementImpl, baseURL: URL) {
  let sheet: StyleRules;
  try {
    sheet = parseCss(sheetText).stylesheet;
  } catch (e) {
    throw new DOMException('Failed to parse CSS stylesheet', 'SYNTAX_ERR');
  }

  const stylesheet = CSSStyleSheetImpl.createSpatialStyleSheet();
  // scanForImportRules(elementImpl, sheet.rules, baseURL);
  addStylesheet(stylesheet, elementImpl);
}

function scanForImportRules(elementImpl: ElementImpl, cssRules: StyleRules['rules'], baseURL: URL) {
  if (!cssRules) {
    return;
  }

  // for (let i = 0; i < cssRules.length; ++i) {
  //   if (cssRules[i]) {
  //     // @media rule: keep searching inside it.
  //     scanForImportRules(elementImpl, cssRules[i], baseURL);
  //   } else if (cssRules[i].href) {
  //     // @import rule: fetch the resource and evaluate it.
  //     // See http://dev.w3.org/csswg/cssom/#css-import-rule
  //     //     If loading of the style sheet fails its cssRules list is simply
  //     //     empty. I.e. an @import rule always has an associated style sheet.
  //     const parsed = whatwgURL.parseURL(cssRules[i].href, { baseURL });
  //     if (parsed === null) {
  //       const window = elementImpl._ownerDocument._defaultView;
  //       if (window) {
  //         const error = new Error(`Could not parse CSS @import URL ${cssRules[i].href} relative to base URL ` +
  //           `"${whatwgURL.serializeURL(baseURL)}"`);
  //         error.type = "css @import URL parsing";
  //         window._virtualConsole.emit("jsdomError", error);
  //       }
  //     } else {
  //       fetchStylesheetInternal(elementImpl, whatwgURL.serializeURL(parsed), parsed);
  //     }
  //   }
  // }
}
