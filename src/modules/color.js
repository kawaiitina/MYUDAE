// 0 ≤ h < 360, 0 ≤ s ≤ 1, 0 ≤ l ≤ 1
// returns 0x00000 to 0xFFFFFF
// https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const h1 = h / 60;
  const x = c * (1 - Math.abs((h1 % 2) - 1));
  let r1, g1, b1;
  if (0 <= h1 && h1 < 1) {
    (r1 = c), (g1 = x), (b1 = 0);
  } else if (1 <= h1 && h1 < 2) {
    (r1 = x), (g1 = c), (b1 = 0);
  } else if (2 <= h1 && h1 < 3) {
    (r1 = 0), (g1 = c), (b1 = x);
  } else if (3 <= h1 && h1 < 4) {
    (r1 = 0), (g1 = x), (b1 = c);
  } else if (4 <= h1 && h1 < 5) {
    (r1 = x), (g1 = 0), (b1 = c);
  } else if (5 <= h1 && h1 < 6) {
    (r1 = c), (g1 = 0), (b1 = x);
  }
  const m = l - c / 2;
  const r = Math.floor((r1 + m) * 255);
  const g = Math.floor((g1 + m) * 255);
  const b = Math.floor((b1 + m) * 255);
  return r * 0x10000 + g * 0x100 + b;
}

export { hslToRgb };
