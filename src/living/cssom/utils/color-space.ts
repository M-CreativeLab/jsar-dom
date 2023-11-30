// https://www.w3.org/TR/css-color-4/#hsl-to-rgb
/**
 * @param {number} hue - Hue as degrees 0..360
 * @param {number} sat - Saturation as percentage 0..100
 * @param {number} light - Lightness as percentage 0..100
 * @return {number[]} Array of RGB components 0..255
 */
export function hslToRgb(hue: number, sat: number, light: number): [number, number, number] {
  hue = hue % 360;

  if (hue < 0) {
    hue += 360;
  }

  sat /= 100;
  light /= 100;

  function f(n: number): number {
    const k = (n + hue / 30) % 12;
    const a = sat * Math.min(light, 1 - light);
    const v = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255);
  }

  return [f(0), f(8), f(4)];
}
