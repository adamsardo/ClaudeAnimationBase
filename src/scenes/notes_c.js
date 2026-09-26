// notes_c.js: shot C of "The Notes They Left Behind" (see STORYBOARD.md). Uses the shared pieces in NOTES (notes.js).
// THE HOUSE WAKES UP (10.5–15.7). Night. A tall, crooked townhouse full of other people's warm windows; four of them glow
// cold teal, the swarm's notes stuck to the inside of the glass. The resident (the one who looks after the house) is
// dusting its sill, catches the teal flicker next door, takes, and zips from window to window with its feather duster:
// each teal window it reaches flips warm on a beat and sheds its notes, which flutter off right into the night. It
// watches the last ones go, relieved, then worried. The house goes to sleep window by window, to black.
// No agents, no doors or keys: only the notes show that anyone was here.
(() => {
  const { flat, dark } = NOTES;

  // ---------- palette ----------
  const SKY = '#1D2350', SKY_LO = '#28316C', STAR = '#FFF1C9', MOON = '#F5E9C9', FAR = '#1F244C';
  const GROUND = '#19162C', PAVE = '#27223E';
  const FAC = '#5A5580', FAC_DK = '#46416A', LEDGE = '#3A365B', FRAME = '#A29BBE', ROOF = '#2E2A4A', CHIM = '#6D4A5E', DOOR = '#7C3A4E';
  const W_IN = '#D8893D', W_GL = '#FFBD60', T_IN = '#17605F', T_GL = '#5DEBCF', D_IN = '#211C36';
  const ROSE_B = '#CC6A80', HEAD_C = '#F2D2A0', CAP_C = '#6B7CC6', CUFF = '#F2E8D8', FEATH = '#9A68B0', HANDLE = '#6B4A3A';
  const NOTE_M = '#DDF8EE', NIGHT = '#1C1730', SWOOSH = mixCol(FEATH, PAL.cream, .55);

  // ---------- timing (shot time) ----------
  // BEAT = .625; this shot starts .125 before a beat, so the beats fall at .125 + k * BEAT.
  const B0 = Math.ceil(NOTES.START.C / BEAT - 1e-9) * BEAT - NOTES.START.C, BT = k => B0 + k * BEAT;
  const T_TAKE = BT(1);                       // .75: the take
  // 2.0, 2.625, 3.25: a teal window turns warm on each beat as the resident sweeps it; 3.5625 (the eighth after):
  // its backhand at the top window sends a gust across the pier into 3,1, which turns warm too
  const FLIPS = [BT(3), BT(4), BT(5), BT(5.5)];
  const ZIPS = [[1.60, 1.72, 0, 1], [2.34, 2.46, 1, 2], [2.97, 3.09, 2, 3]];   // [t0, t1, from station, to station]

  // ---------- the house ----------
  // Floors bottom to top; each sits a little off the one below (the house is crooked). Three windows a floor; the
  // ground floor has the front door in the middle.
  const HX0 = 400, HW = 640, WW = 140, WH = 170, PIER = 55, GY = 1000;
  const FL = [{ y0: 760, y1: 1000, off: 0 }, { y0: 520, y1: 760, off: 13 }, { y0: 280, y1: 520, off: -6 }, { y0: 40, y1: 280, off: 17 }];
  const winAt = (f, c) => { const x = HX0 + FL[f].off + PIER + c * (WW + PIER), y = f === 0 ? 800 : FL[f].y0 + 32; return { f, c, x, y, w: WW, h: WH, cx: x + WW / 2, cy: y + WH / 2 }; };
  // (the top-right window, where the resident ends up, keeps only a low stack in its far corner, clear of its arms)
  const ITEMS = { '0,0': 'easel', '0,2': 'boxes', '1,0': 'books', '1,1': 'lamp', '1,2': 'plant', '2,0': 'boxes', '2,1': 'easel', '2,2': 'books', '3,0': 'lamp', '3,1': 'plant', '3,2': 'stack' };
  const CURTAIN = { '0,0': 1, '1,2': 1, '2,0': 1, '3,0': 1 };
  // teal windows: when they flip, and their notes (x, y as fractions of the window; r = tilt). The top-right window's
  // notes sit at its right-hand side, so they fly off away from the resident's face; 3,1's are blown up by the gust.
  const TEAL = {
    // (a left-hand note sits high in the corner, so it flies up over the resident's cap rather than across its face)
    '1,1': { tf: FLIPS[0], notes: [[.14, .16, -.16], [.85, .62, .12]] },
    '2,2': { tf: FLIPS[1], notes: [[.13, .15, .1], [.85, .32, -.12], [.84, .74, .06]] },
    '3,2': { tf: FLIPS[2], notes: [[.84, .3, .12], [.87, .66, -.08]] },
    '3,1': { tf: FLIPS[3], notes: [[.3, .5, -.1], [.68, .74, .14]], gust: true },
  };
  // lights out, one by one: from the far corner of the top floor down through the house as the camera pulls back
  // (all ten gone by 4.62), then the resident alone in its own lit window for a quarter second, and it clicks off
  const OFF = { '3,0': 4.3, '3,1': 4.33, '2,0': 4.36, '2,1': 4.39, '2,2': 4.42, '1,0': 4.45, '1,1': 4.48, '1,2': 4.51, '0,0': 4.54, '0,2': 4.56, '3,2': 4.88 };
  const OFF_RAMP = .06;
  const WINS = [];
  for (let f = 0; f < 4; f++) for (let c = 0; c < 3; c++) if (f || c !== 1) {
    const w = winAt(f, c), k = f + ',' + c;
    Object.assign(w, { key: k, item: ITEMS[k], curtain: !!CURTAIN[k], teal: TEAL[k] || null, off: OFF[k] });
    WINS.push(w);
  }
  // every note stuck on a teal window, with its flip time and a small stagger
  const NOTESC = [];
  // (the gust comes in from the right, so in 3,1 the right-hand note goes first)
  WINS.forEach(w => { if (w.teal) w.teal.notes.forEach(([fx, fy, r], i) => NOTESC.push({ x: w.x + fx * w.w, y: w.y + fy * w.h, r, i: NOTESC.length, tf: w.teal.tf,
    d: w.teal.gust ? .005 + .05 * (1 - fx) : .015 + .05 * fx + .02 * hash(NOTESC.length + 3), last: !!w.teal.gust })); });
  // the resident's stations (the waist, at the sill): F1C0 (its own window) → F1C1 → F2C2 → F3C2
  const STW = [winAt(1, 0), winAt(1, 1), winAt(2, 2), winAt(3, 2)], STP = STW.map(w => [w.cx + 2, w.y + w.h + 6]);
  const RS = .95;   // the resident's scale (head radius 29 * RS)

  // ---------- the brush wipe from shot B ----------
  // brushWipe()'s strokes (the same shapes, colours, glaze and charcoal hatching), with each stroke's body laid as flat
  // colour: p5.brush's washes over the whole frame cost ~4.5 s a frame without a GPU, and these ~1.4 s. Shot B's last .3 s
  // covers the frame with it (NOTES.wipeBC), this shot's first .3 s drags it off. p: 0 → .5 covers, .5 → 1 drags off.
  const WIPE_D = [0, .14, .06, .18, .1], WIPE_N = 5, WIPE_BH = (H + 420) / WIPE_N + 40;
  const wipeX = (p, i) => {   // the stroke's body, from x0 to x1 (in the wipe's frame, turned -.1 about the centre)
    const d = WIPE_D[i], q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    return p < .5 ? [-300, lerp(-300, W + 400, q)] : [lerp(-300, W + 400, q), W + 400];
  };
  // whether the strokes cover the whole frame (the frame's corners reach x = W + 50 in the wipe's turned frame, and a
  // ragged end can fall 12 px short of x1): shot B skips its hall under them
  const wipeCovers = p => p > 0 && p < .5 && WIPE_D.every((d, i) => wipeX(p, i)[1] > W + 80);
  function wipeBC(p, cols) {
    if (p <= 0 || p >= 1) return;
    const [c1, c2] = cols;
    boilSeed('wipe bc');
    push(); translate(W / 2, H / 2); rotate(-.1); translate(-W / 2, -H / 2);
    for (let i = 0; i < WIPE_N; i++) {
      const y0 = -230 + i * (H + 420) / WIPE_N, [x0, x1] = wipeX(p, i);
      if (x1 - x0 < 30) continue;
      const pts = [], rag = k => 40 + 50 * hash(i * 31 + k) + jit(12);
      for (let k = 0; k <= 8; k++) pts.push([lerp(x0, x1, k / 8), y0 + Math.sin(k * .9 + i) * 14 + jit(5)]);
      for (let k = 1; k < 9; k++) pts.push([x1 + rag(k) - 40, y0 + WIPE_BH * k / 9]);
      for (let k = 8; k >= 0; k--) pts.push([lerp(x0, x1, k / 8), y0 + WIPE_BH + Math.sin(k * .8 + i * 2) * 14 + jit(5)]);
      if (p >= .5) for (let k = 8; k > 0; k--) pts.push([x0 - rag(k + 20) + 40, y0 + WIPE_BH * k / 9]);
      flat(pts, i % 2 ? c1 : c2);
      flat(pts, i % 2 ? c2 : c1, 42);   // brushWipe's fill, as lite mode lays it: a glaze of the other colour
      paint(pts, { hatch: { d: 44, a: 0, o: { rand: .6, gradient: .5 }, b: 'charcoal', c: i % 2 ? c2 : PAL.cream, w: .8 }, ink: null });
    }
    pop();
  }
  // while it covers: the screen x left of which every stroke has passed (its turned frame and ragged ends allowed for), so
  // shot B can leave out what is already under it
  const wipeEdge = p => p > 0 && p < .5 ? Math.min(...WIPE_D.map((d, i) => wipeX(p, i)[1])) - 130 : -1e9;
  NOTES.wipeBC = wipeBC; NOTES.wipeCovers = wipeCovers; NOTES.wipeEdge = wipeEdge;

  // ---------- small helpers ----------
  // smooth keys (Catmull-Rom), for a camera that never stops dead between keys
  function spl(t, K) {
    if (t <= K[0][0]) return K[0][1];
    if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
    let i = 0; while (t > K[i + 1][0]) i++;
    const m = j => j <= 0 || j >= K.length - 1 ? 0 : (K[j + 1][1] - K[j - 1][1]) / (K[j + 1][0] - K[j - 1][0]);
    const [t0, v0] = K[i], [t1, v1] = K[i + 1], h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * h * m(i) + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * h * m(i + 1);
  }
  // how warm / teal / dark a window is at lt
  function winLight(w, lt) {
    // a teal window switches like a light: the teal snaps off (a frame of dark), then the warm light comes on
    const teal = w.teal ? 1 - ease(seg(lt, w.teal.tf - .045, w.teal.tf)) : 0, warm = w.teal ? ease(seg(lt, w.teal.tf + .005, w.teal.tf + .07)) : 1;
    const off = ease(seg(lt, w.off, w.off + OFF_RAMP));
    return { warm, teal, off, on: 1 - off };
  }
  // the teal flicker: a steady shimmer with the odd dip, a pure function of t
  // the flare next door that catches the resident's eye: two quick bright pulses just before it looks
  const flare = lt => 1 + .9 * Math.exp(-Math.pow((lt - .4) / .035, 2)) + 1.1 * Math.exp(-Math.pow((lt - .5) / .04, 2));
  const flicker = (i, t) => .84 + .08 * Math.sin(t * 31 + i * 2) + .06 * Math.sin(t * 13 + i) - (hash(Math.floor(t * 14) + i * 13) > .86 ? .3 : 0);

  // ---------- camera ----------
  // Lands from shot B's whip pan still moving right and easing out; then a slow push on the resident, a tilt up the
  // house with it, a drift after the notes, and a slow pull back as the lights go out.
  function camAt(lt) {
    const land = 1 - easeOut(seg(lt, 0, .62));
    return {
      cx: spl(lt, [[0, 852], [.62, 830], [1.45, 650], [2.15, 730], [3.3, 900], [4.25, 1075], [5.2, 960]]) - 760 * land,
      cy: spl(lt, [[0, 505], [.62, 530], [1.45, 605], [2.15, 560], [3.3, 280], [4.25, 195], [5.2, 370]]),
      z: spl(lt, [[0, .92], [.62, .97], [1.45, 1.45], [2.15, 1.38], [3.3, 1.12], [4.25, 1.4], [5.2, 1.0]]),
    };
  }

  // ---------- the resident ----------
  // A small round-headed keeper of the house, seen waist-up through a window: cream-ochre head, dot eyes, a tiny
  // mouth, a rose body, stubby arms, a periwinkle nightcap whose tip drags behind every move, and a feather duster.
  // (x, y) = the waist (hidden behind the sill); s = scale (head radius 29s). Pose: dx, dy (px / s), rot (lean, pivots
  // at the waist), sq (squash, − stretches), sx/sy, smear { dir: [ux, uy], e } (stretched 1 + e along the travel and
  // squeezed across it, so it keeps its volume; past e .5 it's a blur with no face), face −1..1 (turns the features),
  // lookX/lookY, eyes ('dot', 'wide', 'closed'), blink, brow (−1 worried: inner ends up .. 1 cross), browUp, mouth,
  // aL/aR (arm angles: 0 out, + up), capA (the cap tip: 0 up, − droops left), duster, dusterA (the duster turned in the
  // fist), dusterOff (slid through the fist, px / s), puff (the duster's feathers lagging), sil 0..1 (lights out).
  const RBODY = [[-38, 26], [-39, -8], [-35, -34], [-26, -54], [-12, -64], [0, -66], [12, -64], [26, -54], [35, -34], [39, -8], [38, 26]];
  // a closed outline smoothed through its points (Catmull-Rom), so a flat fill and its ink outline share one shape
  const smoothClosed = (P, n = 4) => through([P[P.length - 1], ...P, P[0], P[1]], n).slice(n, n * (P.length + 1));
  const RBODY_S = smoothClosed(RBODY);
  // Each part is laid as flat colour and then inked (a wash + ink paint() per part would cost p5.brush two composites
  // per part; see "culling" below). Parts go back to front, so later parts cover earlier outlines.
  const part = (pts, col, sw, a) => { flat(pts, col, a); paint(pts, { ink: PAL.ink, sw }); };
  function resident(x, y, s, o = {}) {
    const key = o.key || 'res', rs = p => boilSeed(`res ${key} ${p}`), sil = clamp(o.sil || 0);
    const C = c => sil > 0 ? mixCol(c, NIGHT, sil * .92) : c, P = pts => pts.map(([a, b]) => [a * s, b * s]);
    const se = o.smear ? o.smear.e : 0, blur = se > .5;
    const sw = 1.15 * s / (1 + .8 * se), face = clamp(o.face || 0, -1, 1), fx = face * 9 * s, sq = o.sq || 0;
    push(); translate(x + (o.dx || 0) * s, y + (o.dy || 0) * s);
    if (se > 0) {   // the smear: about the middle of the body, along the travel
      const th = Math.atan2(o.smear.dir[1], o.smear.dir[0]);
      translate(0, -60 * s); rotate(th); scale(1 + se, 1 / (1 + se)); rotate(-th); translate(0, 60 * s);
    }
    rotate(o.rot || 0); scale((o.sx ?? 1) * (1 + sq * .6), (o.sy ?? 1) * (1 - sq));
    rs('body');
    flat(P(RBODY_S), C(ROSE_B));
    flat(ellPts((-13 + face * 5) * s, -40 * s, 10 * s, 14 * s, 12, 0, .35), C(mixCol(ROSE_B, PAL.cream, .3)), 150);
    paint(P(RBODY_S), { ink: PAL.ink, sw });
    // head and face: colour first (head, cheeks, eyes, open mouth), then all its ink
    const hy = -92 * s, hr = 29 * s, head = ellPts(0, hy, hr, hr * .96, 22);
    rs('head');
    flat(head, C(HEAD_C));
    if (sil < .6 && !blur) for (const sd of [-1, 1]) flat(ellPts(fx + sd * 16 * s, hy + 7 * s, 5 * s, 3.2 * s, 10), C(PAL.rose), 120 * (1 - sil));
    const eyeAt = sd => [fx + sd * 10 * s, hy - s, 1 - Math.max(0, -sd * face) * .3];
    const lx = (o.lookX || 0) * 2.6 * s, ly = (o.lookY || 0) * 2.2 * s, wide = o.eyes === 'wide', dots = !blur && !o.blink && o.eyes !== 'closed';
    if (dots) for (const sd of [-1, 1]) {
      const [ex, ey, k] = eyeAt(sd), rx = (wide ? 4.6 : 3.4) * s * k, ry = (wide ? 6 : 4.4) * s;
      flat(ellPts(ex + lx * k, ey + ly, rx, ry, 12), PAL.ink);
      if (wide) flat(ellPts(ex + (lx - 1.5 * s) * k, ey + ly - 2.1 * s, 1.6 * s, 1.8 * s, 8), PAL.cream);
    }
    const mo = blur ? null : o.mouth === 'O' ? ellPts(fx, hy + 12 * s, 4 * s, 5.2 * s, 12) : o.mouth === 'o' ? ellPts(fx, hy + 11 * s, 2.4 * s, 2.8 * s, 10) : null;
    if (mo) flat(mo, '#4A1F2A');
    rs('face');
    paint(head, { ink: PAL.ink, sw });
    if (!dots && !blur) for (const sd of [-1, 1]) {
      const [ex, ey, k] = eyeAt(sd), L = pts => inkLine(pts.map(([a, b]) => [ex + a * s * k, ey + b * s]), sw * .9, PAL.ink, 'ink', .4);
      if (o.blink) L([[-4, .5], [4, .5]]); else L([[-4.5, 1.5], [0, -2], [4.5, 1.5]]);
    }
    if (mo) paint(mo, { ink: PAL.ink, sw: sw * .55 });
    else if (!blur) { push(); translate(fx, hy + 11 * s); resMouth(o.mouth, s, sw); pop(); }
    // the nightcap: a cone that flops, a cuff, a pompom
    rs('cap');
    const a = o.capA ?? -1.1, B = [0, hy - hr * .62], M = [Math.sin(a * .5) * 14 * s, hy - hr - 14 * s], TP = [M[0] + Math.sin(a) * 30 * s, M[1] - Math.cos(a) * 30 * s];
    part(ribbon([B, M, TP], 54 * s, 7 * s), C(CAP_C), sw * .9);
    part(rrPts(-hr * 1.02, hy - hr * .84, hr * 2.04, hr * .34, hr * .16), C(CUFF), sw * .8);
    part(ellPts(TP[0], TP[1], 6.5 * s, 6.5 * s, 12), C(CUFF), sw * .7);
    // brows, drawn after the cap so nothing covers them, in the forehead between the cuff (hy−24.4s..hy−14.5s) and
    // the eyes (tops at about hy−5.4s)
    rs('brows');
    if (!blur) for (const sd of [-1, 1]) {
      const b = o.brow || 0, [ex, , k] = eyeAt(sd), bx = ex + sd * .8 * s, by = hy - (8.8 + 3 * (o.browUp || 0)) * s;
      inkLine([[bx - sd * 4.2 * s * k, by + b * 2.2 * s], [bx + sd * 4.2 * s * k, by - b * 2.2 * s]], sw * .85, PAL.ink, 'ink', 0);
    }
    // stubby arms, in front; the duster in the right hand, gripped: the fist goes over the handle
    for (const sd of [-1, 1]) {
      rs('arm' + sd);
      const ang = sd < 0 ? (o.aL ?? -1) : (o.aR ?? -1);
      push(); translate(sd * 28 * s + fx * .2, -40 * s); rotate(sd < 0 ? ang : -ang);
      part(rrPts(sd < 0 ? -30 * s : -2 * s, -7.5 * s, 32 * s, 15 * s, 7.5 * s), C(ROSE_B), sw * .85);
      if (sd > 0 && o.duster !== false) {
        translate(26 * s, 0);
        push(); rotate(o.dusterA || 0); translate((o.dusterOff || 0) * s, 0); duster(s, sw, C, o.puff || 0); pop();
        part(ellPts(0, 0, 8 * s, 7.6 * s, 12), C(ROSE_B), sw * .8);
      }
      pop();
    }
    pop();
    rs('after');
  }
  const PUFF = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, bump = 1 + .13 * Math.abs(Math.sin(a * 4.5)); PUFF.push([(14 + Math.cos(a) * 16) * bump, Math.sin(a) * (7 + 6 * (1 + Math.cos(a)) / 2) * bump]); }
  const PUFF_S = smoothClosed(PUFF, 2);
  function duster(s, sw, C, lag) {
    part(rrPts(-2 * s, -2.6 * s, 36 * s, 5.2 * s, 2.4 * s), C(HANDLE), sw * .6);
    push(); translate(33 * s, 0); rotate(lag);   // a fluffy teardrop of feathers, scalloped
    flat(PUFF_S.map(([a, b]) => [a * s, b * s]), C(FEATH));
    flat(ellPts(17 * s, -3.5 * s, 9 * s, 4 * s, 10, 0, -.1), C(mixCol(FEATH, PAL.cream, .45)), 170);
    paint(PUFF_S.map(([a, b]) => [a * s, b * s]), { ink: PAL.ink, sw: sw * .7 });
    for (const k of [-1, 1]) inkLine([[3 * s, 0], [16 * s, k * 3.5 * s], [27 * s, k * 6 * s]], sw * .35, PAL.ink, 'inkfine', .5);
    pop();
  }
  function resMouth(m, s, sw) {
    const line = (pts, w = .9, c = .5) => inkLine(pts.map(([a, b]) => [a * s, b * s]), sw * w, PAL.ink, 'ink', c);
    switch (m) {
      case 'smile': line([[-4.5, -1], [0, 2], [4.5, -1]]); break;
      case 'flat': line([[-4, 0], [4, 0]], .9, 0); break;
      case 'wobble': line([[-5, .5], [-2.5, -.8], [0, .5], [2.5, -.8], [5, .5]], .75, .3); break;
      case 'frown': line([[-4.5, 1.5], [0, -1.2], [4.5, 1.5]]); break;
    }
  }

  // ---------- the resident's acting, as a pure function of shot time ----------
  // face swaps: the take, the decision, the smile after flips 1 and 2, the relief, the worried look. Blinks hide them.
  const SWAPS = [.735, 1.39, 2.14, 2.76], SW_RELIEF = 3.70, SW_WORRY = 4.04, BLINKS = [...SWAPS, SW_RELIEF, SW_WORRY];
  const wind = (lt, t0, t1) => ease(seg(lt, t0, t1));
  // the forehand sweep's arm angles: from over the left shoulder, over the top, down to the right
  const SW0 = 2.55, SW1 = -.55;
  const sweepK = (lt, tf) => easeOut(seg(lt, tf - .03, tf + .13));   // the duster's swing, across the beat
  // the backhand at the top window: from down-right back over the top and out to the left. Its gust leaves the duster
  // as the swing ends and crosses the pier into 3,1 by the eighth (FLIPS[3]).
  const BH0 = -.85, BH1 = 2.95, TBH = 3.41, backK = lt => easeOut(seg(lt, TBH, TBH + .08));
  const GUST = [3.46, FLIPS[3] - .02];   // the gust's head leaves the duster → reaches 3,1's glass
  // where the last notes (3,1's, blown up by the gust) are, on average: the resident's eyes follow them at the end
  const lastNotes = lt => { const L = NOTESC.filter(n => n.last).map(n => notePos(n, lt)); return [L.reduce((s, p) => s + p.x, 0) / L.length, L.reduce((s, p) => s + p.y, 0) / L.length]; };
  function actAt(lt) {
    const o = { eyes: 'dot', mouth: 'smile', brow: 0, browUp: 0, face: -.4, lookX: -.5, lookY: .7, rot: 0, sq: 0, dx: 0, dy: 0, aL: -1.05, aR: 2.9, capA: .9, sx: 1, sy: 1, puff: 0 };
    let st = 0, pos = STP[0], zip = null, blink = false;
    for (const z of ZIPS) if (lt >= z[0]) { st = z[3]; zip = z; }
    if (zip && lt < zip[1]) {   // mid-zip: slide between stations, smeared along the travel (and thinner across it)
      const k = seg(lt, zip[0], zip[1]), e = ease(k), A = STP[zip[2]], Bp = STP[zip[3]], sm = Math.sin(k * Math.PI);
      pos = [lerp(A[0], Bp[0], e), lerp(A[1], Bp[1], e)];
      const dx = Bp[0] - A[0], dy = Bp[1] - A[1], d = Math.hypot(dx, dy), uy = Math.abs(dy) / d;
      o.smear = { dir: [dx / d, dy / d], e: .8 * sm }; o.rot = .3 * sm * Math.sign(dx) * (1 - uy * .6);
      o.zip = { k, sm, dir: [dx / d, dy / d] };
    } else pos = STP[st];
    // --- station 0, its own window: dusting the books; the teal flickers next door; it looks, turns, takes, leans
    if (lt < ZIPS[0][0]) {
      const dust = Math.sin(lt * TAU * 2.4);
      o.aR = 2.9 + .2 * dust * (1 - seg(lt, .45, .6)); o.rot = -.04 + .03 * Math.sin(lt * TAU * 1.2); o.dy = -2 * Math.abs(Math.sin(lt * TAU * 1.2));
      o.puff = .25 * Math.sin(lt * TAU * 2.4 - 1);
      // eyes lead (.52), then the head turns (.6–.72) and the body dips into the take
      const look = wind(lt, .5, .58), turn = wind(lt, .6, .72);
      o.lookX = lerp(-.5, 1, look); o.lookY = lerp(.7, 0, look); o.face = lerp(-.4, .8, turn);
      o.sq = .1 * wind(lt, .62, .74);
      if (lt >= T_TAKE - .015) {   // the take: stretch up, eyes wide, arms fly up, '!'
        const a = lt - T_TAKE, tk = take(lt, T_TAKE, 1.3);
        Object.assign(o, { eyes: 'wide', mouth: 'O', browUp: 1, brow: -.2 });
        o.sq = tk.sq + .1 * Math.exp(-a * 12); o.dy = tk.dy * 12;
        o.aL = lerp(-1.05, .95, backOut(seg(lt, T_TAKE, T_TAKE + .18))); o.aR = lerp(2.9, 1.25, backOut(seg(lt, T_TAKE, T_TAKE + .2)));
        o.emote = '!'; o.emoteK = seg(a, .03, .2) * (1 - seg(a, .6, .75)); o.emoteAge = a;
        // the lean toward the teal window
        const ln = wind(lt, .95, 1.3);
        o.rot = lerp(o.rot, .2, ln); o.dx = 14 * ln; o.face = lerp(.8, 1, ln); o.lookX = 1; o.lookY = lerp(0, .15, ln);
        o.brow = lerp(-.2, -.75, ln); o.browUp = lerp(1, .55, ln); if (lt > 1.05) o.mouth = 'o';
        o.aL = lerp(o.aL, -.35, ease(seg(lt, 1.0, 1.3))); o.aR = lerp(o.aR, .35, ease(seg(lt, 1.0, 1.3)));
        o.sq += .03 * Math.sin((lt - 1.3) * 9) * seg(lt, 1.3, 1.35);
      }
      if (lt >= SWAPS[1]) {   // decides: brows down, crouch and pull back (anticipation of the zip)
        const k = wind(lt, 1.4, 1.56);
        Object.assign(o, { eyes: 'dot', mouth: 'flat', brow: lerp(-.75, .95, k), browUp: lerp(.55, 0, k), lookX: 1, lookY: 0 });
        o.rot = lerp(.2, -.12, k); o.dx = lerp(14, -8, k); o.sq = .16 * k;
        o.aL = lerp(-.35, -1.2, k); o.aR = lerp(.35, -1.25, k);
      }
    }
    // --- the zips and the sweeps
    const sweep = (i, tArr, tWind) => {   // arrive at tArr, wind up from tWind, sweep on the flip, follow through
      const tf = FLIPS[i], a = lt - tArr, big = i === 2 ? 1.25 : 1;
      o.face = .55; o.lookX = .45; o.lookY = -.15; o.eyes = 'dot'; o.mouth = 'flat'; o.brow = .9; o.browUp = 0;
      // braking on arrival: lean back against the travel, squash, and spring back; the duster swings up out of the
      // run, to where it shows above the sill
      const brake = Math.exp(-a * 9) * Math.cos(a * 16);
      o.rot = -.22 * brake * (i === 0 ? 1 : .5); o.sq = .12 * brake; o.dy = i ? 6 * brake : 0;
      o.aL = -1.1 + .3 * brake; o.aR = lerp(-1.4, 1.0, backOut(seg(a, 0, .14))) - .25 * brake;
      // wind-up: the duster goes back over the left shoulder, the body twists away
      const w = wind(lt, tWind, tf - .03);
      o.aR = lerp(o.aR, SW0, w); o.rot += -.14 * w * big; o.sq += .07 * w; o.aL = lerp(o.aL, -.5, w); o.dx = -5 * w;
      if (lt >= tf - .03) {   // the sweep, right across the glass; then (flips 1 and 2) the duster springs back up
        const k = sweepK(lt, tf), f = lt - tf, up = i < 2 ? backOut(seg(lt, tf + .12, tf + .26)) : 0;
        o.aR = lerp(SW0, SW1, k) + (1.05 - SW1) * up + .2 * spring(lt, tf + .13, 7, 17);
        o.rot = lerp(-.14 * big, .24 * big, k) - .12 * spring(lt, tf + .1, 6, 14);
        o.sq = lerp(.07, -.12, k) * Math.exp(-f * 5); o.dx = lerp(-5, 8, k) * Math.exp(-f * 3);
        o.aL = lerp(-.5, .3 * big, k) - .2 * spring(lt, tf + .12, 6, 15);
        o.puff = -.8 * Math.exp(-f * 6) * Math.cos(f * 18);
        o.sweep = { tf, f: lt - tf + .03 };
        if (i < 2 && lt >= SWAPS[2 + i]) { o.mouth = 'smile'; o.brow = lerp(.9, 0, seg(lt, SWAPS[2 + i], SWAPS[2 + i] + .1)); o.dy = 3 * Math.sin(seg(lt, tf + .18, tf + .3) * Math.PI); }
      }
    };
    if (zip && lt >= ZIPS[0][1] && st === 1) sweep(0, ZIPS[0][1], 1.83);
    if (zip && lt >= ZIPS[1][1] && st === 2) sweep(1, ZIPS[1][1], 2.5);
    // before each later zip: the eyes go first, to the next window (the thought), then the head; then a squash, and off
    for (const [z0, , from, to] of ZIPS.slice(1)) if (st === from && lt >= z0 - .18 && lt < z0) {
      const dx = STP[to][0] - STP[from][0], dy = STP[to][1] - STP[from][1], d = Math.hypot(dx, dy);
      const e = wind(lt, z0 - .18, z0 - .12), hd = wind(lt, z0 - .13, z0 - .05), q = wind(lt, z0 - .08, z0);
      o.lookX = lerp(o.lookX, dx / d, e); o.lookY = lerp(o.lookY, dy / d, e); o.face = lerp(o.face, .3 + .4 * dx / d, hd);
      o.sq += .14 * q; o.dy += 4 * q; o.aL = lerp(o.aL, -1.3, q); o.aR = lerp(o.aR, -1.4, q);
      if (q > .4) { o.mouth = 'flat'; o.brow = .9; }
    }
    if (zip && lt < zip[1]) { o.eyes = 'dot'; o.mouth = 'flat'; o.brow = .9; o.aL = -1.3; o.aR = -1.4; o.face = .6; }
    // --- the top window: the forehand flips it on the beat; a glance left (3,1 is still teal); a backhand on the
    // eighth whose gust crosses the pier and flips 3,1; its eyes follow the notes the gust blew up
    if (st === 3 && lt >= ZIPS[2][1]) {
      sweep(2, ZIPS[2][1], 3.12);
      const g = wind(lt, 3.29, 3.34), hd = wind(lt, 3.33, 3.41);
      o.lookX = lerp(o.lookX, -1, g); o.lookY = lerp(o.lookY, .05, g); o.face = lerp(o.face, -.45, hd);
      const w = wind(lt, 3.33, TBH);   // the backhand's wind-up: the duster dips on down to the right, the body coils
      o.aR = lerp(o.aR, BH0, w); o.rot = lerp(o.rot, .16, w); o.dx = lerp(o.dx, 6, w);
      if (lt >= TBH) {
        const k = backK(lt), f = lt - TBH, up = wind(lt, 3.52, 3.64);
        o.aR = lerp(BH0, BH1, k) + .22 * spring(lt, TBH + .08, 7, 16);
        o.rot = lerp(.16, -.24, k) + .1 * spring(lt, TBH + .08, 6, 14); o.dx = lerp(6, -9, k);
        o.aL = lerp(o.aL, .55, k) - .15 * spring(lt, TBH + .1, 6, 15);   // the free arm swings the other way
        o.sq = -.08 * Math.sin(k * Math.PI);
        o.puff = .8 * Math.exp(-f * 6) * Math.cos(f * 18);
        o.back = { f };
        o.lookY = lerp(o.lookY, -.9, up); o.lookX = lerp(-1, -.5, up); o.brow = lerp(.9, .2, wind(lt, 3.56, 3.66));
      }
    }
    // --- relief: phew. Eyes shut, a smile, the arms drop, a sweat drop
    if (lt >= SW_RELIEF) {
      const k = wind(lt, 3.66, 3.92);
      Object.assign(o, { eyes: 'closed', mouth: 'smile', brow: -.3, browUp: .1, lookX: 0, lookY: 0 });
      o.face = lerp(-.45, .25, wind(lt, 3.68, 3.86));
      o.sq = .1 * k + .02 * Math.sin(lt * TAU * .8); o.dy = 4 * k; o.rot = lerp(o.rot, -.03, k); o.dx = lerp(o.dx, 0, k);
      o.aL = lerp(o.aL, -1.25, k); o.aR = lerp(o.aR - TAU, -1.3, k); o.puff *= 1 - k;
      o.emote = 'sweat'; o.emoteK = seg(lt, 3.74, 3.86) * (1 - seg(lt, 3.98, 4.04)); o.emoteAge = lt - 3.74;
    }
    // --- but they're still out there: eyes open after the last notes (they follow them as they go), brows up in the
    // middle, a wobbly mouth; the duster hugged to its chest with both hands
    if (lt >= SW_WORRY) {
      const k = wind(lt, 4.02, 4.26), [nx, ny] = lastNotes(lt), hx = pos[0], hy = pos[1] - 92 * RS;
      const dd = Math.hypot(nx - hx, ny - hy) || 1, ux = (nx - hx) / dd, uy = (ny - hy) / dd;
      Object.assign(o, { eyes: 'dot', mouth: 'wobble', brow: lerp(-.3, -1, k), browUp: lerp(.1, .5, k) });
      o.face = lerp(.25, clamp(.15 + .8 * ux, -.6, 1), k); o.lookX = lerp(0, ux, k); o.lookY = lerp(0, uy, k);
      const gulp = pulse(lt, 5) * seg(lt, 4.45, 4.5);   // a gulp on the beat
      o.rot = lerp(-.03, .05, k) + .012 * Math.sin(lt * 33) * k; o.sq = lerp(.1, .02, k) + .05 * gulp; o.dy = 4 * (1 - k);
      const c = wind(lt, 4.1, 4.4);
      o.aR = lerp(-1.3, -Math.PI, c); o.dusterA = -3.49 * c; o.dusterOff = -12 * c; o.puff = .2 * c;
      o.aL = lerp(-1.25, -1.75, wind(lt, 4.16, 4.44));   // the other arm hangs in close
      o.emote = null;
      // alone in the last lit window: a long breath out, and a slow tired blink before the light goes
      const sag = wind(lt, 4.62, 4.8);
      o.sq += .07 * sag; o.dy += 5 * sag; o.brow = lerp(o.brow, -.55, sag); o.browUp = lerp(o.browUp, .25, sag); o.rot -= .06 * sag;
      if (lt > 4.71 && lt < 4.79) blink = true;
    }
    // the cap drags behind every move: it droops away from the way the face turns, and kicks on each event
    const faceLag = lt < .8 ? lerp(-.4, .8, wind(lt, .66, .8)) : o.face;
    o.capA = lerp(1.0, -1.2, (faceLag + 1) / 2) + .55 * spring(lt, T_TAKE, 5, 13) - .4 * ring(lt, ZIPS.map(z => z[1]), 6, 14)
      + .5 * ring(lt, FLIPS.map(f => f + .05), 5, 12) + .08 * Math.sin(lt * TAU * .9);
    if (o.zip) o.capA += -.9 * o.zip.sm * Math.sign(o.zip.dir[0] || -1);
    o.blink = blink || BLINKS.some(s => Math.abs(lt - s) < .035) || (o.eyes === 'dot' && ((lt * .7 + .3) % 2.9) < .07);
    o.pos = pos; o.st = st;
    return o;
  }

  // ---------- culling ----------
  // Never hand p5.brush a stroke that lands wholly off the canvas: it still marks its stroke mask as drawn, finds no
  // dirty rect, and composites the FULL frame at the next colour change (seconds a frame without a GPU). VIEW is the
  // world rect the current camera shows. For the same reason fills are laid flat first and the ink goes on after,
  // in as few colours as possible (every colour change is a composite).
  let VIEW = [0, 0, W, H];
  const setView = (cx, cy, z) => { VIEW = [cx - W / 2 / z, cy - H / 2 / z, cx + W / 2 / z, cy + H / 2 / z]; };
  const inView = (x0, y0, x1, y1) => x1 > VIEW[0] && x0 < VIEW[2] && y1 > VIEW[1] && y0 < VIEW[3];
  const ptsIn = pts => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return inView(x0, y0, x1, y1); };
  const ink = (pts, sw, col = PAL.ink, br = 'ink', curv = 0) => { if (ptsIn(pts)) inkLine(pts, sw, col, br, curv); };
  const outline = (pts, sw, curv = 0) => { if (ptsIn(pts)) paint(pts, { ink: PAL.ink, sw, curv }); };
  const fl = (pts, col, a) => { if (ptsIn(pts)) flat(pts, col, a); };

  // ---------- window insides ----------
  // Sill things: other people's work. (x, y) = the window's bottom-left, w = its width, dk = how dark it has gone.
  // pass 0 lays the colour, pass 1 inks the outlines.
  function sillItem(kind, x, y, w, dk, warm, key, pass) {
    boilSeed('item ' + key + pass);
    const C = c => mixCol(c, NIGHT, .15 + .7 * dk), F = (pts, c) => { if (!pass) fl(pts, C(c)); }, O = (pts, sw = .8, curv = 0) => { if (pass) outline(pts, sw, curv); };
    if (kind === 'plant') {
      const px = x + w * .76;
      for (const [a, l] of [[-.7, 24], [.05, 30], [.75, 22]]) { const P = ellPts(px + Math.sin(a) * l * .55, y - 22 - Math.cos(a) * l * .55, 6, l * .55, 10, 0, a); F(P, '#5E9A5C'); O(P, .55, .3); }
      const pot = [[px - 13, y], [px + 13, y], [px + 16, y - 22], [px - 16, y - 22]]; F(pot, '#B8664A'); O(pot);
    } else if (kind === 'books') {
      const bx = x + w * .12;
      for (const [o, bw, bh, c] of [[0, 9, 34, '#7A4E8A'], [10, 11, 40, '#4E7A8A'], [22, 8, 30, '#B8603E'], [32, 30, 9, '#C9A34A']]) { const P = rectPts(bx + o, y - bh, bw, bh); F(P, c); O(P, .55); }
    } else if (kind === 'lamp') {
      const lx = x + w * .78, on = warm * (1 - dk), shade = [[lx - 15, y - 30], [lx + 15, y - 30], [lx + 9, y - 50], [lx - 9, y - 50]], base = ellPts(lx, y - 3, 11, 4, 10);
      if (!pass) { F(base, '#7A6A5A'); fl(rectPts(lx - 1.2, y - 30, 2.4, 27), C('#3A3040')); if (on > .02) glow(lx, y - 40, 42, W_GL, .8 * on); fl(shade, mixCol(C('#E9C878'), '#FFE6A8', on)); }
      O(base, .5); O(shade);
    } else if (kind === 'stack') {   // two books lying flat and a teacup, low, in the far-left corner
      const bx = x + w * .04, b1 = rectPts(bx, y - 8, 34, 8), b2 = rectPts(bx + 3, y - 15, 28, 7), cup = [[bx + 8, y - 15], [bx + 22, y - 15], [bx + 20, y - 26], [bx + 10, y - 26]];
      F(b1, '#4E7A8A'); F(b2, '#B8603E'); F(cup, '#E8DCC8');
      O(b1, .55); O(b2, .55); O(cup, .55);
    } else if (kind === 'boxes') {
      const bx = x + w * .6, b1 = rectPts(bx, y - 24, 38, 24), b2 = rectPts(bx + 6, y - 44, 28, 20);
      F(b1, '#B0845A'); F(b2, '#C49A6A'); if (!pass) fl(rectPts(bx + 18, y - 44, 3, 20), C('#E8D0A0'));
      O(b1); O(b2);
    } else if (kind === 'easel') {
      const ex = x + w * .26, cv = rectPts(ex - 17, y - 56, 34, 28);
      if (!pass) for (const s of [-1, 1]) fl([[ex + s * 14 - 1.6, y], [ex + s * 14 + 1.6, y], [ex + 1.6, y - 58], [ex - 1.6, y - 58]], C('#8A6242'));
      F(cv, '#F0E4CC'); F(ellPts(ex + 7, y - 48, 4, 4, 8), '#E8AA38'); F([[ex - 15, y - 30], [ex - 4, y - 42], [ex + 6, y - 34], [ex + 15, y - 30]], '#6E9F58');
      O(cv);
    }
  }
  function curtains(w, dk, pass) {
    const c = mixCol('#8E3F52', NIGHT, .1 + .7 * dk);
    for (const sd of [0, 1]) {
      const x0 = sd ? w.x + w.w : w.x, dir = sd ? -1 : 1;
      if (!pass) fl([[x0, w.y], [x0 + dir * 34, w.y], [x0 + dir * 22, w.y + w.h * .55], [x0 + dir * 30, w.y + w.h], [x0, w.y + w.h]], c);
      else { boilSeed('curtain ' + w.key + sd); ink([[x0 + dir * 34, w.y + 2], [x0 + dir * 22, w.y + w.h * .55], [x0 + dir * 30, w.y + w.h - 2]], .5, PAL.ink, 'inkfine', .5); }
    }
  }

  // ---------- the flying notes ----------
  // Stuck to the glass until their window flips; then they peel (a quick curl) and flutter off right on rising arcs.
  // The last room's notes (3,1's, hit by the gust) are blown up and a little left first, so they clear the top window's
  // lintel, high over the resident's head, then drift slowly right across the sky until the end of the shot.
  function notePos(n, lt) {
    const a = lt - n.tf - n.d, h = hash(n.i * 5 + 1);
    if (a < 0) return { x: n.x, y: n.y, rot: n.r + .025 * Math.sin(lt * 6 + n.i), sx: 1, sc: 1, fly: 0 };
    if (a < .07) { const k = ease(a / .07); return { x: n.x + 6 * k, y: n.y - 8 * k, rot: n.r + .35 * k, sx: 1 - .45 * k, sc: 1, fly: 0 }; }
    const k = a - .07, ph = Math.acos(.55);
    if (!n.last) return {
      x: n.x + 6 + (300 + 80 * h) * k + 950 * k * k, y: n.y - 8 - (250 + 90 * h) * k + 200 * k * k + 14 * Math.sin(k * 10 + n.i),
      rot: n.r + .35 + 2.2 * k * (h > .5 ? 1 : -1) + .4 * Math.sin(k * 9 + n.i), sx: Math.cos(k * (9 + 3 * h) + ph), sc: (1 + .3 * clamp(k * 3)) * (1 - .2 * clamp(k)), fly: k,
    };
    const blow = 1 - Math.exp(-k * 7);
    return {
      x: n.x + 6 - 32 * blow + (150 + 30 * h) * k + 220 * k * k + 10 * Math.sin(k * 5 + n.i),
      y: n.y - 8 - (125 + 30 * h) * blow - 95 * k + 28 * k * k + 16 * Math.sin(k * 4.5 + n.i * 1.7),
      rot: n.r + .35 + 1.2 * k * (h > .5 ? 1 : -1) + .45 * Math.sin(k * 5 + n.i), sx: Math.cos(k * (5.5 + 2 * h) + ph), sc: 1 + .35 * clamp((k - .75) / .7), fly: k,
    };
  }

  // The swarm's notes, painted in batches: all the paper, then all the ink, then all the squiggles. The same slip as
  // NOTES.note() (a folded corner, squiggles, never words) for a fraction of the composites. n: x, y, s (width), rot,
  // sx (the paper turning over; < 0 shows its blank back), col, key.
  const NOTE_LINE = mixCol(NOTE_M, PAL.ink, .5);
  function paintNotes(list) {
    const body = (w, h, f) => [[-w / 2, -h / 2], [w / 2 - f, -h / 2], [w / 2, -h / 2 + f], [w / 2, h / 2], [-w / 2, h / 2]];
    const fold = (w, h, f) => [[w / 2 - f, -h / 2], [w / 2 - f, -h / 2 + f], [w / 2, -h / 2 + f]];
    const each = (pass, fn) => { for (const n of list) { boilSeed(`cnote ${n.key} ${pass}`); push(); translate(n.x, n.y); rotate(n.rot); scale(n.sx, 1); fn(n, n.s, n.s * 1.3, n.s * .2); pop(); } };
    each(0, (n, w, h, f) => { flat(body(w, h, f), n.col); flat(fold(w, h, f), dark(n.col, .12)); });
    each(1, (n, w, h, f) => { paint(body(w, h, f), { ink: PAL.ink, sw: .7 }); paint(fold(w, h, f), { ink: PAL.ink, sw: .5 }); });
    each(2, (n, w, h) => {
      if (n.sx < 0) return;   // the back of the slip is blank
      for (let i = 0; i < 2; i++) {
        const yy = -h * .28 + i * h * .2, len = w * (.55 + .25 * hash(n.key * 7 + i)), P = [];
        for (let k = 0; k <= 5; k++) P.push([-w * .34 + len * k / 5, yy + Math.sin(k * 2.1 + i + n.key) * w * .025 + jit(w * .006)]);
        inkLine(P, .5, NOTE_LINE, 'inkfine', .4);
      }
    });
  }

  // ---------- the shot ----------
  NOTES.C = (t, lt, dur) => {
    const cam = camAt(lt), act = actAt(lt);
    if (lt >= 5.05) { flat(rectPts(-60, -60, W + 120, H + 120), PAL.ink); return; }   // full black: shot D opens from it
    // while shot B's wipe still covers the house (its fastest stroke has not yet dragged past it), draw only the sky
    const wipeEdge = -300 + (W + 700) * ease(clamp(lt / .3)) + 220, underWipe = lt < .3 && 960 + (HX0 - 30 - cam.cx) * cam.z > wipeEdge;

    // --- the sky: flat indigo, far away (it moves at a quarter of the camera's speed)
    boilSeed('c sky');
    flat(rectPts(-100, -100, W + 200, H + 200), SKY);
    const sc = [960 + (cam.cx - 900) * .25, 540 + (cam.cy - 400) * .25, 1 + (cam.z - 1) * .25];
    camBegin(...sc); setView(...sc);
    flat(rectPts(-400, 620, 2800, 900), SKY_LO, 150);
    flat(rectPts(-400, 820, 2800, 700), SKY_LO, 200);
    const stars = [];
    for (let i = 0; i < 26; i++) {   // stars: fixed places, twinkling
      const x = -250 + 2400 * hash(i + 1), y = -120 + 760 * hash(i + 50), r = 2.5 + 4 * hash(i + 100), tw = .55 + .45 * Math.sin(t * (2 + 3 * hash(i + 7)) + i * 2.1);
      if (inView(x - 10, y - 10, x + 10, y + 10)) stars.push([x, y, r, tw, i]);
    }
    boilSeed('stars');
    for (const [x, y, r, tw] of stars) if (r > 4.6) glow(x, y, r * 7, '#FFE9B8', .3 + .3 * tw);
    for (const [x, y, r, tw, i] of stars) paint(starPts(x, y, r * (.75 + .35 * tw), .42, 4, .1 * i), { wash: STAR, ink: null });
    if (inView(1480, 70, 1640, 230)) {
      boilSeed('moon');
      glow(1560, 150, 300, '#F8E6B0', .42);
      paint(ellPts(1560, 150, 64, 64, 30), { wash: MOON, ink: PAL.ink, sw: .8 });
      paint(ellPts(1540, 130, 14, 11, 12), { wash: '#E6D6B0', ink: null }); paint(ellPts(1585, 172, 10, 8, 10), { wash: '#E6D6B0', ink: null });
    }
    // the far town: low rooftops along the horizon, flat
    boilSeed('far');
    const sky = []; for (let i = 0; i <= 26; i++) { const x = -400 + i * 110, h = 60 + 110 * hash(i + 200); sky.push([x, 930 - h], [x + 60 + 40 * hash(i + 300), 930 - h - (hash(i + 400) > .6 ? 35 : 0)]); }
    flat([[-400, 1500], ...sky, [2600, 1500]], FAR);
    camEnd();

    camBegin(cam.cx, cam.cy, cam.z); setView(cam.cx, cam.cy, cam.z);
    const X3 = HX0 + FL[3].off, apex = [X3 + HW / 2 + 14, -128], roof = [[X3 - 28, 46], apex, [X3 + HW + 28, 46]];
    // --- the street
    boilSeed('street');
    fl(rectPts(-1500, GY, 5000, 700), GROUND); fl(rectPts(-1500, GY, 5000, 34), PAVE);
    if (underWipe) { camEnd(); wipeBC(.5 + lt / .6, [NOTES.SLATE, NOTES.AG]); return; }
    ink([[80, GY + 34], [1700, GY + 35]], .8); ink([[80, GY + 1], [1700, GY]], 1);
    // --- the chimney and its smoke, the roof
    boilSeed('chimney');
    const chim = rectPts(915, -118, 50, 110), cap = rectPts(907, -128, 66, 14);
    fl(chim, CHIM); fl(cap, dark(CHIM, .2));
    for (let i = 0; i < 5; i++) {   // smoke: a puff rises, and the wind (the one the notes ride) bends it off to the right
      const ph = frac(lt * .32 + i / 5 + .13), r = 12 + 30 * ph;
      boilSeed('smoke' + i);
      fl(ellPts(942 + 30 * ph + 270 * ph * ph + 12 * Math.sin(ph * 6 + i), -140 - 95 * ph + 35 * ph * ph + 6 * Math.sin(ph * 5 + i * 2), r, r * .8, 14, 1.5), '#B3AFCB', 120 * Math.sin(Math.PI * Math.min(1, ph * 1.3)) * (1 - ph * .6));
    }
    boilSeed('roof');
    fl(roof, ROOF);
    fl(ellPts(apex[0], -26, 24, 24, 20), D_IN);   // the attic's round window, dark
    // the chimney's ink stops where it meets the roof slope (the roof covers its lower half)
    const slope = x => apex[1] + (x - apex[0]) * (roof[2][1] - apex[1]) / (roof[2][0] - apex[0]);
    ink([[915, slope(915) + 1], [915, -118], [965, -118], [965, slope(965) + 1]], 1); outline(cap, .9);
    ink([roof[0], apex, roof[2]], 1.4); ink([[X3 - 28, 46], [X3 + HW + 28, 46]], 1.1);
    outline(ellPts(apex[0], -26, 24, 24, 20), 1); ink([[apex[0] - 24, -26], [apex[0] + 24, -26]], .7);
    for (let r = 1; r <= 3; r++) {   // tile rows
      const y = apex[1] + (46 - apex[1]) * r / 4, half = (HW / 2 + 28) * r / 4;
      ink([[apex[0] - half + 12, y], [apex[0] + half - 12, y + 1]], .55, PAL.ink, 'inkfine');
    }

    // --- window insides: the room light, and its glow behind whatever stands in it
    const L = {}, VW = [];
    for (const w of WINS) {
      L[w.key] = winLight(w, lt);
      if (inView(w.x - 30, w.y - 30, w.x + w.w + 30, w.y + w.h + 30)) VW.push(w);
    }
    boilSeed('insides');
    for (const w of VW) {
      const l = L[w.key], inC = mixCol(mixCol(mixCol(T_IN, D_IN, 1 - l.teal), W_IN, l.warm), D_IN, l.off);
      flat(rectPts(w.x - 3, w.y - 3, w.w + 6, w.h + 6), inC);
      flat(rectPts(w.x, w.y, w.w, 22), dark(inC, .3), 150);
    }
    for (const w of VW) {
      const l = L[w.key];
      const fk = w.teal ? flicker(WINS.indexOf(w), t) * (w.key === '1,1' ? flare(lt) : 1) : 1;
      if (l.teal * l.on > .01) glow(w.cx, w.y + w.h * .55, 110, T_GL, l.teal * l.on * fk);
      if (l.warm * l.on > .01) {
        const b = w.teal && lt > w.teal.tf ? Math.exp(-(lt - w.teal.tf) * 5) : 0;
        glow(w.cx, w.y + w.h * .55, 105 * (1 + .6 * b), W_GL, l.warm * l.on * (.78 + .7 * b));
      }
    }
    // --- the resident, and its speed lines and sweep arcs (inside the glass)
    const sil = seg(lt, OFF['3,2'] - .01, OFF['3,2'] + OFF_RAMP);
    if (act.zip) {
      boilSeed('zip');
      const { sm, dir } = act.zip, [px, py] = act.pos;
      for (let j = 0; j < 4; j++) {
        const off = (j - 1.5) * 26 * RS, nx = -dir[1], ny = dir[0], cx = px + nx * off, cy = py - 60 * RS + ny * off, len = 150 * sm;
        ink([[cx - dir[0] * (40 + len), cy - dir[1] * (40 + len)], [cx - dir[0] * 40, cy - dir[1] * 40]], .9, '#FFE2A8', 'inkfine');
      }
    }
    if (act.sweep && act.sweep.f < .2) {   // the duster's swoosh: its tip's path over the last few frames
      boilSeed('arc');
      const f = act.sweep.f, sh = [act.pos[0] + ((act.dx || 0) + 28) * RS, act.pos[1] - 40 * RS];
      for (const [r, wgt] of [[88, 3.2], [70, 2]]) {
        const P = [];
        for (let j = 0; j <= 8; j++) { const ang = lerp(SW0, SW1, sweepK(lt - j * .016, act.sweep.tf)); P.push([sh[0] + Math.cos(ang) * r * RS, sh[1] - Math.sin(ang) * r * RS]); }
        if (Math.hypot(P[0][0] - P[8][0], P[0][1] - P[8][1]) > 20) ink(P, wgt * (1 - f / .2), SWOOSH, 'dry', .5);
      }
    }
    if (act.back && act.back.f < .2) {   // the backhand's swoosh, the other way
      boilSeed('arc back');
      const f = act.back.f, sh = [act.pos[0] + ((act.dx || 0) + 28) * RS, act.pos[1] - 40 * RS];
      for (const [r, wgt] of [[88, 2.2], [70, 1.3]]) {
        const P = [];
        for (let j = 0; j <= 8; j++) { const ang = lerp(BH0, BH1, backK(lt - j * .016)); P.push([sh[0] + Math.cos(ang) * r * RS, sh[1] - Math.sin(ang) * r * RS]); }
        if (Math.hypot(P[0][0] - P[8][0], P[0][1] - P[8][1]) > 20) ink(P, wgt * (1 - f / .2), SWOOSH, 'dry', .5);
      }
    }
    if (inView(act.pos[0] - 120, act.pos[1] - 190, act.pos[0] + 120, act.pos[1] + 40)) resident(act.pos[0], act.pos[1], RS, { ...act, sil, key: 'resident' });

    // --- the facade, laid flat around the window holes (so the resident only shows through the glass)
    boilSeed('facade');
    const floors = [];
    for (let f = 0; f < 4; f++) {
      const F = FL[f], X0 = HX0 + F.off, X1 = X0 + HW, row = WINS.filter(w => w.f === f), wy = row[0].y;
      if (!inView(X0, F.y0, X1, F.y1)) continue;
      floors.push([F, X0, X1]);
      fl(rectPts(X0, F.y0 - 1, HW, wy - F.y0 + 2), FAC);
      fl(rectPts(X0, wy + WH - 1, HW, F.y1 - wy - WH + 2), FAC);
      let xa = X0;
      for (const w of row) { fl(rectPts(xa - 1, wy - 1, w.x - xa + 2, WH + 2), FAC); xa = w.x + w.w; }
      fl(rectPts(xa - 1, wy - 1, X1 - xa + 2, WH + 2), FAC);
    }
    const ledges = [];
    for (let f = 1; f <= 4; f++) {   // the ledges between floors hide where one floor sits off the next
      const y = f < 4 ? FL[f].y1 : FL[3].y0, a = FL[f - 1].off, b = FL[Math.min(3, f)].off, x0 = HX0 + Math.min(a, b) - 12, x1 = HX0 + HW + Math.max(a, b) + 12;
      ledges.push([x0, x1, y]); fl(rectPts(x0, y - 8, x1 - x0, 15), LEDGE);
    }
    // the ground floor: plinth, the front door (shut), a step
    const dX = HX0 + 275, door = rrPts(dX, 792, 90, 190, 44), panel = rrPts(dX + 14, 812, 62, 70, 30), step = rectPts(dX - 16, 982, 122, 18);
    fl(rectPts(HX0, GY - 22, HW, 22), LEDGE); fl(door, DOOR); fl(panel, dark(DOOR, .15)); fl(step, '#4A4466'); fl(ellPts(dX + 74, 905, 5, 5, 8), NOTES.BRASS);
    // window fronts: curtains, sill things, frames, sills, lintels (colour first, for every window)
    for (const w of VW) {
      const l = L[w.key], fr = mixCol(FRAME, NIGHT, .35 * l.off);
      if (w.curtain) curtains(w, l.off, 0);
      sillItem(w.item, w.x, w.y + w.h, w.w, l.off, l.warm, w.key, 0);
      boilSeed('frame ' + w.key);
      flat(rectPts(w.x - 7, w.y - 7, w.w + 14, 7), fr); flat(rectPts(w.x - 7, w.y + w.h, w.w + 14, 7), fr);
      flat(rectPts(w.x - 7, w.y, 7, w.h), fr); flat(rectPts(w.x + w.w, w.y, 7, w.h), fr);
      flat(rectPts(w.x, w.y + w.h * .17 - 3, w.w, 6), fr);
      flat(rectPts(w.x - 14, w.y + w.h + 7, w.w + 28, 10), LEDGE);
      flat(rectPts(w.x - 9, w.y - 19, w.w + 18, 12), FAC_DK);
    }
    // --- then the ink, all in one colour: the house's edges, ledges, door, frames, sills, things on the sills
    boilSeed('house ink');
    for (const [F, X0, X1] of floors) { ink([[X0, F.y0], [X0 - 1, F.y1]], 1.2); ink([[X1, F.y0], [X1 + 1, F.y1]], 1.2); }
    for (const [x0, x1, y] of ledges) { ink([[x0, y - 8], [x1, y - 8]], .9); ink([[x0, y + 7], [x1, y + 7]], 1); }
    ink([[HX0, GY - 22], [HX0 + HW, GY - 22]], .8);
    outline(door, 1.1); outline(step, .8); ink([[dX + 45, 890], [dX + 45, 975]], .6, PAL.ink, 'inkfine');
    for (const w of VW) {
      boilSeed('frame ink ' + w.key);
      outline(rectPts(w.x - 7, w.y - 7, w.w + 14, w.h + 14), 1);
      ink([[w.x, w.y], [w.x + w.w, w.y + 1], [w.x + w.w, w.y + w.h], [w.x, w.y + w.h], [w.x, w.y]], .6, PAL.ink, 'inkfine');
      ink([[w.x, w.y + w.h * .17 + 3], [w.x + w.w, w.y + w.h * .17 + 3]], .6, PAL.ink, 'inkfine');
      outline(rectPts(w.x - 14, w.y + w.h + 7, w.w + 28, 10), .8);
      if (w.curtain) curtains(w, 0, 1);
      sillItem(w.item, w.x, w.y + w.h, w.w, 0, 0, w.key, 1);
    }
    // dry-brush rims: down the sides of each floor, and the shadow under each ledge
    boilSeed('rims');
    for (const [F, X0, X1] of floors) { ink([[X0 + 10, F.y0 + 12], [X0 + 9, F.y1 - 10]], 1.4, FAC_DK, 'dry'); ink([[X1 - 10, F.y0 + 12], [X1 - 9, F.y1 - 10]], 1.4, FAC_DK, 'dry'); }
    for (const [x0, x1, y] of ledges) if (y < GY - 30) ink([[x0 + 20, y + 13], [x1 - 20, y + 14]], 1.2, FAC_DK, 'dry');
    // the light spilling onto the wall
    boilSeed('spill');
    for (const w of VW) {
      const l = L[w.key];
      if (l.teal * l.on > .01) glow(w.cx, w.cy, 160, T_GL, .45 * l.teal * l.on * flicker(WINS.indexOf(w) + 3, t) * (w.key === '1,1' ? flare(lt) : 1));
      if (l.warm * l.on > .01) {
        const b = w.teal && lt > w.teal.tf ? Math.exp(-(lt - w.teal.tf) * 4) : 0;
        glow(w.cx, w.cy, 155 * (1 + .7 * b), W_GL, l.warm * l.on * (.4 + .3 * b));
      }
    }
    // --- the backhand's gust: off the duster, across the pier (in front of the wall), into 3,1, and a puff where it lands
    if (lt > GUST[0] && lt < GUST[1] + .2) {
      boilSeed('gust');
      const P0 = [872, 214], P1 = [812, 128], P2 = [742, 166];
      const qb = u => [(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]];
      const head = easeOut(seg(lt, GUST[0], GUST[1])), tail = ease(seg(lt, GUST[0] + .05, GUST[1] + .16)), fade = 1 - seg(lt, GUST[1] + .06, GUST[1] + .2);
      if (head - tail > .06) for (const [off, wgt, br] of [[0, .8, 'dry'], [-13, 1.1, 'inkfine'], [12, .9, 'inkfine']]) {   // a brushy gust and two speed lines
        const P = [];
        for (let j = 0; j <= 10; j++) {
          const u = lerp(tail, head, j / 10), p = qb(u), q = qb(u + .01), n = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, b = off * Math.sin(Math.PI * u);
          P.push([p[0] - (q[1] - p[1]) / n * b, p[1] + (q[0] - p[0]) / n * b]);
        }
        ink(P, wgt * fade, SWOOSH, br, .5);
      }
      if (lt > GUST[1] - .01) {
        const a = seg(lt, GUST[1] - .01, GUST[1] + .18);
        for (let i = 0; i < 7; i++) {
          const ang = i / 7 * TAU + .4, r = 14 + 46 * easeOut(a), rr = 1.5 + 4 * (1 - a);
          fl(ellPts(P2[0] + Math.cos(ang) * r, P2[1] + Math.sin(ang) * r * .8, rr, rr, 6), SWOOSH, 230 * (1 - a));
        }
      }
    }
    // --- the notes: stuck to the glass, then flying off right into the night
    const NP = NOTESC.map(n => ({ n, p: notePos(n, lt) })).filter(({ p }) => inView(p.x - 24 * p.sc, p.y - 24 * p.sc, p.x + 24 * p.sc, p.y + 24 * p.sc));
    boilSeed('note glows');
    for (const { p } of NP) if (p.fly > 0) glow(p.x, p.y, 48 * p.sc, T_GL, .5 * (1 - seg(p.fly, 1.2, 2.2)));
    paintNotes(NP.map(({ n, p }) => ({ x: p.x, y: p.y, s: 31 * p.sc, rot: p.rot, sx: (p.sx < 0 ? -1 : 1) * Math.max(.14, Math.abs(p.sx)), col: p.sx < 0 ? '#C8E9DE' : NOTE_M, key: n.i + 3 })));
    // the resident's '!' / sweat, over everything in the house
    if (act.emote && (act.emoteK ?? 1) > .02) {
      boilSeed('res emote');
      const hx = act.pos[0] + (act.dx || 0) * RS, hy = act.pos[1] + (act.dy || 0) * RS - 92 * RS;
      if (act.emote === '!') emote('!', hx + 36, hy - 34, 11, act.emoteK, act.emoteAge);
      else emote(act.emote, hx + 30, hy - 18, 7, act.emoteK, act.emoteAge);
    }
    camEnd();

    // --- out: the last lights go, then black
    boilSeed('c out');
    const blk = easeIn(seg(lt, 4.9, 5.05));
    if (blk > 0) flat(rectPts(-60, -60, W + 120, H + 120), PAL.ink, 255 * blk);
    // --- in: shot B's brush wipe drags off
    if (lt < .3) wipeBC(.5 + lt / .6, [NOTES.SLATE, NOTES.AG]);
  };

  // ---------- model sheet for the resident (not part of the video): node render.mjs --loop=resident ----------
  LOOPS.resident = t => {
    flat(rectPts(-40, -40, W + 80, H + 80), W_IN);
    const poses = [
      { eyes: 'dot', mouth: 'smile', face: -.4, lookX: -.5, lookY: .7, aR: 2.9, aL: -1.05, capA: .9 },
      { eyes: 'wide', mouth: 'O', browUp: 1, brow: -.2, face: .8, lookX: 1, aL: .95, aR: 1.25, capA: -1.6, sq: -.15 },
      { eyes: 'wide', mouth: 'o', browUp: .55, brow: -.75, face: 1, lookX: 1, rot: .2, aL: -.35, aR: .35, capA: -1.2 },
      { eyes: 'dot', mouth: 'flat', brow: .95, face: .6, lookX: 1, rot: -.12, sq: .16, aL: -1.2, aR: -1.25, capA: -1.1 },
      { eyes: 'dot', mouth: 'flat', brow: .9, face: .55, lookX: .45, rot: -.14, aR: 2.55, aL: -.5, capA: -1.3 },
      { eyes: 'dot', mouth: 'smile', brow: 0, face: .55, lookX: .45, rot: .05, aR: 1.05, aL: .1, capA: -.4 },
      { eyes: 'closed', mouth: 'smile', brow: -.3, browUp: .1, face: .25, sq: .1, aL: -1.25, aR: -1.3, capA: -1.4 },
      { eyes: 'dot', mouth: 'wobble', brow: -1, browUp: .5, face: .55, lookX: .6, lookY: -.8, rot: .05, aL: -1.75, aR: -Math.PI, dusterA: -3.49, dusterOff: -12, puff: .2, capA: -1.2 },
      { eyes: 'dot', mouth: 'flat', brow: .9, face: .6, aL: -1.3, aR: -1.4, capA: -1.9, smear: { dir: [.63, -.78], e: .8 } },
    ];
    poses.forEach((p, i) => resident(130 + i * 205, 560, 1.5, { ...p, key: 'sheet' + i }));
    [1, 2, 7, 6].forEach((j, i) => resident(300 + i * 420, 1000, 2.6, { ...poses[j], key: 'big' + i }));
  };
  LOOPS.resident.len = 2;
})();
