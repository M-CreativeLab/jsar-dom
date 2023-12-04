/**
 * This file is an extension to the `css` parser with supporting for Spatial CSS, for example
 * 
 * - add supports for these at-rules: @material @texture
 */

import css, {
  parse,
  type Node as CSSNode,
  type AtRule as CSSAtRule,
  type Declaration as CSSDeclaration,
  type Comment as CSSComment,
  type StyleRules,
} from 'css';
import DOMException from '../domexception';

export {
  css,
}

export function isRule(node: CSSNode): node is css.Rule {
  return node.type === 'rule';
}

export function isAtKeyframes(node: CSSNode): node is css.KeyFrames {
  return node.type === 'keyframes';
}

export function isAtImport(node: CSSNode): node is css.Import {
  return node.type === 'import';
}

export function isAtMaterial(node: CSSNode): node is AtMaterial {
  return node.type === 'material';
}

export function isAtTexture(node: CSSNode): node is AtTexture {
  return node.type === 'texture';
}

export function isComment(node: CSSNode): node is css.Comment {
  return node.type === 'comment';
}

export function noParsingErrors(stylesheet: StyleRules): boolean {
  return !stylesheet.parsingErrors || stylesheet.parsingErrors.length === 0;
}

interface NamedAtRule<T> extends CSSNode { }
class NamedAtRule<T extends NamedAtRule<T>> implements NamedAtRule<T> {
  protected _name: string;
  protected _nameRe: RegExp;
  protected _declarations: Array<CSSDeclaration | CSSComment> | undefined;

  protected static _canParse(node: css.Rule, type: string) {
    return node.selectors?.length === 1 && node.selectors[0].startsWith(`@${type}`);
  }
  protected static _createFromRule<U extends NamedAtRule<U>>(ctor: new () => U, rule: css.Rule): U {
    const atRule = new ctor();
    if (!atRule.type) {
      throw new DOMException('type must be set', 'SYNTAX_ERR');
    }
    const r = atRule._parse(rule);
    if (r?.name) {
      atRule._name = r.name;
      atRule._declarations = rule.declarations;
      atRule.position = rule.position;
      atRule.parent = rule.parent;
    }
    return atRule;
  }
  constructor(type: string) {
    this.type = type;
    this._nameRe = new RegExp(`^@${type} (?<name>[a-zA-Z0-9_-]+)`);
  }
  get name(): string {
    return this._name;
  }
  get declarations(): Array<CSSDeclaration | CSSComment> | undefined {
    return this._declarations;
  }
  protected _parse(rule: css.Rule): { name?: string } {
    const m = rule.selectors[0].match(this._nameRe);
    return m?.groups;
  }
}

class AtTexture extends NamedAtRule<AtTexture> {
  private static _type = 'material';
  static canParse(node: css.Rule) {
    return NamedAtRule._canParse(node, AtTexture._type);
  }
  static createFromRule(rule: css.Rule) {
    return NamedAtRule._createFromRule(this, rule);
  }
  constructor() {
    super(AtTexture._type);
  }
}

class AtMaterial extends NamedAtRule<AtMaterial> {
  private static _type = 'material';
  static canParse(node: css.Rule) {
    return NamedAtRule._canParse(node, AtMaterial._type);
  }
  static createFromRule(rule: css.Rule) {
    return NamedAtRule._createFromRule(this, rule);
  }
  constructor() {
    super(AtMaterial._type);
  }
}

type SpatialCSSAtRule = AtTexture | AtMaterial;

export const parseClassicCss = parse;
export function parseSpatialCss(...args: Parameters<typeof parse>) {
  const ast = parse(...args);
  const spatialRules: Array<css.Rule | CSSComment | CSSAtRule | SpatialCSSAtRule> = [];

  if (ast.type === 'stylesheet' && ast.stylesheet && noParsingErrors(ast.stylesheet)) {
    for (let node of ast.stylesheet.rules) {
      if (isRule(node)) {
        // handle @material and @texture
        if (AtMaterial.canParse(node)) {
          const atMaterial = AtMaterial.createFromRule(node);
          spatialRules.push(atMaterial);
          continue;
        } else if (AtTexture.canParse(node)) {
          const atTexture = AtTexture.createFromRule(node);
          spatialRules.push(atTexture);
          continue;
        }
      }
      spatialRules.push(node);
    }
  }

  return {
    type: ast.type,
    position: ast.position,
    parent: ast.parent,
    stylesheet: {
      parsingErrors: ast.stylesheet?.parsingErrors,
      rules: spatialRules.length > 0 ? spatialRules : ast.stylesheet?.rules,
    },
  };
}

type ReturnTypeOfParser<T extends (cssText: string, options: Parameters<typeof parse>[1]) => any> = ReturnType<T> & {
  cssText: string;
  getCssText(node: css.Node): string;
};

function calcOffset(text: string, line: number, column: number): number {
  let offset = 0;
  const lines = text.split('\n');

  for (let i = 0; i < line - 1; i++) {
    offset += lines[i].length + 1; // +1 to account for the newline character
  }
  offset += column - 1; // Adjust for 0-based indexing
  return offset;
}

export function parseCss(cssText: string, options: Parameters<typeof parse>[1], type: 'spatial'): ReturnTypeOfParser<typeof parseSpatialCss>;
export function parseCss(cssText: string, options: Parameters<typeof parse>[1], type: 'classic'): ReturnTypeOfParser<typeof parse>;
export function parseCss(cssText: string, options: Parameters<typeof parse>[1], type: unknown): ReturnTypeOfParser<typeof parseSpatialCss> | ReturnTypeOfParser<typeof parse>;
export function parseCss(cssText: string, options: Parameters<typeof parse>[1], type: unknown): ReturnTypeOfParser<typeof parseSpatialCss> | ReturnTypeOfParser<typeof parse> {
  let result = type === 'spatial' ? parseSpatialCss(cssText, options) : parse(cssText, options);
  return {
    ...result,
    cssText,
    getCssText(node: css.Node) {
      const start = calcOffset(cssText, node.position.start.line, node.position.start.column);
      const end = calcOffset(cssText, node.position.end.line, node.position.end.column);
      return cssText.substring(start, end);
    }
  };
}
