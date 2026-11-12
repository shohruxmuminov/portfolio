/**
 * Point-cloud generators for the morphing particle sculpture.
 * Every shape returns `count` xyz triples so the GPU can blend between them.
 * Shapes are visual studies of each project's idea, not product renders.
 */

export const SHAPES = {
  orb: 0,
  ielts: 1,
  ai: 2,
  orbit: 3,
  street: 4,
  watch: 5,
  galaxy: 6,
  text: 7,
} as const;

export const SHAPE_COUNT = 8;

type V3 = [number, number, number];
type Rand = () => number;

function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: Rand) => (r() + r() + r() + r() - 2) / 2;

function rotate([x, y, z]: V3, rx: number, ry: number, rz = 0): V3 {
  // X
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  // Y
  const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  // Z
  const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  y1 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  z1 = z2;
  return [x3, y1, z1];
}

function onSphere(r: Rand, radius: number): V3 {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t) * radius, u * radius, s * Math.sin(t) * radius];
}

function build(count: number, seed: number, fn: (i: number, r: Rand) => V3) {
  const r = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = fn(i, r);
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }
  return out;
}

/* 0 — Aura orb with a tilted ring */
function orb(count: number) {
  const sphereCount = Math.floor(count * 0.7);
  const golden = Math.PI * (3 - Math.sqrt(5));
  return build(count, 11, (i, r) => {
    if (i < sphereCount) {
      const y = 1 - (2 * (i + 0.5)) / sphereCount;
      const rad = Math.sqrt(1 - y * y);
      const th = i * golden;
      const R = 1.42 + gauss(r) * 0.03;
      return [Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R];
    }
    const a = r() * Math.PI * 2;
    const R = 2.05 + gauss(r) * 0.16;
    return rotate([Math.cos(a) * R, gauss(r) * 0.03, Math.sin(a) * R], 1.2, 0, 0.35);
  });
}

/* 1 — IELTS: stacked exam sheets with answer-bubble grids */
function ielts(count: number) {
  const W = 1.7;
  const H = 2.3;
  const sheets: V3[] = [
    [-0.45, 0.3, -0.55],
    [0, 0, 0],
    [0.45, -0.3, 0.55],
  ];
  return build(count, 21, (i, r) => {
    const s = i % 3;
    const [ox, oy, oz] = sheets[s];
    const c = r();
    let p: V3;
    if (c < 0.2) {
      // sheet border
      const t = r() * 2 * (W + H);
      if (t < W) p = [-W / 2 + t, H / 2, 0];
      else if (t < W + H) p = [W / 2, H / 2 - (t - W), 0];
      else if (t < 2 * W + H) p = [W / 2 - (t - W - H), -H / 2, 0];
      else p = [-W / 2, -H / 2 + (t - 2 * W - H), 0];
    } else if (c < 0.27) {
      // header lines
      const line = r() < 0.6 ? 0 : 1;
      p = [-W / 2 + 0.18 + r() * (line ? 0.6 : 1.0), H / 2 - 0.22 - line * 0.14, 0];
    } else {
      // bubbles: 4 columns × 8 rows
      const b = Math.floor(r() * 32);
      const col = b % 4;
      const row = Math.floor(b / 4);
      const cx = -W / 2 + 0.38 + col * 0.3;
      const cy = H / 2 - 0.62 - row * 0.22;
      const filled = (b * 7 + s * 3) % 5 === 0;
      const a = r() * Math.PI * 2;
      const rr = filled ? Math.sqrt(r()) * 0.075 : 0.075;
      p = [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0];
    }
    return rotate([p[0] + ox, p[1] + oy, p[2] + oz + gauss(r) * 0.01], 0.12, -0.5, 0.04);
  });
}

