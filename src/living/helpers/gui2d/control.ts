import * as taffy from '@bindings/taffy';
import { CSSStyleDeclaration } from 'cssstyle';
import { CanvasTextConfig, drawText, splitText } from 'canvas-txt';

import DOMExceptionImpl from '../../domexception';
import NodeTypes, { isHTMLContentElement, isTextNode } from '../../node-type';
import DOMRectReadOnlyImpl from '../../geometry/DOMRectReadOnly';
import { HTMLContentElement } from '../../nodes/HTMLContentElement';
import { TextImpl } from '../../nodes/Text';
import DOMRectImpl from '../../geometry/DOMRect';
import { MouseEventImpl } from '../../events/MouseEvent';
import { ShadowRootImpl } from '../../nodes/ShadowRoot';
import { getInterfaceWrapper } from '../../../living/interfaces';
import DOMMatrixImpl from '../../geometry/DOMMatrix';
import { postMultiply } from '../matrix-functions';
import { parserTransform } from '../../cssom/parsers';

type LengthPercentageDimension = string | number;
type LayoutStyle = Partial<{
  // Base
  display: taffy.Display;
  position: taffy.Position;
  aspectRatio: number;

  // Rectangle
  width: LengthPercentageDimension | 'auto';
  height: LengthPercentageDimension | 'auto';
  minWidth: LengthPercentageDimension | 'auto';
  maxWidth: LengthPercentageDimension | 'auto';
  minHeight: LengthPercentageDimension | 'auto';
  maxHeight: LengthPercentageDimension | 'auto';

  // inset
  insetLeft: LengthPercentageDimension | 'auto';
  insetRight: LengthPercentageDimension | 'auto';
  insetTop: LengthPercentageDimension | 'auto';
  insetBottom: LengthPercentageDimension | 'auto';

  // margin
  marginLeft: LengthPercentageDimension | 'auto';
  marginRight: LengthPercentageDimension | 'auto';
  marginTop: LengthPercentageDimension | 'auto';
  marginBottom: LengthPercentageDimension | 'auto';

  // padding
  paddingLeft: LengthPercentageDimension;
  paddingRight: LengthPercentageDimension;
  paddingTop: LengthPercentageDimension;
  paddingBottom: LengthPercentageDimension;

  // border
  borderLeft: LengthPercentageDimension;
  borderRight: LengthPercentageDimension;
  borderTop: LengthPercentageDimension;
  borderBottom: LengthPercentageDimension;

  // Flexbox layout
  flexDirection: taffy.FlexDirection;
  flexWrap: taffy.FlexWrap;
  flexGrow: number;
  flexShrink: number;
  flexBasis: LengthPercentageDimension | 'auto';
  alignItems: taffy.AlignItems;
  alignSelf: taffy.AlignSelf;
  alignContent: taffy.AlignContent;
  justifyItems: taffy.JustifyItems;
  justifySelf: taffy.JustifySelf;
  justifyContent: taffy.JustifyContent;
  gapWidth: LengthPercentageDimension;
  gapHeight: LengthPercentageDimension;

  // Grid layout
  gridAutoFlow: taffy.GridAutoFlow;
}>;

type BorderRenderingContext = {
  width: number;
  color: string;
  style?: string;
};

/**
 * Define the mapping from css property value to Taffy's enum.
 */
