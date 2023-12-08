import * as taffy from '@bindings/taffy';
import { CSSStyleDeclaration } from 'cssstyle';
import DOMRectReadOnlyImpl from '../../geometry/DOMRectReadOnly';
import { HTMLContentElement } from 'src/living/nodes/HTMLContentElement';

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
  private _renderingContext: CanvasRenderingContext2D;

  constructor(private _allocator: taffy.Allocator, private _element: HTMLContentElement | null) { }

  init(defaultStyle?: LayoutStyle) {
    if (defaultStyle) {
      this.layoutStyle = defaultStyle;
    } else {
      this.layoutStyle = this._initializeLayoutStyle();
    }
    this.layoutNode = new taffy.Node(this._allocator, this.layoutStyle);
  }

  setRenderingContext(renderingContext: CanvasRenderingContext2D) {
    this._renderingContext = renderingContext;
  }

  addChild(child: Control2D) {
    this.layoutNode.addChild(child.layoutNode);
  }

  removeChild(child: Control2D) {
    this.layoutNode.removeChild(child.layoutNode);
  }

  dispose() {
    if (this.layoutNode) {
      this.layoutNode.free();
      this.layoutNode = null;
    }
  }

  get _style(): CSSStyleDeclaration {
    return this._element?._style || {} as unknown as CSSStyleDeclaration;
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
    };
    const element = this._element;
    if (element && element._style) {
      const inputStyle = element._style;
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
        const value = inputStyle.getPropertyValue(property);
        if (value) {
          layoutStyle[property] = CSSValueToLayoutStyleMappings[property][value];
        }
      }
    }
    return layoutStyle;
  }

  updateLayoutStyle(forceUpdate = true, extraStyle?: LayoutStyle): boolean {
    let style: LayoutStyle;
    if (forceUpdate === true) {
      style = this._initializeLayoutStyle();
    } else {
      style = this.layoutStyle;
    }
    if (extraStyle) {
      style = { ...style, ...extraStyle };
    }
    this.layoutStyle = style;
    if (this.layoutNode) {
      this.layoutNode.setStyle(style);
    }
    return true;
  }

  /**
   * Render the controller itself.
   * 
   * @internal
   * @param rect 
   * @param base 
   */
  render(rect: DOMRect, base: DOMRectReadOnly): void {
    const x = rect.x + base.x;
    const y = rect.y + base.y;
    const width = rect.width;
    const height = rect.height;

    const canvasContext = this._renderingContext;
    const boxRect = new DOMRectReadOnlyImpl(x, y, width, height);

    if (this._element) {
      /**
       * Check if we need to render the borders, if yes, render the borders and fill the background, otherwise use `_renderRect` to fill a rect with background.
       */
      if (!this._renderBorders(canvasContext, boxRect)) {
        this._renderRect(canvasContext, boxRect);
      }

      /**
       * Render the inner text.
       */
      // if (this.ownInnerText) {
      //   this._renderInnerText(canvasContext, boxRect);
      // }
    }
    this._lastRect = boxRect;
  }

  private _getBorderRenderingContext(name?: 'top' | 'right' | 'bottom' | 'left'): BorderRenderingContext {
    if (this._element == null) {
      return;
    }
    let prefix = 'border';
    if (name) {
      prefix = `border-${name}`;
    }
    const style = this._element.style;
    return {
      width: parseFloat(style[`${prefix}-width`]),
      color: style[`${prefix}-color`],
      style: style[`${prefix}-style`],
    }
  }

  /**
   * Render the rectangle with background color in this control.
   */
  private _renderRect(renderingContext: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl) {
    renderingContext.fillStyle = this._style.backgroundColor || 'transparent';
    renderingContext.lineJoin = 'round';
    renderingContext.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  private _renderBorders(renderingContext: CanvasRenderingContext2D, rect: DOMRectReadOnlyImpl): boolean {
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

  /**
   * Process the element picking.
   * 
   * @internal
   * @param x 
   * @param y 
   * @param _type 
   */
  private _processPicking(x: number, y: number, _type?: number) {
    // TODO
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
  private _processPointerEvent(x: number, y: number, type: number): boolean {
    // TODO
    return true;
  }
}