/* 2 — AI: neural network sphere */
function ai(count: number) {
  const r0 = mulberry32(31);
  const K = 34;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes: V3[] = [];
  for (let k = 0; k < K; k++) {
    const y = 1 - (2 * (k + 0.5)) / K;
    const rad = Math.sqrt(1 - y * y);
    const R = 1.25 + r0() * 0.45;
    nodes.push([Math.cos(k * golden) * rad * R, y * R, Math.sin(k * golden) * rad * R]);
  }
  const edges: [V3, V3][] = [];
  nodes.forEach((n, a) => {
    const near = nodes
      .map((m, b) => ({ b, d: (m[0] - n[0]) ** 2 + (m[1] - n[1]) ** 2 + (m[2] - n[2]) ** 2 }))
      .filter((o) => o.b !== a)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3);
    near.forEach((o) => edges.push([n, nodes[o.b]]));
    if (a % 3 === 0) edges.push([n, [0, 0, 0]]);
  });
  return build(count, 32, (_, r) => {
    const c = r();
    if (c < 0.28) {
      const n = nodes[Math.floor(r() * K)];
      return [n[0] + gauss(r) * 0.05, n[1] + gauss(r) * 0.05, n[2] + gauss(r) * 0.05];
    }
    if (c < 0.86) {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      const t = r();
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    const p = onSphere(r, Math.cbrt(r()) * 0.32);
    return p;
  });
}

/* 3 — Orbit OS: planet, rings and floating windows */
function orbit(count: number) {
  const windows = [
    { c: [-1.55, 0.8, -0.4] as V3, w: 1.15, h: 0.78, ry: 0.4 },
    { c: [1.5, 0.45, 0.25] as V3, w: 1.0, h: 0.72, ry: -0.4 },
    { c: [-0.15, -1.3, 0.55] as V3, w: 1.35, h: 0.62, ry: 0.08 },
  ];
  return build(count, 41, (_, r) => {
    const c = r();
    if (c < 0.3) return onSphere(r, 0.62 + gauss(r) * 0.01);
    if (c < 0.56) {
      const big = r() < 0.55;
      const a = r() * Math.PI * 2;
      const R = (big ? 1.75 : 1.2) + gauss(r) * 0.02;
      return rotate([Math.cos(a) * R, 0, Math.sin(a) * R], big ? 1.15 : 1.35, 0, big ? 0.35 : -0.2);
    }
    const win = windows[Math.floor(r() * windows.length)];
    const { w, h } = win;
    const k = r();
    let p: V3;
    if (k < 0.55) {
      const t = r() * 2 * (w + h);
      if (t < w) p = [-w / 2 + t, h / 2, 0];
      else if (t < w + h) p = [w / 2, h / 2 - (t - w), 0];
      else if (t < 2 * w + h) p = [w / 2 - (t - w - h), -h / 2, 0];
      else p = [-w / 2, -h / 2 + (t - 2 * w - h), 0];
    } else if (k < 0.7) {
      p = [-w / 2 + r() * w, h / 2 - 0.14, 0];
    } else if (k < 0.78) {
      const d = Math.floor(r() * 3);
      const a = r() * Math.PI * 2;
      p = [-w / 2 + 0.1 + d * 0.08 + Math.cos(a) * 0.022, h / 2 - 0.07 + Math.sin(a) * 0.022, 0];
    } else {
      const line = Math.floor(r() * 3);
      p = [-w / 2 + 0.12 + r() * (w * (0.75 - line * 0.18)), h / 2 - 0.3 - line * 0.13, 0];
    }
    const q = rotate(p, 0, win.ry);
    return [q[0] + win.c[0], q[1] + win.c[1], q[2] + win.c[2]];
  });
}