const CSSValueToLayoutStyleMappings = {
  display: {
    'none': taffy.Display.None,
    'flex': taffy.Display.Flex,
    'grid': taffy.Display.Grid,
  },
  position: {
    'absolute': taffy.Position.Absolute,
    'relative': taffy.Position.Relative,
  },
  flexDirection: {
    'row': taffy.FlexDirection.Row,
    'row-reverse': taffy.FlexDirection.RowReverse,
    'column': taffy.FlexDirection.Column,
    'column-reverse': taffy.FlexDirection.ColumnReverse,
  },
  alignItems: {
    'flex-start': taffy.AlignItems.FlexStart,
    'flex-end': taffy.AlignItems.FlexEnd,
    'start': taffy.AlignItems.Start,
    'end': taffy.AlignItems.End,
    'center': taffy.AlignItems.Center,
    'stretch': taffy.AlignItems.Stretch,
    'baseline': taffy.AlignItems.Baseline,
  },
  alignContent: {
    'flex-start': taffy.AlignContent.FlexStart,
    'flex-end': taffy.AlignContent.FlexEnd,
    'start': taffy.AlignContent.Start,
    'end': taffy.AlignContent.End,
    'center': taffy.AlignContent.Center,
    'space-between': taffy.AlignContent.SpaceBetween,
    'space-around': taffy.AlignContent.SpaceAround,
    'stretch': taffy.AlignContent.Stretch,
  },
  justifyContent: {
    'flex-start': taffy.JustifyContent.FlexStart,
    'flex-end': taffy.JustifyContent.FlexEnd,
    'start': taffy.JustifyContent.Start,
    'end': taffy.JustifyContent.End,
    'center': taffy.JustifyContent.Center,
    'space-between': taffy.JustifyContent.SpaceBetween,
    'space-around': taffy.JustifyContent.SpaceAround,
    'space-evenly': taffy.JustifyContent.SpaceEvenly,
  },
};
const CSSValueToLayoutStyleProperties = Object.keys(CSSValueToLayoutStyleMappings);

function getLineHeightValue(baseHeight: number, lineHeightStr: string): number {
  if (!lineHeightStr || lineHeightStr === 'normal') {
    return baseHeight;
  }

  if (lineHeightStr.endsWith('px')) {
    // 32px
    return parseFloat(lineHeightStr);
  } else if (lineHeightStr.endsWith('%')) {
    // 150%
    const ratio = parseFloat(lineHeightStr) / 100;
    return baseHeight * ratio;
  } else {
    // 2.5 or 2.5em
    const ratio = parseFloat(lineHeightStr);
    return baseHeight * ratio;
  }
}

export class Control2D {
  /**
   * The layout node to be used for the HTML layout.
   */
  layoutNode: taffy.Node;

  /**
   * The layout style will be passed to layout node.
   */
  layoutStyle: LayoutStyle;

  /**
   * The rectangle descriptor of the last rendering.
   */
  private _lastRect: DOMRectReadOnlyImpl;
  private _lastCursor: BABYLON.Vector2;
  private _isCursorInside = false;
  protected _renderingContext: CanvasRenderingContext2D;
  private _overwriteHeight: number;
  private _overwriteWidth: number;
  private _imageBitmap: ImageBitmap;
  private _isDirty = true;
  private _transformMatrix: DOMMatrixImpl;
  private _currentTransformMatrix: DOMMatrixImpl;
  constructor(
    private _allocator: taffy.Allocator,
    private _element: HTMLContentElement | ShadowRootImpl
  ) {
    if (this._element == null || !this._element) {
      throw new DOMExceptionImpl('element must not be null', 'INVALID_STATE_ERR');
    }
  }

  init(defaultStyle?: LayoutStyle) {
    if (defaultStyle) {
      this.layoutStyle = defaultStyle;
    } else {
      this.layoutStyle = this._initializeLayoutStyle();
    }
    this.layoutNode = new taffy.Node(this._allocator, this, this.layoutStyle);
  }

  setRenderingContext(renderingContext: CanvasRenderingContext2D) {
    this._renderingContext = renderingContext;
    if (this._ownInnerText()) {
      const textNode = this._element.firstChild as Text;
      const { width, height } = this._fixSizeByText(textNode.data);
      this._updateRectSize(width, height);
    }
  }

  setImageData(bitmap: ImageBitmap) {
    this._imageBitmap = bitmap;
  }

  addChild(child: Control2D) {
    this.layoutNode.addChild(child.layoutNode);
  }

