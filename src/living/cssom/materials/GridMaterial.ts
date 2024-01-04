import { PropertyValue } from '../parsers';

export default class GridMaterial extends BABYLON.StandardMaterial {
  private _enabled: boolean = false;
  private _texture: BABYLON.DynamicTexture;
  private _cellWidth: number = 20;
  private _cellHeight: number = 20;
  private _backgroundColor: string = 'transparent';
  private _majorLineColor: string = '#ffffff';
  private _minorLineColor: string = '#777777';
  private _majorLineThickness: number = 2;
  private _minorLineThickness: number = 1;
  private _majorLineFrequency: number = 5;
  private _displayMajorLines: boolean = true;
  private _displayMinorLines: boolean = true;

  constructor(name: string, scene: BABYLON.Scene, public width: number = 512, public height: number = 512) {
    super(name, scene);

    this._texture = new BABYLON.DynamicTexture('grid-texture', { width, height }, scene, false);
    this._texture.hasAlpha = true;
    this.useAlphaFromDiffuseTexture = true;
    this.diffuseTexture = this._texture;
    this.backFaceCulling = true;
  }

  private get _context(): BABYLON.ICanvasRenderingContext {
    return this._texture.getContext();
  }

  get cellWidth(): number {
    return this._cellWidth;
  }
  set cellWidth(value: number | PropertyValue) {
    if (typeof value === 'number') {
      this._cellWidth = value;
    } else {
      if (value.isLengthValue() && value.value.unit === 'px') {
        this._cellWidth = value.value.number;
      } else if (value.isPercentageValue()) {
        this._cellWidth = value.value * this.width / 100;
      }
    }
    this._drawGridSystem();
  }

  get cellHeight(): number {
    return this._cellHeight;
  }
  set cellHeight(value: number | PropertyValue) {
    if (typeof value === 'number') {
      this._cellHeight = value;
    } else {
      if (value.isLengthValue() && value.value.unit === 'px') {
        this._cellHeight = value.value.number;
      } else if (value.isPercentageValue()) {
        this._cellHeight = value.value * this.height / 100;
      }
    }
    this._drawGridSystem();
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }
  set backgroundColor(value: string) {
    this._backgroundColor = value;
    this._drawGridSystem();
  }

  get majorLineColor(): string {
    return this._majorLineColor;
  }
  set majorLineColor(value: string) {
    this._majorLineColor = value;
    this._drawGridSystem();
  }

  get minorLineColor(): string {
    return this._minorLineColor;
  }
  set minorLineColor(value: string) {
    this._minorLineColor = value;
    this._drawGridSystem();
  }

  get displayMajorLines(): boolean {
    return this._displayMajorLines;
  }
  set displayMajorLines(value: boolean) {
    this._displayMajorLines = value;
    this._drawGridSystem();
  }

  get displayMinorLines(): boolean {
    return this._displayMinorLines;
  }
  set displayMinorLines(value: boolean) {
    this._displayMinorLines = value;
    this._drawGridSystem();
  }

  _enable() {
    this._enabled = true;
    this._drawGridSystem();
  }

  _drawGridSystem() {
    if (!this._enabled) {
      return;
    }
    const context = this._context;
    context.save();

    if (this._backgroundColor !== 'transparent') {
      context.fillStyle = this._backgroundColor;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    const cellCountX = Math.ceil(context.canvas.width / this._cellWidth);
    const cellCountY = Math.ceil(context.canvas.height / this._cellHeight);

    if (this._displayMinorLines) {
      context.strokeStyle = this._minorLineColor;
      context.lineWidth = this._minorLineThickness;
      for (let x = 0; x < cellCountX; x++) {
        const cellX = x * this._cellWidth;
        context.beginPath();
        context.moveTo(cellX, 0);
        context.lineTo(cellX, context.canvas.height);
        context.stroke();
      }
      for (let y = 0; y < cellCountY; y++) {
        const cellY = y * this._cellHeight;
        context.beginPath();
        context.moveTo(0, cellY);
        context.lineTo(context.canvas.width, cellY);
        context.stroke();
      }
    }

    if (this._displayMajorLines) {
      context.strokeStyle = this._majorLineColor;
      context.lineWidth = this._majorLineThickness;
      for (let x = 0; x < cellCountX; x += this._majorLineFrequency) {
        const cellX = x * this._cellWidth;
        context.beginPath();
        context.moveTo(cellX, 0);
        context.lineTo(cellX, context.canvas.height);
        context.stroke();
      }
      for (let y = 0; y < cellCountY; y += this._majorLineFrequency) {
        const cellY = y * this._cellHeight;
        context.beginPath();
        context.moveTo(0, cellY);
        context.lineTo(context.canvas.width, cellY);
        context.stroke();
      }
    }
    context.restore();
    this._texture.update();
  }
}