/* 4 — Street View Walker: a wireframe skyline on a street grid */
function street(count: number) {
  const r0 = mulberry32(57);
  const G = 4;
  const step = 1.0;
  const foot = 0.52;
  const buildings = [] as { x: number; z: number; h: number }[];
  for (let gx = 0; gx < G; gx++) {
    for (let gz = 0; gz < G; gz++) {
      const x = (gx - (G - 1) / 2) * step;
      const z = (gz - (G - 1) / 2) * step;
      if (gx === 0 && gz === 3) continue; // a plaza
      const center = 1 - Math.min(1, Math.hypot(x, z) / 2.2);
      buildings.push({ x, z, h: 0.35 + r0() * 0.8 + center * 1.4 });
    }
  }
  // Weight by perimeter length so tall towers get proportionally more points.
  const weights = buildings.map((b) => b.h * 4 + foot * 8);
  const total = weights.reduce((a, b) => a + b, 0);
  const extent = (G / 2) * step;
  const hf = foot / 2;
  const corners: [number, number][] = [
    [-hf, -hf],
    [hf, -hf],
    [hf, hf],
    [-hf, hf],
  ];
  return build(count, 54, (_, r) => {
    const c = r();
    let p: V3;
    if (c < 0.16) {
      // street grid between the blocks
      const along = (r() * 2 - 1) * extent;
      const line = (Math.floor(r() * (G - 1)) - (G - 2) / 2) * step;
      p = r() < 0.5 ? [along, 0, line] : [line, 0, along];
    } else if (c < 0.22) {
      // a walking path through the middle
      const t = r();
      p = [step / 2 + Math.sin(t * Math.PI * 3) * 0.08, 0.02, extent - t * extent * 2];
    } else {
      let pick = r() * total;
      let idx = 0;
      while (idx < buildings.length - 1 && (pick -= weights[idx]) > 0) idx++;
      const b = buildings[idx];
      const k = r();
      if (k < 0.5) {
        const [cx, cz] = corners[Math.floor(r() * 4)];
        p = [b.x + cx, r() * b.h, b.z + cz];
      } else if (k < 0.85) {
        const side = Math.floor(r() * 4);
        const [ax, az] = corners[side];
        const [bx, bz] = corners[(side + 1) % 4];
        const t = r();
        const y = r() < 0.85 ? b.h : 0;
        p = [b.x + ax + (bx - ax) * t, y, b.z + az + (bz - az) * t];
      } else {
        // a few floor lines
        const floors = Math.max(1, Math.floor(b.h / 0.22));
        const fy = (Math.floor(r() * floors) + 1) * (b.h / (floors + 1));
        const side = Math.floor(r() * 4);
        const [ax, az] = corners[side];
        const [bx, bz] = corners[(side + 1) % 4];
        const t = r();
        p = [b.x + ax + (bx - ax) * t, fy, b.z + az + (bz - az) * t];
      }
    }
    return rotate([p[0], p[1] - 0.7, p[2]], 0.36, 0.62);
  });
}

/* 5 — Mechanical watch: gears, bezel ticks and a balance wheel */
function gearPoint(r: Rand, cx: number, cy: number, ro: number, ri: number, teeth: number): V3 {
  const a = r() * Math.PI * 2;
  const phase = ((a / (Math.PI * 2)) * teeth) % 1;
  let rad = phase < 0.5 ? ro : ri;
  if (r() < 0.22) {
    // tooth flanks
    const edge = r() < 0.5 ? 0 : 0.5;
    const a2 = ((Math.floor((a / (Math.PI * 2)) * teeth) + edge) / teeth) * Math.PI * 2;
    rad = ri + r() * (ro - ri);
    return [cx + Math.cos(a2) * rad, cy + Math.sin(a2) * rad, (r() < 0.5 ? -1 : 1) * 0.06];
  }
  return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, (r() < 0.5 ? -1 : 1) * 0.06];
}