  removeChild(child: Control2D) {
    this.layoutNode.removeChild(child.layoutNode);
  }

  isDirty() {
    return this._isDirty;
  }

  dispose() {
    if (this.layoutNode) {
      this.layoutNode.free();
      this.layoutNode = null;
    }
  }

  get _style(): CSSStyleDeclaration | null {
    if (isHTMLContentElement(this._element)) {
      return this._element?._adoptedStyle;
    } else {
      return null;
    }
  }

  get currentTransformMatrix(): DOMMatrixImpl {
    return this._currentTransformMatrix;
  }
  
  set currentTransformMatrix(value: DOMMatrixImpl) {
    this._currentTransformMatrix = value;
  }
  
  private _ownInnerText(): boolean {
    const element = this._element;
    return element.childNodes.length === 1 && isTextNode(element);
  }

  private _parseLengthStr(input: string): LengthPercentageDimension | 'auto' {
    if (input.endsWith('px')) {
      return parseFloat(input);
    }
    return input;
  }

  private _initializeLayoutStyle() {
    const layoutStyle: LayoutStyle = {
      display: taffy.Display.Flex,
      flexDirection: taffy.FlexDirection.Column,
      height: this._overwriteHeight || 'auto',
      width: this._overwriteWidth || 'auto',
    };
    if (this._style) {
      const inputStyle = this._style;
      if (inputStyle.height) {
        layoutStyle.height = this._parseLengthStr(inputStyle.height);
      }
      if (inputStyle.width) {
        layoutStyle.width = this._parseLengthStr(inputStyle.width);
      }
      if (inputStyle.minHeight) {
        layoutStyle.minHeight = this._parseLengthStr(inputStyle.minHeight);
      }
      if (inputStyle.minWidth) {
        layoutStyle.minWidth = this._parseLengthStr(inputStyle.minWidth);
      }
      if (inputStyle.maxHeight) {
        layoutStyle.maxHeight = this._parseLengthStr(inputStyle.maxHeight);
      }
      if (inputStyle.maxWidth) {
        layoutStyle.maxWidth = this._parseLengthStr(inputStyle.maxWidth);
      }
      if (inputStyle.flexWrap) {
        layoutStyle.flexWrap = inputStyle.flexWrap === 'wrap' ? taffy.FlexWrap.Wrap : taffy.FlexWrap.NoWrap;
      }
      if (inputStyle.flexGrow) {
        layoutStyle.flexGrow = parseFloat(inputStyle.flexGrow);
      }
      if (inputStyle.flexShrink) {
        layoutStyle.flexShrink = parseFloat(inputStyle.flexShrink);
      }
      if (inputStyle.flexBasis) {
        layoutStyle.flexBasis = this._parseLengthStr(inputStyle.flexBasis);
      }
      if (inputStyle.rowGap) {
        layoutStyle.gapWidth = this._parseLengthStr(inputStyle.rowGap);
      }
      if (inputStyle.columnGap) {
        layoutStyle.gapHeight = this._parseLengthStr(inputStyle.columnGap);
      }
      if (inputStyle.marginLeft) {
        layoutStyle.marginLeft = this._parseLengthStr(inputStyle.marginLeft);
      }
      if (inputStyle.marginTop) {
        layoutStyle.marginTop = this._parseLengthStr(inputStyle.marginTop);
      }
      if (inputStyle.marginRight) {
        layoutStyle.marginRight = this._parseLengthStr(inputStyle.marginRight);
      }
      if (inputStyle.marginBottom) {
        layoutStyle.marginBottom = this._parseLengthStr(inputStyle.marginBottom);
      }
      if (inputStyle.paddingLeft) {
        layoutStyle.paddingLeft = this._parseLengthStr(inputStyle.paddingLeft);
      }
      if (inputStyle.paddingTop) {
        layoutStyle.paddingTop = this._parseLengthStr(inputStyle.paddingTop);
      }
      if (inputStyle.paddingRight) {
        layoutStyle.paddingRight = this._parseLengthStr(inputStyle.paddingRight);
      }
      if (inputStyle.paddingBottom) {
        layoutStyle.paddingBottom = this._parseLengthStr(inputStyle.paddingBottom);
      }

      for (const property of CSSValueToLayoutStyleProperties) {
        const value = inputStyle[property];
        if (value) {
          layoutStyle[property] = CSSValueToLayoutStyleMappings[property][value];
        }
      }
    }
    return layoutStyle;
  }

