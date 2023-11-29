export default class CSSRuleImpl implements CSSRule {
  cssText: string;
  parentRule: CSSRule;
  parentStyleSheet: CSSStyleSheet;
  type: number;
  STYLE_RULE: 1;
  CHARSET_RULE: 2;
  IMPORT_RULE: 3;
  MEDIA_RULE: 4;
  FONT_FACE_RULE: 5;
  PAGE_RULE: 6;
  NAMESPACE_RULE: 10;
  KEYFRAMES_RULE: 7;
  KEYFRAME_RULE: 8;
  SUPPORTS_RULE: 12;
}