function watch(count: number) {
  return build(count, 61, (_, r) => {
    const c = r();
    let p: V3;
    if (c < 0.3) p = gearPoint(r, -0.25, -0.1, 1.05, 0.95, 32);
    else if (c < 0.4) {
      // spokes and hub
      if (r() < 0.65) {
        const s = Math.floor(r() * 5);
        const a = (s / 5) * Math.PI * 2 + 0.3;
        const t = 0.18 + r() * 0.72;
        p = [-0.25 + Math.cos(a) * t, -0.1 + Math.sin(a) * t, gauss(r) * 0.02];
      } else {
        const a = r() * Math.PI * 2;
        p = [-0.25 + Math.cos(a) * 0.18, -0.1 + Math.sin(a) * 0.18, 0];
      }
    } else if (c < 0.53) p = gearPoint(r, 0.98, 0.88, 0.5, 0.42, 14);
    else if (c < 0.72) {
      const a = r() * Math.PI * 2;
      const R = 1.95 + (r() < 0.5 ? 0 : 0.08);
      p = [Math.cos(a) * R, Math.sin(a) * R, gauss(r) * 0.04];
    } else if (c < 0.85) {
      const t = Math.floor(r() * 60);
      const a = (t / 60) * Math.PI * 2;
      const len = t % 5 === 0 ? 0.24 : 0.1;
      const R = 1.82 - r() * len;
      p = [Math.cos(a) * R, Math.sin(a) * R, 0];
    } else {
      // balance wheel + hairspring
      const cx = 0.8;
      const cy = -1.0;
      if (r() < 0.5) {
        const a = r() * Math.PI * 2;
        p = [cx + Math.cos(a) * 0.38, cy + Math.sin(a) * 0.38, 0.05];
      } else {
        const t = r() * 6 * Math.PI;
        const R = 0.04 + t * 0.014;
        p = [cx + Math.cos(t) * R, cy + Math.sin(t) * R, 0.05];
      }
    }
    return rotate(p, -0.35, 0.32);
  });
}

/* 6 — Spiral galaxy, used as an ambient backdrop */
function galaxy(count: number) {
  return build(count, 71, (_, r) => {
    if (r() < 0.14) {
      return onSphere(r, Math.cbrt(r()) * 0.45);
    }
    const arm = Math.floor(r() * 3);
    const R = r() ** 0.75 * 3.3 + 0.2;
    const a = (arm / 3) * Math.PI * 2 + R * 1.55 + (gauss(r) * 0.35) / (R * 0.5 + 0.4);
    const y = gauss(r) * 0.12 * (1.2 - R / 3.6);
    return rotate([Math.cos(a) * R, y, Math.sin(a) * R], 1.05, 0, 0.25);
  });
}

/* 7 — The name, sampled from canvas text (browser only) */
function text(count: number, word: string, fontFamily: string) {
  const W = 1200;
  const H = 260;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const r = mulberry32(81);
  const out = new Float32Array(count * 3);
  if (!ctx) return out;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 210px ${fontFamily}`;
  ctx.fillText(word, W / 2, H / 2 + 6);
  const data = ctx.getImageData(0, 0, W, H).data;
  const filled: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 140) filled.push(x, y);
    }
  }
  const pairs = filled.length / 2;
  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    let z: number;
    if (pairs === 0 || r() < 0.06) {
      x = (r() - 0.5) * 6.4;
      y = (r() - 0.5) * 2.2;
      z = gauss(r) * 0.6;
    } else {
      const k = Math.floor(r() * pairs);
      x = ((filled[k * 2] + r() * 2) / W - 0.5) * 5.6;
      y = -((filled[k * 2 + 1] + r() * 2) / H - 0.5) * 1.21;
      z = gauss(r) * 0.05;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function generateShapes(count: number, fontFamily: string) {
  return [orb(count), ielts(count), ai(count), orbit(count), street(count), watch(count), galaxy(count), text(count, "SHOHRUX", fontFamily)];
}

/** Natural width of each shape in world units, used to fit it to the viewport. */
export const SHAPE_WIDTH = [4.4, 3.2, 3.6, 4.6, 4.8, 4.2, 6.4, 5.6];