  private _updateRectSize(width: number, height: number) {
    let needUpdateLayout = false;
    if (typeof width === 'number' && this._overwriteWidth !== width) {
      this._overwriteWidth = width;
      needUpdateLayout = true;
    }
    if (typeof height === 'number' && this._overwriteHeight !== height) {
      this._overwriteHeight = height;
      needUpdateLayout = true;
    }
    if (needUpdateLayout) {
      this.updateLayoutStyle();
    }
  }

  updateLayoutStyle(): boolean {
    this.layoutStyle = this._initializeLayoutStyle();
    if (this.layoutNode) {
      this.layoutNode.setStyle(this.layoutStyle);
      this.layoutNode.markDirty();
    }
    this._isDirty = true;
    return true;
  }

  /**
   * Render the controller itself.
   * 
   * @internal
   * @param rect 
   * @param base 
   * @returns if the rendering is successful.
   */
  render(rect: DOMRect, base: DOMRectReadOnly) {
    /**
     * Mark the dirty flag to be false at the beginning of the rendering.
     * 
     * This flag might be set to true when the layout style is updated, it indicates that we need to re-render the control
     * in the next frame.
     */
    this._isDirty = false;

    const x = rect.x + base.x;
    const y = rect.y + base.y;
    const width = rect.width;
    const height = rect.height;

    const canvasContext = this._renderingContext;
    const boxRect = new DOMRectImpl(x, y, width, height);
    const hasTextChildren = this._isElementOwnsInnerText();
    /**
     * Check if this node is an image or has text children, if yes, we need to fix the size by the image or text.
     */
    if (this._imageBitmap && this._element instanceof getInterfaceWrapper('HTMLImageElement')) {
      // Fix the size by the image.
      this._element._fixSizeByImage(boxRect);
      this._updateRectSize(boxRect.width, boxRect.height);
    } else if (hasTextChildren) {
      // Fix the size by the text.
      const textNode = this._element.firstChild as unknown as TextImpl;
      const fixedRect = this._fixSizeByText(textNode.data, boxRect);
      if (fixedRect != null) {
        boxRect.width = fixedRect.width;
        boxRect.height = fixedRect.height;
        this._updateRectSize(boxRect.width, boxRect.height);
      }
    }

    this._updateCurrentTransformMatrix();

    /**
     * Adopt the transformMatrix on canvas.
     */
    this._updateTransform();

    /**
     * Check if we need to render the borders, if yes, render the borders and fill the background, otherwise use `_renderRect` to fill a rect with background.
     */
    if (!this._renderBorders(canvasContext, boxRect)) {
      this._renderRect(canvasContext, boxRect);
    }

    this._renderImageIfExists(canvasContext, boxRect);

    /**
     * Render the inner text.
     */
    if (hasTextChildren) {
      this._renderInnerText(canvasContext, boxRect);
    }
    this._lastRect = boxRect;
  }

