import DOMException from 'domexception';
import NamedNodeMapImpl from './attributes/NamedNodeMap';
import { NodeImpl } from './nodes/Node';
import { NodeListImpl } from './nodes/NodeList';
import { AttrImpl } from './attributes/Attr';
import { ElementImpl } from './nodes/Element';
import DocumentFragmentImpl from './nodes/DocumentFragment';
import { DocumentTypeImpl } from './nodes/DocumentType';
import { SpatialDocumentImpl } from './nodes/SpatialDocument';
import { TextImpl } from './nodes/Text';
import HTMLCollectionImpl from './nodes/HTMLCollection';
import DOMTokenListImpl from './nodes/DOMTokenList';
import StyleSheetListImpl from './cssom/StyleSheetList';

import { HTMLElementImpl } from './nodes/HTMLElement';
import HTMLHeadElementImpl from './nodes/HTMLHeadElement';
import HTMLTitleElementImpl from './nodes/HTMLTitleElement';
import HTMLMetaElementImpl from './nodes/HTMLMetaElement';
import HTMLScriptElementImpl from './nodes/HTMLScriptElement';
import HTMLDivElementImpl from './nodes/HTMLDivElement';
import HTMLSpanElementImpl from './nodes/HTMLSpanElement';

import { CloseEventImpl } from './events/CloseEvent';
import { CustomEventImpl } from './events/CustomEvent';
import ErrorEventImpl from './events/ErrorEvent';
import FocusEventImpl from './events/FocusEvent';
import HashChangeEventImpl from './events/HashChangeEvent';
import KeyboardEventImpl from './events/KeyboardEvent';
import MessageEventImpl from './events/MessageEvent';
import { MouseEventImpl } from './events/MouseEvent';
import PopStateEventImpl from './events/PopStateEvent';
import ProgressEventImpl from './events/ProgressEvent';
import TouchEventImpl from './events/TouchEvent';
import { UIEventImpl } from './events/UIEvent';
import { PerformanceImpl } from './hr-time/Performance';
import { AbstractRangeImpl } from './range/AbstractRange';
import { RangeImpl } from './range/Range';
import { CustomElementRegistryImpl } from './custom-elements/CustomElementRegistry';
import { MutationObserverImpl } from './mutation-observer/MutationObserver';
import { MutationRecordImpl } from './mutation-observer/MutationRecord';
import DOMRectReadOnlyImpl from './geometry/DOMRectReadOnly';
import DOMRectImpl from './geometry/DOMRect';

