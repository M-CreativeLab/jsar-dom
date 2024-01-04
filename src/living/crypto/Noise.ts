import * as noise from '@bindings/noise';

export default class NoiseImpl {
  constructor(public seed?: number) {
    if (!seed) {
      this.seed = Math.random();
    }
  }

  private _simplexN(inputs: number[]): number {
    const simplex = new noise.Simplex(this.seed);
    const point = new Float64Array(inputs);
    const v = simplex.get(point);
    simplex.free();
    return v;
  }

  private _perlinN(inputs: number[]): number {
    const perlin = new noise.Perlin(this.seed);
    const point = new Float64Array(inputs);
    const v = perlin.get(point);
    perlin.free();
    return v;
  }

  simplex2(x: number, y: number): number {
    return this._simplexN([x, y]);
  }

  simplex3(x: number, y: number, z: number): number {
    return this._simplexN([x, y, z]);
  }

  simplex4(x: number, y: number, z: number, w: number): number {
    return this._simplexN([x, y, z, w]);
  }

  perlin2(x: number, y: number): number {
    return this._perlinN([x, y]);
  }

  perlin3(x: number, y: number, z: number): number {
    return this._perlinN([x, y, z]);
  }

  perlin4(x: number, y: number, z: number, w: number): number {
    return this._perlinN([x, y, z, w]);
  }
}