  /**
   * Fix the rect size by text.
   */
  private _fixSizeByText(value: string, rect?: DOMRectReadOnly) {
    /**
     * There are the following 3 cases that we don't need to fix size by text:
     * 1. The target texture is not ready.
     * 2. The text is empty.
     * 3. The width is already set.
     */
    if (!value) {
      return null;
    }

    /**
     * If the width and height has been set, we don't need to fix the size by text.
     */
    if (this._style.height && this._style.width) {
      return null;
    }

    const metrics = this._measureText(this._renderingContext, value);

    /**
     * If the height is not set, we need to set it by the text height.
     */
    if (!this._style.height) {
      const charHeight = metrics.height;
      let height = charHeight;
      let width: number;

      /**
       * If the width is not 0px and ends with px, such as 100px, 200px, we are able to split the text by this width value.
       */
      if (this._style.width.endsWith('px') && this._style.width !== '0px') {
        width = parseFloat(this._style.width);
      } else if (rect) {
        width = rect.width;
      } else {
        width = metrics.width;
      }

      /**
       * Calculate the total height by `splitText()` if the width is set.
       */
      if (width) {
        const textArray = splitText({
          ctx: this._renderingContext,
          text: value,
          justify: false,
          width,
        });
        height = getLineHeightValue(charHeight, this._style.lineHeight) * textArray.length;
      }
      return { width, height };
    } else {
      let width: number;
      const height = parseFloat(this._style.height);
      if (!this._style.width) {
        width = metrics.width;
      } else {
        width = parseFloat(this._style.width);
      }
      return { width, height };
    }
  }

  private _getBorderRenderingContext(name?: 'top' | 'right' | 'bottom' | 'left'): BorderRenderingContext {
    if (!isHTMLContentElement(this._element)) {
      return;
    }
    let prefix = 'border';
    if (name) {
      prefix = `border-${name}`;
    }
    const style = this._style;
    return {
      width: parseFloat(style[`${prefix}-width`]),
      color: style[`${prefix}-color`],
      style: style[`${prefix}-style`],
    }
  }

  private get _fontSize() {
    let value = 16;
    if (this._style.fontSize) {
      value = parseInt(this._style.fontSize);
    }
    return value;
  }


  private _getTextConfig(rect: DOMRectReadOnlyImpl): CanvasTextConfig {
    let isTextJustify: boolean;
    switch (this._style.textJustify) {
      case 'inter-word':
      case 'inter-character':
        isTextJustify = true;
        break;
      case 'auto':
      default:
        isTextJustify = false;
        break;
    }

    return {
      debug: false,
      x: rect.x,
      y: rect.y,
      height: rect.height,
      width: rect.width,
      font: this._style.fontFamily || 'sans-serif',
      fontSize: this._fontSize,
      fontWeight: this._style.fontWeight as any,
      fontStyle: this._style.fontStyle as any,
      align: this._style.textAlign as any,
      vAlign: this._style.verticalAlign as any,
      justify: isTextJustify,
    };
  }

  /**
   * This measures a given text in single-line mode and returns the width and height of the text block.
   */
  private _measureText(context: CanvasRenderingContext2D, text: string) {
    const style = `${this._fontSize}px ${this._style.fontFamily || 'sans-serif'}`;
    const previousTextBaseline = context.textBaseline;
    const previousFont = context.font;

    context.textBaseline = 'bottom';
    context.font = style;
    const { actualBoundingBoxAscent, width } = context.measureText(text);

    // Reset baseline
    context.textBaseline = previousTextBaseline;
    context.font = previousFont;

    return {
      height: Math.abs(actualBoundingBoxAscent),
      width,
    };
  }

  /**
   * If this node owns an inner text.
   */
  private _isElementOwnsInnerText() {
    const element = this._element;
    if (!element) {
      return false;
    }
    return element.childNodes.length === 1 && element.firstChild.nodeType === NodeTypes.TEXT_NODE;
  }

  /**
   * Render the inner text in this control.
   */
  _renderInnerText(context: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl) {
    const textNode = this._element.firstChild as TextImpl;
    const text = `${textNode.data}`;

    /**
     * When the control's style height or width to be set to zero, we just skip render the text.
     */
    if (parseFloat(this._style.width) === 0 || parseFloat(this._style.height) === 0) {
      return;
    }

    const textConfig = this._getTextConfig(rect);
    const { height: textHeight } = this._measureText(context, text);

    context.fillStyle = this._style.color || 'black';
    const lineHeight = getLineHeightValue(textHeight, this._style.lineHeight);
    drawText(context, text, {
      lineHeight,
      height: rect.height,
      ...textConfig,
    });
  }