const implementedInterfaces = {
  DOMException,
  URL,
  URLSearchParams,
  EventTarget,
  NamedNodeMap: NamedNodeMapImpl,
  Node: NodeImpl,
  Attr: AttrImpl,
  Element: ElementImpl,
  DocumentFragment: DocumentFragmentImpl,
  // DOMImplementation: require("./generated/DOMImplementation"),
  Document: SpatialDocumentImpl,
  // XMLDocument: require("./generated/XMLDocument"),
  // CharacterData: require("./generated/CharacterData"),
  Text: TextImpl,
  // CDATASection: require("./generated/CDATASection"),
  // ProcessingInstruction: require("./generated/ProcessingInstruction"),
  // Comment: require("./generated/Comment"),
  DocumentType: DocumentTypeImpl,
  NodeList: NodeListImpl,
  // RadioNodeList: require("./generated/RadioNodeList"),
  HTMLCollection: HTMLCollectionImpl,
  // HTMLOptionsCollection: require("./generated/HTMLOptionsCollection"),
  // DOMStringMap: require("./generated/DOMStringMap"),
  DOMTokenList: DOMTokenListImpl,
  StyleSheetList: StyleSheetListImpl,

  HTMLElement: HTMLElementImpl,
  HTMLHeadElement: HTMLHeadElementImpl,
  HTMLTitleElement: HTMLTitleElementImpl,
  // HTMLBaseElement: require("./generated/HTMLBaseElement.js"),
  // HTMLLinkElement: require("./generated/HTMLLinkElement.js"),
  HTMLMetaElement: HTMLMetaElementImpl,
  // HTMLStyleElement: require("./generated/HTMLStyleElement.js"),
  // HTMLBodyElement: require("./generated/HTMLBodyElement.js"),
  // HTMLHeadingElement: require("./generated/HTMLHeadingElement.js"),
  // HTMLParagraphElement: require("./generated/HTMLParagraphElement.js"),
  // HTMLHRElement: require("./generated/HTMLHRElement.js"),
  // HTMLPreElement: require("./generated/HTMLPreElement.js"),
  // HTMLUListElement: require("./generated/HTMLUListElement.js"),
  // HTMLOListElement: require("./generated/HTMLOListElement.js"),
  // HTMLLIElement: require("./generated/HTMLLIElement.js"),
  // HTMLMenuElement: require("./generated/HTMLMenuElement.js"),
  // HTMLDListElement: require("./generated/HTMLDListElement.js"),
  HTMLDivElement: HTMLDivElementImpl,
  // HTMLAnchorElement: require("./generated/HTMLAnchorElement.js"),
  // HTMLAreaElement: require("./generated/HTMLAreaElement.js"),
  // HTMLBRElement: require("./generated/HTMLBRElement.js"),
  // HTMLButtonElement: require("./generated/HTMLButtonElement.js"),
  // HTMLCanvasElement: require("./generated/HTMLCanvasElement.js"),
  // HTMLDataElement: require("./generated/HTMLDataElement.js"),
  // HTMLDataListElement: require("./generated/HTMLDataListElement.js"),
  // HTMLDetailsElement: require("./generated/HTMLDetailsElement.js"),
  // HTMLDialogElement: require("./generated/HTMLDialogElement.js"),
  // HTMLDirectoryElement: require("./generated/HTMLDirectoryElement.js"),
  // HTMLFieldSetElement: require("./generated/HTMLFieldSetElement.js"),
  // HTMLFontElement: require("./generated/HTMLFontElement.js"),
  // HTMLFormElement: require("./generated/HTMLFormElement.js"),
  // HTMLHtmlElement: require("./generated/HTMLHtmlElement.js"),
  // HTMLImageElement: require("./generated/HTMLImageElement.js"),
  // HTMLInputElement: require("./generated/HTMLInputElement.js"),
  // HTMLLabelElement: require("./generated/HTMLLabelElement.js"),
  // HTMLLegendElement: require("./generated/HTMLLegendElement.js"),
  // HTMLMapElement: require("./generated/HTMLMapElement.js"),
  // HTMLMarqueeElement: require("./generated/HTMLMarqueeElement.js"),
  // HTMLMediaElement: require("./generated/HTMLMediaElement.js"),
  // HTMLMeterElement: require("./generated/HTMLMeterElement.js"),
  // HTMLModElement: require("./generated/HTMLModElement.js"),
  // HTMLOptGroupElement: require("./generated/HTMLOptGroupElement.js"),
  // HTMLOptionElement: require("./generated/HTMLOptionElement.js"),
  // HTMLOutputElement: require("./generated/HTMLOutputElement.js"),
  // HTMLPictureElement: require("./generated/HTMLPictureElement.js"),
  // HTMLProgressElement: require("./generated/HTMLProgressElement.js"),
  // HTMLQuoteElement: require("./generated/HTMLQuoteElement.js"),
  HTMLScriptElement: HTMLScriptElementImpl,
  // HTMLSelectElement: require("./generated/HTMLSelectElement.js"),
  // HTMLSlotElement: require("./generated/HTMLSlotElement.js"),
  // HTMLSourceElement: require("./generated/HTMLSourceElement.js"),
  HTMLSpanElement: HTMLSpanElementImpl,
  // HTMLTableCaptionElement: require("./generated/HTMLTableCaptionElement.js"),
  // HTMLTableCellElement: require("./generated/HTMLTableCellElement.js"),
  // HTMLTableColElement: require("./generated/HTMLTableColElement.js"),
  // HTMLTableElement: require("./generated/HTMLTableElement.js"),
  // HTMLTimeElement: require("./generated/HTMLTimeElement.js"),
  // HTMLTableRowElement: require("./generated/HTMLTableRowElement.js"),
  // HTMLTableSectionElement: require("./generated/HTMLTableSectionElement.js"),
  // HTMLTemplateElement: require("./generated/HTMLTemplateElement.js"),
  // HTMLTextAreaElement: require("./generated/HTMLTextAreaElement.js"),
  // HTMLUnknownElement: require("./generated/HTMLUnknownElement.js"),
  // HTMLFrameElement: require("./generated/HTMLFrameElement.js"),
  // HTMLFrameSetElement: require("./generated/HTMLFrameSetElement.js"),
  // HTMLIFrameElement: require("./generated/HTMLIFrameElement.js"),
  // HTMLEmbedElement: require("./generated/HTMLEmbedElement.js"),
  // HTMLObjectElement: require("./generated/HTMLObjectElement.js"),
  // HTMLParamElement: require("./generated/HTMLParamElement.js"),
  // HTMLVideoElement: require("./generated/HTMLVideoElement.js"),
  // HTMLAudioElement: require("./generated/HTMLAudioElement.js"),
  // HTMLTrackElement: require("./generated/HTMLTrackElement.js"),
  // HTMLFormControlsCollection: require("./generated/HTMLFormControlsCollection.js"),

  // SVGElement: require("./generated/SVGElement.js"),
  // SVGGraphicsElement: require("./generated/SVGGraphicsElement.js"),
  // SVGSVGElement: require("./generated/SVGSVGElement.js"),
  // SVGTitleElement: require("./generated/SVGTitleElement.js"),
  // SVGAnimatedString: require("./generated/SVGAnimatedString"),
  // SVGNumber: require("./generated/SVGNumber"),
  // SVGStringList: require("./generated/SVGStringList"),

  Event,
  CloseEvent: CloseEventImpl,
  CustomEvent: CustomEventImpl,
  MessageEvent: MessageEventImpl,
  ErrorEvent: ErrorEventImpl,
  HashChangeEvent: HashChangeEventImpl,
  PopStateEvent: PopStateEventImpl,
  // StorageEvent: require("./generated/StorageEvent"),
  ProgressEvent: ProgressEventImpl,
  // PageTransitionEvent: require("./generated/PageTransitionEvent"),
  // SubmitEvent: require("./generated/SubmitEvent"),

  UIEvent: UIEventImpl,
  FocusEvent: FocusEventImpl,
  // InputEvent: require("./generated/InputEvent"),
  MouseEvent: MouseEventImpl,
  KeyboardEvent: KeyboardEventImpl,
  TouchEvent: TouchEventImpl,
  // CompositionEvent: require("./generated/CompositionEvent"),
  // WheelEvent: require("./generated/WheelEvent"),

  // BarProp: require("./generated/BarProp"),
  // External: require("./generated/External"),
  // Location: require("./generated/Location"),
  // History: require("./generated/History"),
  // Screen: require("./generated/Screen"),
  Performance: PerformanceImpl,
  // Navigator: require("./generated/Navigator"),
  // Crypto: require("./generated/Crypto"),

  // PluginArray: require("./generated/PluginArray"),
  // MimeTypeArray: require("./generated/MimeTypeArray"),
  // Plugin: require("./generated/Plugin"),
  // MimeType: require("./generated/MimeType"),

  // FileReader: require("./generated/FileReader"),
  Blob,
  // File: require("./generated/File"),
  // FileList: require("./generated/FileList"),
  // ValidityState: require("./generated/ValidityState"),

  // DOMParser: require("./generated/DOMParser"),
  // XMLSerializer: require("./generated/XMLSerializer"),

  // FormData: require("./generated/FormData"),
  // XMLHttpRequestEventTarget: require("./generated/XMLHttpRequestEventTarget"),
  // XMLHttpRequestUpload: require("./generated/XMLHttpRequestUpload"),
  // XMLHttpRequest: require("./generated/XMLHttpRequest"),
  // WebSocket: require("./generated/WebSocket"),

  // NodeFilter: require("./generated/NodeFilter"),
  // NodeIterator: require("./generated/NodeIterator"),
  // TreeWalker: require("./generated/TreeWalker"),

  AbstractRange: AbstractRangeImpl,
  Range: RangeImpl,
  // StaticRange: require("./generated/StaticRange"),
  // Selection: require("./generated/Selection"),
  // Storage: require("./generated/Storage"),
  CustomElementRegistry: CustomElementRegistryImpl,
  // ShadowRoot: require("./generated/ShadowRoot"),
  MutationObserver: MutationObserverImpl,
  MutationRecord: MutationRecordImpl,
  // Headers: require("./generated/Headers"),
  // AbortController: require("./generated/AbortController"),
  // AbortSignal: require("./generated/AbortSignal"),
  DOMRectReadOnly: DOMRectReadOnlyImpl,
  DOMRect: DOMRectImpl,
};

export function getInterfaceWrapper(name: string) {
  return implementedInterfaces[name];
}
