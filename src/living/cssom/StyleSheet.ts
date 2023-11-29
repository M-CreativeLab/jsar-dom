export default class StyleSheetImpl implements StyleSheet {
  disabled: boolean;
  href: string;
  media: MediaList;
  ownerNode: Element | ProcessingInstruction;
  parentStyleSheet: CSSStyleSheet;
  title: string;
  type: string;
}