  /**
   * Render the rectangle with background color in this control.
   */
  private _renderRect(renderingContext: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl) {
    renderingContext.fillStyle = this._style?.backgroundColor || 'transparent';
    renderingContext.lineJoin = 'round';
    renderingContext.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  private _renderBorders(renderingContext: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl): boolean {
    if (!isHTMLContentElement(this._element)) {
      return false;
    }
    const { x, y, width, height } = rect;

    // Get border radius
    let borderRadius: number = 0;
    if (this._style.borderRadius) {
      if (this._style.borderRadius.endsWith('px')) {
        borderRadius = parseFloat(this._style.borderRadius);
        if (isNaN(borderRadius)) {
          borderRadius = 0;
        }
      } else if (this._style.borderRadius.endsWith('%')) {
        borderRadius = parseFloat(this._style.borderRadius) / 100 * width;
        if (isNaN(borderRadius)) {
          borderRadius = 0;
        }
      }
    }

    let borderBoth: BorderRenderingContext;
    let borderTop: BorderRenderingContext;
    let borderRight: BorderRenderingContext;
    let borderBottom: BorderRenderingContext;
    let borderLeft: BorderRenderingContext;

    if (this._style.border) {
      borderBoth = this._getBorderRenderingContext();
    }
    if (this._style.borderTop) {
      borderTop = this._getBorderRenderingContext('top')
    }
    if (this._style.borderRight) {
      borderRight = this._getBorderRenderingContext('right');
    }
    if (this._style.borderBottom) {
      borderBottom = this._getBorderRenderingContext('bottom');
    }
    if (this._style.borderLeft) {
      borderLeft = this._getBorderRenderingContext('left');
    }
    if (!borderBoth && !borderTop && !borderRight && !borderBottom && !borderLeft) {
      return false;
    }

    if (borderBoth) {
      if (!borderTop) {
        borderTop = borderBoth;
      }
      if (!borderRight) {
        borderRight = borderBoth;
      }
      if (!borderBottom) {
        borderBottom = borderBoth;
      }
      if (!borderLeft) {
        borderLeft = borderBoth;
      }
    }

    // Start to draw
    renderingContext.beginPath();

    // Draw top
    {
      renderingContext.moveTo(x + borderRadius, y);
      renderingContext.lineTo(x + width - borderRadius, y);
      renderingContext.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      renderingContext.lineWidth = 0;
      if (borderTop) {
        this._updateBorderStyle(renderingContext, borderTop);
      }
      renderingContext.stroke();
    }

    // Draw right
    {
      // renderingContext.moveTo(x + width, y + borderRadius);
      renderingContext.lineTo(x + width, y + height - borderRadius);
      renderingContext.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
      renderingContext.lineWidth = 0;
      if (borderRight) {
        this._updateBorderStyle(renderingContext, borderRight);
      }
      renderingContext.stroke();
    }

    // Draw bottom
    {
      // context.moveTo(x + width - borderRadius, y + height);
      renderingContext.lineTo(x + borderRadius, y + height);
      renderingContext.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      renderingContext.lineWidth = 0;
      if (borderBottom) {
        this._updateBorderStyle(renderingContext, borderBottom);
      }
      renderingContext.stroke();
    }

    // Draw left
    {
      // context.moveTo(x, y + height - borderRadius);
      renderingContext.lineTo(x, y + borderRadius);
      renderingContext.quadraticCurveTo(x, y, x + borderRadius, y);
      renderingContext.lineWidth = 0;
      if (borderLeft) {
        this._updateBorderStyle(renderingContext, borderLeft);
      }
      renderingContext.stroke();
    }

    renderingContext.closePath();
    renderingContext.fillStyle = this._style.backgroundColor || 'transparent';
    renderingContext.fill();
    return true;
  }

  private _updateBorderStyle(renderingContext: CanvasRenderingContext2D, border: BorderRenderingContext) {
    if (border.style === 'dashed') {
      renderingContext.setLineDash([10, 5]);
    } else if (border.style === 'dotted') {
      renderingContext.setLineDash([5, 5]);
    } else {
      renderingContext.setLineDash([]);
    }
    renderingContext.lineWidth = border.width || 0;
    renderingContext.strokeStyle = border.color || '#000000';
  }

  private _renderImageIfExists(renderingContext: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl) {
    if (!this._imageBitmap) {
      return;
    }
    if (!(this._element instanceof getInterfaceWrapper('HTMLImageElement'))) {
      return;
    }
    const element = this._element;
    element._dispatchResizeTask(() => {
      element.width = rect.width;
      element.height = rect.height;
    });
    renderingContext.drawImage(this._imageBitmap, rect.x, rect.y, rect.width, rect.height);
  }
  
  private _updateCurrentTransformMatrix() {
    const element = this._element;
    const style = this._style;
    if (element instanceof ShadowRootImpl) {
      return;
    } 
    const transformStr = style.transform;
    const parentElement = element.parentElement;
    this.currentTransformMatrix = parserTransform(transformStr);
    if (parentElement === null) {
      return;
    } else {
      // If the parent element isn't a HTMLContentElement, return.
      if (!isHTMLContentElement(parentElement)) {
        return;
      } 
      const parentControl = parentElement._control;
      const parentCTM = parentControl.currentTransformMatrix;
      this.currentTransformMatrix = postMultiply(parentCTM, this.currentTransformMatrix);
    }
  }
  
  _updateTransform() {
    const renderingContext = this._renderingContext;
    const currentTransformMatrix = this.currentTransformMatrix;
    renderingContext.setTransform(currentTransformMatrix);
  }
  
  containsPoint(x: number, y: number): boolean {
    const rect = this._lastRect;
    if (!rect) {
      return false;
    }
    if (
      x < rect.x ||
      x > rect.x + rect.width ||
      y < rect.y ||
      y > rect.y + rect.height
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Process the element picking.
   * 
   * @internal
   * @param x 
   * @param y 
   * @param _type 
   */
  processPicking(x: number, y: number, _type?: number) {
    if (this.containsPoint(x, y)) {
      if (!this._isCursorInside) {
        this._isCursorInside = true;
        if (this._element) {
          this._element.dispatchEvent(new MouseEventImpl('mouseenter'));
        }
      }
      if (!this._lastCursor || this._lastCursor.x !== x || this._lastCursor.y !== y) {
        // trigger move event if the cursor is changed.
        const moveEvent = new MouseEventImpl('mousemove', {
          clientX: x,
          clientY: y,
        });
        if (this._element) {
          this._element.dispatchEvent(moveEvent);
        }
      }
    } else {
      if (this._isCursorInside) {
        this._isCursorInside = false;
        if (this._element) {
          this._element.dispatchEvent(new MouseEventImpl('mouseleave'));
        }
      }
    }
    this._lastCursor = new BABYLON.Vector2(x, y);
  }

  /**
   * Process the pointer events.
   * 
   * @internal
   * @param x 
   * @param y 
   * @param type 
   * @returns 
   */
  processPointerEvent(x: number, y: number, type: number): boolean {
    if (this.containsPoint(x, y)) {
      let eventType: string;
      switch (type) {
        case BABYLON.PointerEventTypes.POINTERUP:
          eventType = 'mouseup';
          break;
        case BABYLON.PointerEventTypes.POINTERDOWN:
          eventType = 'mousedown';
          break;
        default:
          eventType = null;
          break;
      }
      return this._element.dispatchEvent(new MouseEventImpl(eventType, {
        clientX: x,
        clientY: y,
      }));
    } else {
      return true;
    }
  }
}
