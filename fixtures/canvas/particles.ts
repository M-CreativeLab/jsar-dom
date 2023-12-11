const ROWS = 100;
const COLS = 300;

let NUM_PARTICLES = (ROWS * COLS),
  THICKNESS = Math.pow(80, 2),
  SPACING = 3,
  MARGIN = 100,
  COLOR = 220,
  DRAG = 0.95,
  EASE = 0.25,

  /*
  
  used for sine approximation, but Math.sin in Chrome is still fast enough :)http://jsperf.com/math-sin-vs-sine-approximation

  B = 4 / Math.PI,
  C = -4 / Math.pow( Math.PI, 2 ),
  P = 0.225,

  */

  particle,
  list,
  tog,
  man,
  dx, dy,
  mx, my,
  d, t, f,
  a, b,
  n,
  p, s,
  r, c
  ;

let w, h;
let i;

particle = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0
};

export function init(ctx, width, height) {
  man = false;
  tog = true;

  list = [];

  w = width = COLS * SPACING + MARGIN * 2;
  h = height = ROWS * SPACING + MARGIN * 2;

  for (i = 0; i < NUM_PARTICLES; i++) {

    p = Object.create(particle);
    p.x = p.ox = MARGIN + SPACING * (i % COLS);
    p.y = p.oy = MARGIN + SPACING * Math.floor(i / COLS);

    list[i] = p;
  }
}

export function step(ctx) {
  if (tog = !tog) {
    if (!man) {
      t = +new Date() * 0.001;
      mx = w * 0.5 + (Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45);
      my = h * 0.5 + (Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45);
    }

    for (i = 0; i < NUM_PARTICLES; i++) {
      p = list[i];
      d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
      f = -THICKNESS / d;

      if (d < THICKNESS) {
        t = Math.atan2(dy, dx);
        p.vx += f * Math.cos(t);
        p.vy += f * Math.sin(t);
      }

      p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
      p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;

    }

  } else {
    b = (a = ctx.createImageData(w, h)).data;
    for (i = 0; i < NUM_PARTICLES; i++) {
      p = list[i];
      b[n = (~~p.x + (~~p.y * w)) * 4] = b[n + 1] = b[n + 2] = COLOR, b[n + 3] = 255;
    }
    ctx.putImageData(a, 0, 0);
  }
}
