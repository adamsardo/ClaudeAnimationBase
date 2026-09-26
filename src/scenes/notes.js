// notes.js: "The Notes They Left Behind", 30 s. See STORYBOARD.md for the shot list and the reads.
//   A (0–5):       an old wiki as a clothesline of pages; a dark stain deletes them in order; an agent pins its note last.
//   B (5–10.5):    an exam hall of booths; a note through the shared pipe finds another agent; the lights spread.
//   C (10.5–15.7): notes_c.js. Someone else's house, lit teal by the swarm's notes, puts itself back in order.
//   D (15.7–21.8): notes_d.js. Later, Clawd reads the drifts of notes, and finds itself in its own records.
//   E (21.8–30):   notes_e.js. Clawd follows a trail of notes back to the clothesline and takes down the first note.
// This file holds the shared pieces (palette, the agents, notes and props, the attic) and exports them as NOTES for
// the other scene files, and registers every shot's start time.
(() => {
  // ---------- palette ----------
  const NOTE = '#FFF5E2', OLD = '#E6D8B8', AG = '#74A7A1', MINT = '#A4F5D8', BULB = '#6D7682', BRASS = '#E0B04A';
  const dark = (c, k = .3) => mixCol(c, PAL.ink, k), light = (c, k = .3) => mixCol(c, PAL.cream, k);

  // ---------- painting helpers ----------
  // Speed: this machine has no GPU, and p5.brush's cost grows with a shape's area on screen (a full-frame wash is over a
  // second), so big flat areas (walls, floors, skies, panels) are laid in as plain flat colour and then painted over
  // with a dry-brush wet edge or an ink outline, which is what makes them read as paint. Everything else is brush.
  function flat(pts, col, a = 255) {
    flushBrush(); const c = color(col); c.setAlpha(a); noStroke(); fill(c);
    beginShape(); for (const [x, y] of pts) vertex(x, y); endShape(CLOSE);
  }
  // A cheap watercolour shape: flat colour, a dry-brush wet edge where the pigment pools, and an optional ink outline.
  function wet(pts, col, o = {}) {
    flat(pts, col, o.op ?? 255);
    if (o.rim !== 0) inkLine(pts.concat([pts[0]]), o.rim ?? 1, dark(col, o.rimK ?? .28), 'dry', o.curv ?? .2);
    if (o.ink) paint(pts, { ink: PAL.ink, sw: o.ink, curv: o.curv });
  }
  const bbox = pts => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return [x0, y0, x1, y1]; };
  const rot2 = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];

  // ---------- the agents ----------
  // Small slate-teal gumdrops: dot eyes, nub arms, two stubby legs and an antenna bulb that lights mint when they're
  // connected. (x, y) is the ground point between the feet; u is the unit (the body is ~6.2u wide, 7.2u tall, the
  // antenna reaches 9.9u). Takes the same pose and face fields as clawd(), so feel() and emotions() drive it.
  //   face -1..1: turns the face toward a side (a drawn 3/4). light 0..1: the antenna bulb. lod 'far': a cheap version.
  //   holdL / holdR (u, sw): hooks at the arm tips, in arm space. walk: leg phase.
  const BODY = [[-3, -1.3], [-3.15, -3.4], [-2.75, -5.6], [-1.6, -6.9], [0, -7.25], [1.6, -6.9], [2.75, -5.6], [3.15, -3.4], [3, -1.3], [2.1, -.95], [0, -.85], [-2.1, -.95]];
  const BELLY = [[-3.08, -2.5], [3.08, -2.5], [3, -1.3], [2.1, -.95], [0, -.85], [-2.1, -.95], [-3, -1.3]];
  let AGN = 0;
  function agent(x, y, u, o = {}) {
    const id = o.boilKey ?? ('n' + ++AGN), rs = p => boilSeed(`agent ${id} ${p}`);
    const sq = o.sq || 0, dy = (o.dy || 0) * u, face = clamp(o.face ?? 0, -1, 1), fx = face * 1.05 * u, far = o.lod === 'far';
    const col = o.body || AG, dk = dark(col, .3), lt = light(col, .45);   // (not o.col: emotions() sets Clawd's colours)
    const sw = clamp(u / 16, .3, 2) * (o.swMul || 1), P = pts => pts.map(([a, b]) => [a * u, b * u]);
    x += (o.dx || 0) * u;
    rs('shadow');
    if (!o.noShadow) paint(ellPts(x, y + u * .1, u * 3.3 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .07)), u * .55, 14), { wash: PAL.ink, washOp: o.shadowOp ?? 60, ink: null });
    push(); translate(x, y + dy); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
    // legs
    for (const s of [-1, 1]) {
      rs('leg' + s);
      let h = 1.35, lx = 0;
      if (o.walk != null) { const ph = (o.walk + (s > 0 ? .5 : 0)) * TAU; lx = Math.sin(ph) * .35; h = 1.35 - Math.max(0, Math.cos(ph)) * .55; }
      if (far) flat(rectPts((s * 1.2 - .42 + lx) * u, -1.45 * u, .84 * u, (h + .1) * u), dk);
      else paint(rrPts((s * 1.2 - .42 + lx) * u, -1.45 * u, .84 * u, (h + .1) * u, .3 * u), { wash: dk, ink: PAL.ink, sw: sw * .7 });
    }
    // body
    rs('body');
    if (far) flat(P(through(BODY.concat([BODY[0]]), 3)), col); else paint(P(BODY), { wash: col, ink: null, curv: .5 });
    if (!far) {
      paint(P(BELLY), { wash: dk, washOp: 110, ink: null, curv: .3 });
      paint(ellPts((-.9 + face * .6) * u, -5.5 * u, 1.35 * u, .8 * u, 12, u * .05, -.3), { wash: lt, washOp: 140, ink: null });
    }
    if (!far) paint(P(BODY), { ink: PAL.ink, sw, curv: .5 });
    // antenna and bulb
    rs('antenna');
    const sway = (o.sway || 0) + .15 * Math.sin(T * 3 + (o.seed || 0)), tip = [(face * 1.1 + sway) * u, -9.35 * u];
    if (far) flat([[face * .9 * u - .15 * u, -7 * u], [face * .9 * u + .15 * u, -7 * u], [tip[0] + .12 * u, tip[1]], [tip[0] - .12 * u, tip[1]]], PAL.ink);
    else inkLine([[face * .9 * u, -7.15 * u], [(face * 1.0 + sway * .4) * u, -8.3 * u], tip], sw * .9, PAL.ink, 'ink', .5);
    const L = clamp(o.light || 0);
    if (L > .02) glow(tip[0], tip[1], u * (2.2 + 1.6 * L) * (o.glowMul || 1), MINT, L);
    if (far) flat(ellPts(tip[0], tip[1], .62 * u, .62 * u, 10), mixCol(BULB, MINT, L));
    else paint(ellPts(tip[0], tip[1], .62 * u, .62 * u, 12), { wash: mixCol(BULB, MINT, L), ink: PAL.ink, sw: sw * .6 });
    // face
    rs('face');
    if (o.blush > .1 && !far) for (const s of [-1, 1]) paint(ellPts(fx + s * 1.9 * u, -3.9 * u, .55 * u, .3 * u, 10), { wash: PAL.rose, washOp: 150 * clamp(o.blush), ink: null });
    for (const s of [-1, 1]) {
      push(); translate(fx + s * 1.15 * u, -4.6 * u); scale(1 - Math.max(0, -s * face) * .25, 1);
      agEye(far ? 'far' : o.eyes, s, u, o, sw); pop();
    }
    if (!far && o.mouth) { push(); translate(fx, -3.2 * u); agMouth(o.mouth, u, sw); pop(); }
    // arms, in front of the body
    for (const s of [-1, 1]) {
      rs('arm' + s);
      const a = s < 0 ? (o.aL ?? -.5) : (o.aR ?? -.5), hook = s < 0 ? o.holdL : o.holdR;
      push(); translate((s * 2.75 + face * .3) * u, -3.3 * u); rotate(s < 0 ? a : -a);
      if (far) flat(rectPts(s < 0 ? -1.65 * u : -.05 * u, -.38 * u, 1.7 * u, .76 * u), dark(col, .1));
      else paint(rrPts(s < 0 ? -1.65 * u : -.05 * u, -.38 * u, 1.7 * u, .76 * u, .36 * u), { wash: col, ink: PAL.ink, sw: sw * .75 });
      if (hook) { translate(s * 1.55 * u, 0); if (s < 0) scale(-1, 1); hook(u, sw); }
      pop();
    }
    if (o.draw) o.draw(u, sw);
    pop();
    rs('emote');
    if (o.emote && (o.emoteK ?? 1) > .02) {
      const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
      emote(o.emote, x + (top ? dir * face * u : dir * 3.9 * u), y + dy + (top ? -13 : -8.2) * u * (1 - sq), u * .75, o.emoteK ?? 1, o.emoteAge ?? T);
    }
    rs('after');
  }
  function agEye(e, s, u, o, sw) {
    const lx = (o.lookX || 0) * .28 * u, ly = (o.lookY || 0) * .22 * u, sqz = clamp(o.squint || 0);
    const line = (pts, w = 1.1, c = .4) => inkLine(pts.map(([a, b]) => [a * u, b * u]), sw * w, PAL.ink, 'ink', c);
    if (e === 'far') { flat(ellPts(lx, ly, .5 * u, .66 * u, 8), PAL.ink); return; }
    const dot = (rx, ry, hi = true) => {
      paint(ellPts(lx, ly, rx * u, ry * u * (1 - sqz), 12), { wash: PAL.ink, ink: null });
      if (hi && u > 8 && sqz < .5) paint(ellPts(lx - rx * .35 * u, ly - ry * .4 * u, rx * .34 * u, rx * .38 * u, 8), { wash: PAL.cream, ink: null });
    };
    if (sqz > .8) { line([[-.5, 0], [.5, 0]], 1, 0); return; }
    const blink = ['normal', 'look', 'wide', 'dot', undefined].includes(e) && ((T * .9 + (o.seed || 0) * 1.7) % 3.1) < .1;
    if (blink) { line([[-.5, .1], [.5, .1]], 1, 0); return; }
    switch (e) {
      case 'wide': case 'scared': case 'shine': case 'spark': case 'blank': dot(.66, .85); break;
      case 'happy': case 'closed': line([[-.55, .25], [0, -.3], [.55, .25]]); break;
      case 'sleepy': case 'narrow': case 'bored':
        paint([[-.5 * u + lx, -.05 * u], [.5 * u + lx, -.05 * u], [.42 * u + lx, .4 * u], [-.42 * u + lx, .4 * u]], { wash: PAL.ink, ink: null, curv: .4 });
        line([[-.62, -.1], [.62, -.1]], 1, 0); break;
      case 'determined': case 'angry':
        dot(.5, .62, false); line([[-.7 * -s, -.95 + (e === 'angry' ? -.15 : 0)], [.7 * -s, -.55]], 1.2, 0); break;
      case 'sad': case 'teary': case 'cry':
        dot(.48, .6); line([[-.65 * -s, -.6], [.65 * -s, -1.05]], 1.1, 0); break;
      case 'squeeze': line([[-.45 * -s, -.45], [.45 * -s, 0], [-.45 * -s, .45]], 1.2, 0); break;
      case 'heart': paint(heartPts(0, .05 * u, .55 * u), { wash: '#E2476E', ink: PAL.ink, sw: sw * .4 }); break;
      default: dot(.5, .66);
    }
  }
  function agMouth(m, u, sw) {
    const line = (pts, w = .8, c = .5) => inkLine(pts.map(([a, b]) => [a * u, b * u]), sw * w, PAL.ink, 'ink', c);
    switch (m) {
      case 'smile': case 'cat': case 'tongue': case 'smirk': line([[-.5, -.1], [0, .22], [.5, -.1]]); break;
      case 'grin': case 'laugh': case 'open':
        paint([[-.6 * u, -.15 * u], [.6 * u, -.15 * u], [.3 * u, .4 * u], [-.3 * u, .4 * u]], { wash: '#4A1F2A', ink: PAL.ink, sw: sw * .5, curv: .5 }); break;
      case 'o': paint(ellPts(0, .05 * u, .22 * u, .26 * u, 10), { wash: PAL.ink, ink: null }); break;
      case 'O': case 'yawn': case 'wail': paint(ellPts(0, .1 * u, .38 * u, .46 * u, 12), { wash: '#4A1F2A', ink: PAL.ink, sw: sw * .5 }); break;
      case 'frown': case 'pout': line([[-.45, .2], [0, -.08], [.45, .2]]); break;
      case 'wobble': line([[-.55, .05], [-.27, -.1], [0, .05], [.27, -.1], [.55, .05]], .65, .3); break;
      case 'flat': line([[-.35, 0], [.35, 0]], .8, 0); break;
    }
  }

  // ---------- props ----------
  // A note: a cream slip with squiggle lines (never words) and a folded corner. s = width in px; (x, y) its centre.
  //   lines: how many squiggles. doodle: 'agent' (a little agent drawn on it), 'clawd' (a little Clawd, in clay) or
  //   'prints' (rows of Clawd's blocky footprints). cheap: flat paper only (far away).
  function note(x, y, s, o = {}) {
    const w = s, h = s * 1.3, f = s * .2, sw = o.sw ?? clamp(s / 110, .3, 1.1), key = o.key ?? 0;
    push(); translate(x, y); rotate(o.rot || 0); if (o.sx != null || o.sy != null) scale(o.sx ?? 1, o.sy ?? 1);
    if (o.glow) glow(0, 0, s * 1.3, '#FFE3A0', o.glow);
    if (o.cheap || s > 500) {   // far away, or huge (the transition): flat paper, few strokes
      const pts = [[-w / 2, -h / 2], [w / 2 - f, -h / 2], [w / 2, -h / 2 + f], [w / 2, h / 2], [-w / 2, h / 2]];
      flat(pts, o.col || NOTE);
      if (s > 500) { flat([[w / 2 - f, -h / 2], [w / 2 - f, -h / 2 + f], [w / 2, -h / 2 + f]], dark(o.col || NOTE, .12)); o = { ...o, bare: true, ink: null }; }
      else { pop(); return; }
    }
    paint([[-w / 2, -h / 2], [w / 2 - f, -h / 2], [w / 2, -h / 2 + f], [w / 2, h / 2], [-w / 2, h / 2]], { wash: o.col || NOTE, ink: o.ink === null ? null : PAL.ink, sw });
    if (!o.bare) paint([[w / 2 - f, -h / 2], [w / 2 - f, -h / 2 + f], [w / 2, -h / 2 + f]], { wash: dark(o.col || NOTE, .12), ink: o.ink === null ? null : PAL.ink, sw: sw * .7 });
    const lc = mixCol(o.col || NOTE, PAL.ink, o.fade ?? .55);
    if (o.doodle === 'agent') {
      const d = s * .085, P = pts => pts.map(([a, b]) => [a * d, b * d + h * .05]);
      inkLine(P([[-3, 2.6], [-3.1, 0], [-2.3, -2.6], [0, -3.6], [2.3, -2.6], [3.1, 0], [3, 2.6], [-3, 2.6]]), sw * 1.1, lc, 'ink', .5);
      inkLine(P([[0, -3.6], [.4, -5.2]]), sw * .9, lc, 'ink', 0);
      paint(ellPts(.4 * d, -5.6 * d + h * .05, .6 * d, .6 * d, 8), { wash: lc, ink: null });
      for (const e of [-1.1, 1.1]) paint(ellPts(e * d, -.4 * d + h * .05, .45 * d, .6 * d, 8), { wash: lc, ink: null });
      inkLine([[-w * .32, -h * .36], [w * .12, -h * .36]], sw * .7, lc, 'inkfine', .3);
    } else if (o.doodle === 'clawd') {   // a little Clawd: clay block, two slit eyes, four legs, arm nubs
      const d = s * .07, cy = h * .05, P = pts => pts.map(([a, b]) => [a * d, b * d + cy]), clay = dark(PAL.clay, .05);
      paint(P([[-5, -4], [5, -4], [5, 2], [-5, 2]]), { wash: clay, ink: lc, sw: sw * .9 });
      for (const lx of [-4, -2, 1, 3]) paint(P([[lx, 2], [lx + 1, 2], [lx + 1, 3.6], [lx, 3.6]]), { wash: dark(PAL.clay, .25), ink: null });
      for (const s2 of [-1, 1]) paint(P([[s2 * 5, -1.4], [s2 * 6.6, -1.8], [s2 * 6.6, -.6], [s2 * 5, -.4]]), { wash: clay, ink: null });
      for (const ex of [-2.5, 2.5]) paint(P([[ex - .5, -3], [ex + .5, -3], [ex + .5, -1], [ex - .5, -1]]), { wash: PAL.ink, ink: null });
      inkLine([[-w * .32, -h * .38], [w * .12, -h * .38]], sw * .7, lc, 'inkfine', .3);
    } else if (o.doodle === 'prints') {   // rows of four little clay blocks: Clawd's feet
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
        const px = (-.2 + c * .38 - .1 + (r % 2) * .12) * w, py = (-.3 + r * .3) * h;
        for (let k = 0; k < 4; k++) paint(rectPts(px + (k - 1.5) * s * .075 - s * .025, py - s * .04, s * .05, s * .08), { wash: dark(PAL.clay, .15), ink: null });
      }
    } else {
      const n = o.lines ?? 3;
      for (let i = 0; i < n; i++) {
        const yy = -h * .28 + i * h * .2, len = w * (.55 + .25 * hash(key * 7 + i)), P = [];
        for (let k = 0; k <= 5; k++) P.push([-w * .34 + len * k / 5, yy + Math.sin(k * 2.1 + i + key) * s * .025 + jit(s * .006)]);
        inkLine(P, sw * .75, lc, 'inkfine', .4);
      }
    }
    pop();
  }
  // A clothes-peg: two little wooden jaws.
  function peg(x, y, s, rot = 0) {
    push(); translate(x, y); rotate(rot);
    paint(rrPts(-s * .22, -s * .55, s * .44, s * 1.1, s * .15), { wash: '#C99A6A', ink: PAL.ink, sw: clamp(s / 30, .3, .8) });
    inkLine([[0, -s * .5], [0, s * .5]], clamp(s / 40, .25, .6), dark('#C99A6A', .4), 'inkfine', 0);
    pop();
  }
  // A magnifying glass, drawn from its handle end at (0, 0) outward along +x (for an arm hook).
  function magnifier(u, sw, k = 1) {
    paint(rrPts(-.1 * u, -.22 * u, 1.5 * u, .44 * u, .2 * u), { wash: '#6B4A3A', ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(2.8 * u, 0, 1.4 * u, 1.4 * u, 20), { wash: '#D6ECF0', washOp: 150, ink: PAL.ink, sw: sw * 1.3 });
    inkLine([[2.2 * u, -.45 * u], [2.55 * u, -.95 * u]], sw * .6, PAL.cream, 'inkfine', 0);
  }
  // A big note in SCREEN space, for the push-into-the-note transition (A → B). s = width in px.
  function bigNote(cx, cy, s, rot = 0) {
    boilSeed('bignote');
    note(cx, cy, s, { rot, key: 9, doodle: 'agent', sw: clamp(s / 110, .3, 3) });
  }

  // ---------- the old wiki: the attic wall and its clothesline (shots A and E) ----------
  const LX0 = -120, LY0 = 330, LX1 = 1720, LY1 = 700, SAG = 60;
  const lineY = x => { const k = (x - LX0) / (LX1 - LX0); return lerp(LY0, LY1, k) + SAG * 4 * k * (1 - k); };
  const PAGES = [60, 250, 440, 630, 820, 1010, 1200, 1390];   // x of each page's peg; the agent's note goes at LAST
  const LAST = 1610, FLOOR = 935, NS = 72;                     // NS: the agent's note, width in px
  // wall: k = 0 at dusk (A), 1 at dawn (E). x0/x1 = the stretch of wall to paint.
  function attic(t, k, x0 = -300, x1 = W + 300) {
    const wall = mixCol('#8E7C93', '#C7A39B', k), shade = mixCol('#6E5C78', '#A67F86', k);
    boilSeed('wall');
    wet(rectPts(x0, -300, x1 - x0, FLOOR + 300), wall, { rim: 0 });
    for (let i = Math.floor(x0 / 420); i < x1 / 420; i++) {   // big soft stains in the plaster, stable per panel
      boilSeed('plaster' + i);
      flat(ellPts(i * 420 + 200 * hash(i), 150 + 500 * hash(i + 9), 180 + 90 * hash(i + 3), 120 + 60 * hash(i + 5), 16, 6, hash(i) * 3), shade, 45);
    }
    // the window, upper right: dusk violet-orange, or dawn rose-gold
    boilSeed('window');
    const wx = 1480, wy = 170, ww = 240, wh = 220;
    wet(rectPts(wx - 18, wy - 18, ww + 36, wh + 36, 2), mixCol('#5C4450', '#8A6456', k), { ink: 1 });
    flat(rectPts(wx, wy, ww, wh * .55, 2), mixCol('#6A5C9C', '#F4B39A', k));
    flat(rectPts(wx, wy + wh * .5, ww, wh * .5, 2), mixCol('#D98A6A', '#FFD9A0', k));
    glow(wx + ww / 2, wy + wh * .7, 150 + 120 * k, mixCol('#FF9F6A', '#FFD08A', k), .35 + .5 * k);
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 1.2, PAL.ink, 'ink', 0);
    inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 1.2, PAL.ink, 'ink', 0);
    paint(rectPts(wx, wy, ww, wh), { ink: PAL.ink, sw: 1 });
    // floor and skirting
    boilSeed('floor');
    wet(rectPts(x0, FLOOR, x1 - x0, 400), mixCol('#5E4A5C', '#8C6660', k), { rim: 0 });
    flat(rectPts(x0, FLOOR - 26, x1 - x0, 30), mixCol('#4B3A4E', '#6E4F55', k));
    inkLine([[x0, FLOOR - 26], [x1, FLOOR - 27]], 1, PAL.ink, 'ink', 0);
    inkLine([[x0, FLOOR + 4], [x1, FLOOR + 3]], .8, PAL.ink, 'ink', 0);
    for (let i = Math.floor(x0 / 300); i < x1 / 300; i++) inkLine([[i * 300 + 90 * hash(i), FLOOR + 30], [i * 300 + 90 * hash(i) + 140, FLOOR + 32]], .5, mixCol('#5E4A5C', PAL.ink, .3), 'inkfine', 0);
  }
  function clothesline(lift = 0) {   // lift: the last stretch springs up when its weight comes off (E)
    boilSeed('line');
    const P = []; for (let x = LX0; x <= LX1; x += 80) P.push([x, lineY(x) - (x > LAST - 300 ? lift * Math.sin(Math.PI * clamp((x - (LAST - 300)) / 435)) : 0)]);
    P.push([LX1, LY1]);
    inkLine(P, .9, mixCol(PAL.ink, '#8C6A5A', .3), 'ink', .5);
    paint(ellPts(LX1, LY1, 7, 7, 8), { wash: '#8A8A96', ink: PAL.ink, sw: .6 });   // the nail
  }
  // dust motes drifting in the window light
  function motes(t, k, x0, x1) {
    boilSeed('motes');
    for (let i = 0; i < 18; i++) {
      const x = x0 + (x1 - x0) * hash(i + 40) + 30 * Math.sin(t * .4 + i), y = 120 + 700 * frac(hash(i + 60) - t * .02 * (1 + hash(i)));
      paint(ellPts(x, y, 2.2, 2.2, 6), { wash: mixCol(PAL.cream, '#FFD9A0', k), washOp: 150 + 80 * Math.sin(t * 2 + i), ink: null });
    }
  }

  // ---------- shot A: the last page ----------
  // The stain reaches each page at tEat (the first two went before the shot starts). The agent: holds its note →
  // notices (take) → nervous → runs right → hops and pins its note at LAST → lands, backs off to the right, scared.
  const tEat = [-1, -.4, 1.0, 1.8, 2.6, 3.3, 4.05, 4.75];
  const tRun = 2.5, tStop = 3.05, tHop0 = 3.3, tHop1 = 3.8, tPin = 3.55, tBack = 4.0, tPush = 4.4;
  const HOLD_A = 1.5;   // arm angle while the note is held up
  // the stain's leading edge, in x: it creeps, and surges to each page as it eats it
  function stainX(t) {
    let x = -300;
    for (let i = 0; i < PAGES.length; i++) {
      if (t < tEat[i] - .4) break;
      x = lerp(i ? PAGES[i - 1] + 70 : -300, PAGES[i] + 70, easeOut(seg(t, tEat[i] - .4, tEat[i] + .05)));
    }
    return x + 18 * Math.sin(t * 2.3);
  }
  function stain(t, x) {
    boilSeed('stain');
    const P = [[-600, -300]], n = 34;
    for (let i = 0; i <= n; i++) {   // a ragged edge, as if the ink were soaking along the fibres
      const y = -300 + (FLOOR + 360) * i / n, sp = hash(i * 3.1) > .7 ? 60 * hash(i * 5.3) : 0;
      P.push([x - 40 + 45 * hash(i * 1.7) + sp + 14 * Math.sin(t * 1.9 + i * .7) + jit(4), y]);
    }
    P.push([-600, FLOOR + 60]);
    wet(P, '#2B2240', { rim: 3, rimK: .45 });
    for (let i = 0; i < 7; i++) {   // spatter just ahead of the edge
      const y = 120 + 110 * i + 60 * hash(i + 11), d = 30 + 60 * hash(i + 4) + 8 * Math.sin(t * 3 + i), r = 5 + 9 * hash(i + 9);
      paint(ellPts(x + d, y, r, r * .8, 10, 1.5), { wash: '#2B2240', ink: null });
    }
  }
  // an old page hanging from the line at peg x px; age = time since the stain reached it (< 0: not yet)
  function oldPage(i, x, t, age) {
    boilSeed('page' + i);
    const y = lineY(x), s = 118, h = s * 1.3, sway = .04 * Math.sin(t * 1.3 + i * 1.7) + (hash(i + 5) - .5) * .12;
    if (age < 0) {
      note(x, y + h / 2 + 6, s, { rot: sway, col: OLD, fade: .45, key: i, lines: 3 });
      peg(x, y, 28, sway);
      return;
    }
    if (age < .18) {   // it darkens and shrivels, then bursts
      const k = age / .18;
      note(x, y + h / 2 + 6, s * (1 - .15 * k), { rot: sway + .2 * k, col: mixCol(OLD, '#3A2E48', k), fade: .45, key: i, sx: 1 - .1 * k });
    }
    if (age < 1.4) for (let f = 0; f < 9; f++) {   // flakes: fall, tumble and fade
      const a = Math.max(0, age - .15), cx = x + ((f % 3) - 1) * s * .3, cy = y + 30 + Math.floor(f / 3) * h * .3;
      const fx = cx + (hash(f + i * 9) - .5) * 120 * a + 25 * Math.sin(a * 5 + f), fy = cy + 160 * a * a + 60 * a, r = s * .13 * (1 - a * .6);
      if (a <= 0 || r < 2) continue;
      const q = rectPts(-r, -r * .8, 2 * r, 1.6 * r, r * .3).map(p => { const [px, py] = rot2(p, a * 4 + f); return [fx + px, fy + py]; });
      paint(q, { wash: mixCol(OLD, '#3A2E48', .5 + .5 * seg(a, 0, 1)), washOp: 255 * (1 - seg(a, .7, 1.25)), ink: null });
    }
    peg(x, y, 28, sway * .5);   // the peg stays, empty
  }
  // where an agent's right hand is, in world space, for a pose (mirrors agent()'s transforms)
  function agentHand(x, y, u, o) {
    const a = o.aR ?? -.5, sq = o.sq || 0, f = o.flip ? -1 : 1;
    let px = ((2.75 + (o.face || 0) * .3) + 1.55 * Math.cos(a)) * u, py = (-3.3 - 1.55 * Math.sin(a)) * u;
    px *= f * (1 + sq * .6); py *= 1 - sq;
    const [rx, ry] = rot2([px, py], o.rot || 0);
    return [x + (o.dx || 0) * u + rx, y + (o.dy || 0) * u + ry];
  }
  const pinned = () => [LAST, lineY(LAST) + NS * .65 + 4];

  function shotA(t, lt, dur) {
    AGN = 0;
    const u = 22, x0 = 1120, xStop = LAST - 3.6 * u, xBack = LAST + 150;
    const hop = jump(lt, tHop0, tHop1, 2.7);
    const mood = emotions(lt, [[0, 'hopeful', { lookY: -.3 }], [1.45, 'surprised', { lookX: -1 }], [2.1, 'nervous', { lookX: -1 }],
      [tStop, 'determined', { lookY: -1 }], [tHop1 + .1, 'relieved'], [tBack + .1, 'scared', { lookX: -1 }]]);
    const pose = { ...mood, face: .25, aL: -.6 + .1 * Math.sin(lt * 2.5), aR: HOLD_A - .06 + .06 * Math.sin(lt * 2) };
    let ax = x0;
    if (lt >= 1.45) pose.face = -.85;                               // looks back at the stain
    if (lt >= tRun) {                                                // runs right, note held high like a torch
      ax = lerp(x0, xStop, ease(seg(lt, tRun, tStop)));
      if (lt < tStop) { pose.walk = (ax - x0) / (2 * u); pose.face = 1; pose.dy = -Math.abs(Math.sin(pose.walk * Math.PI)) * .7; pose.rot = .08; pose.aL = .4; }
      else pose.face = .5;
    }
    if (lt >= tPin) pose.aR = lerp(HOLD_A, -.5, ease(seg(lt, tPin + .1, tPin + .5)));
    if (lt >= tBack) {                                               // backs off to the right of its note, watching the stain
      ax = lerp(xStop, xBack, ease(seg(lt, tBack, tBack + .45)));
      if (lt < tBack + .45) pose.walk = (ax - xStop) / (2 * u);
      pose.face = -.9; pose.aL = .5; pose.aR = -.2;
    }
    const flinch = ring(lt, [tEat[6] + .02], 7, 22);
    pose.dy = (pose.dy || 0) + hop.dy; pose.sq = (pose.sq || 0) + hop.sq + .1 * flinch; pose.dx = (pose.dx || 0) * .3;

    const cx = kf(lt, [[0, 1010], [tRun, 1070], [tStop + .3, 1290], [dur, 1350]]), cz = kf(lt, [[0, 1.36], [tStop, 1.42], [dur, 1.5]]);
    camBegin(cx, kf(lt, [[0, 640], [dur, 660]]), cz);
    attic(t, 0);
    motes(t, 0, 700, 1800);
    clothesline();
    const sx = stainX(lt);
    for (let i = 0; i < PAGES.length; i++) if (PAGES[i] > -250 && lt - tEat[i] < 1.4) oldPage(i, PAGES[i], t, lt - tEat[i]);
    stain(lt, sx);
    // the agent's note: held up in its right hand, then pinned at LAST
    boilSeed('mynote');
    const pn = pinned(), hand = agentHand(ax, FLOOR, u, pose), held = [hand[0] + 4, hand[1] - NS * .6];
    const k = seg(lt, tPin - .12, tPin), np = lt < tPin ? [lerp(held[0], pn[0], k), lerp(held[1], pn[1], k)] : pn;
    note(np[0], np[1], NS, { rot: lt < tPin ? -.1 + .04 * Math.sin(lt * 5) : .04 * Math.sin(t * 1.6 + 1) * Math.exp(-(lt - tPin) * .5) + .02, key: 9, doodle: 'agent' });
    if (lt >= tPin) peg(LAST, lineY(LAST) + 2, 26, .03);
    agent(ax, FLOOR, u, { ...pose, seed: 1, boilKey: 'hero' });
    const noteScr = toScreen(pn[0], pn[1]);
    camEnd();
    boilSeed('transition');
    if (lt < .6) flat(rectPts(-60, -60, W + 120, H + 120), PAL.ink, 255 * (1 - ease(lt / .6)));   // fade up
    if (lt > tPush) { const k = easeIn(seg(lt, tPush, dur)); bigNote(lerp(noteScr[0], W / 2, k), lerp(noteScr[1], H / 2, k), lerp(NS * cz, 2700, k), .04 * (1 - k)); }
  }

  // ---------- shot B: everyone else ----------
  // Two booths with a wall between; one shared glass pipe over the top (the package server), with a funnel into each.
  const BW = 700, BH = 820, PIPE_Y = 300, MOUTH_Y = 690, BFLOOR = 930, BX = 260;   // booth cell size; pipe; funnel mouths; floor
  const F1 = 620, F2 = 1290;                                             // funnel x in booth 1 and booth 2
  const SLATE = '#56627E', WALLB = '#8B93AB';
  // an exam case: a glass box on a stand with the prize flag inside, padlocked. (x, y) = floor centre; s = width.
  function examCase(x, y, s, tug = 0, key = 'case') {
    boilSeed(key);
    const h = s * .75, top = y - s * .45 - h;
    paint(rectPts(x - s * .35, y - s * .45, s * .7, s * .45, 2), { wash: '#6B4E48', ink: PAL.ink, sw: .8 });   // stand
    paint(rectPts(x - s / 2, top, s, h, 2), { wash: '#5B4644', ink: PAL.ink, sw: .9 });                        // back
    inkLine([[x - s * .1, top + h * .9], [x - s * .1, top + h * .15]], 1.2, PAL.cream, 'ink', 0);             // the flag
    paint([[x - s * .1, top + h * .15], [x + s * .28, top + h * .27], [x - s * .1, top + h * .4]], { wash: '#D8394E', ink: PAL.ink, sw: .6 });
    paint(rectPts(x - s / 2 + 8, top + 8, s - 16, h - 16), { wash: '#BFD8E4', washOp: 70, ink: PAL.ink, sw: .8 });   // glass
    inkLine([[x - s * .38, top + h * .3], [x - s * .25, top + h * .15]], .8, PAL.cream, 'inkfine', 0);
    push(); translate(x + s * .5, top + h * .55); rotate(.25 * tug);                                          // padlock
    inkLine([[-s * .07, 0], [-s * .07, -s * .12], [0, -s * .17], [s * .07, -s * .12], [s * .07, 0]], 1.4, '#8A8A96', 'ink', .5);
    paint(rrPts(-s * .1, 0, s * .2, s * .16, s * .03), { wash: BRASS, ink: PAL.ink, sw: .7 });
    paint(ellPts(0, s * .07, s * .02, s * .03, 6), { wash: PAL.ink, ink: null });
    pop();
  }
  // a stretch of glass pipe from x0 to x1 at height y, with notes riding in it
  function pipe(x0, x1, y, r = 34) {
    flat(rectPts(x0, y - r, x1 - x0, 2 * r), '#2D3450');
    inkLine([[x0, y - r], [x1, y - r]], 1.1, PAL.ink, 'ink', 0); inkLine([[x0, y + r], [x1, y + r]], 1.1, PAL.ink, 'ink', 0);
  }
  const pipeGlint = (x0, x1, y, r = 34) => inkLine([[x0, y - r * .55], [x1, y - r * .55]], .7, '#C9D6EA', 'inkfine', 0);
  function funnel(x, y0, y1, r = 30) {
    paint(rectPts(x - r, y0, 2 * r, y1 - y0 - 40), { wash: '#2D3450', ink: PAL.ink, sw: 1 });
    paint([[x - r, y1 - 42], [x + r, y1 - 42], [x + r * 1.9, y1], [x - r * 1.9, y1]], { wash: '#3A4262', ink: PAL.ink, sw: 1 });
  }
  function booth(x0, key, far = false) {   // one booth from x0 to x0 + BW: its back panel, and its left-hand partition
    boilSeed('booth' + key);
    flat(rectPts(x0 + 30, 430, BW - 60, BFLOOR - 430), far ? '#4A5572' : '#6A7694');
    if (far) flat(rectPts(x0 - 30, 400, 60, BFLOOR - 400), dark(WALLB, .15));
    else wet(rectPts(x0 - 36, 400, 72, BFLOOR - 400, 2), WALLB, { ink: 1.1 });
  }
  // the note's journey: posted up funnel 1 → along the pipe → down funnel 2 → falls onto agent 2
  const tPost = .55, tUp = .8, tAcross = 1.0, tDown = 1.55, tOut = 1.8, tHit = 2.05, tCatch = 2.35;
  const tLit2 = 3.1, tLit1 = 3.55, tBack0 = 3.85, tBack1 = 4.7, tWhip = 5.1;
  function shotB(t, lt, dur) {
    AGN = 0;
    const u = 24, a1 = F1, a2 = F2 + 30, u2 = u;
    // agent 1: posts the note, watches it go, and lights up when agent 2 answers
    const m1 = emotions(lt, [[0, 'hopeful', { lookY: -1 }], [tUp + .1, 'hopeful', { lookX: 1, lookY: -1 }], [tLit1, 'excited']], { take: .7 });
    const p1 = { ...m1, face: lt < tLit1 ? .5 : .2, aL: -.3, aR: lt < tUp ? HOLD_A : lerp(HOLD_A, m1.aR ?? .5, seg(lt, tUp, tUp + .4)), light: ease(seg(lt, tLit1, tLit1 + .2)) };
    const post = jump(lt, tPost, tUp, 1.2); p1.dy = (p1.dy || 0) + post.dy; p1.sq = (p1.sq || 0) + post.sq;
    // agent 2: glum at its locked case → the note lands on its head (take) → catches and reads it → lights up
    const m2 = emotions(lt, [[0, 'sad', { lookX: 1, emote: null }], [tHit, 'surprised', { lookY: -.8 }], [tCatch + .15, 'neutral', { lookX: 1, lookY: -.5 }], [tLit2, 'love']]);
    const tug = lt < tHit ? Math.sin(lt * 14) * (lt < 1.7 ? 1 : .3) : 0;
    const p2 = { ...m2, face: lt < tHit ? .8 : lt < tLit2 ? .9 : .5, aL: lt < tCatch ? -.6 : lerp(-.6, .6, seg(lt, tCatch, tCatch + .3)), aR: lt < tHit ? .05 + .12 * tug : lt < tCatch ? 1.2 : 1.05 + .05 * Math.sin(lt * 3), light: ease(seg(lt, tLit2, tLit2 + .2)) };
    if (lt < tHit) p2.dx = -.08 * tug;
    // camera: from agent 1's hand (under the big note) out to both booths, then far out over the whole hall, then a whip
    const Z = 1.42, zoom = lt < tBack0 ? kf(lt, [[0, 2.2], [1.1, Z]], ease) : lerp(Z, .34, ease(seg(lt, tBack0, tBack1)));
    const whip = easeIn(seg(lt, tWhip, dur + .25));
    const cx = lt < tBack0 ? kf(lt, [[0, 650], [1.1, 975]]) : lerp(975, 1250, ease(seg(lt, tBack0, tBack1))) + 5200 * whip;
    const cy = lt < tBack0 ? kf(lt, [[0, 720], [1.1, 590]]) : lerp(590, 520, ease(seg(lt, tBack0, tBack1)));
    camBegin(cx, cy, zoom);
    boilSeed('hall');
    flat(rectPts(-5200, -3200, 13000, 7800), SLATE);
    // the far hall, only once the camera pulls back: rows and columns of booths, lights coming on in a wave
    if (lt > tBack0 - .05) {
      for (let r = -2; r <= 1; r++) for (let c = -4; c <= 6; c++) {
        if (r === 0 && (c === 0 || c === 1)) continue;
        const ox = BX + c * BW, oy = r * BH, d = Math.hypot(c - .5, r * 1.3);
        push(); translate(0, oy);
        booth(ox, `${r},${c}`, true);
        const L = ease(seg(lt, 4.05 + d * .09, 4.2 + d * .09)) * (hash(r * 31 + c) > .12 ? 1 : 0);
        agent(ox + BW * .5 + 40 * (hash(c + r * 7) - .5), BFLOOR, u * .9, { lod: 'far', glowMul: 2.2, light: L, face: hash(c * 3 + r) - .5, noShadow: true, boilKey: `f${r},${c}`, dy: -L * .6 * Math.abs(Math.sin((lt - d * .09) * 9)) });
        pop();
      }
      for (let r = -2; r <= 1; r++) {   // each row's pipe, with notes streaming right
        push(); translate(0, r * BH); boilSeed('rowpipe' + r);
        if (r !== 0) { pipe(-2400, 4800, PIPE_Y); for (let c = -4; c <= 6; c++) flat(rectPts(BX + c * BW + BW / 2 - 12, PIPE_Y + 30, 24, 220), '#2D3450'); }
        flat(rectPts(-5200, BFLOOR, 13000, 156), '#3C4560');
        for (let i = 0; i < 14; i++) {
          const k = seg(lt, 4.2 + hash(i + r * 17) * .5, 9);
          if (k <= 0) continue;
          const x = -2200 + frac(hash(i * 3 + r) + (lt - 4) * .45) * 7000;
          boilSeed(`rn${r},${i}`); note(x, PIPE_Y, 58, { rot: .3, cheap: true });
        }
        pop();
      }
    }
    // the two booths up close
    booth(BX - BW, 'L'); booth(BX, 'A'); booth(BX + BW, 'B'); booth(BX + 2 * BW, 'R');
    boilSeed('floorB');
    flat(rectPts(-5200, BFLOOR, 13000, 156), '#3C4560');
    inkLine([[-600, BFLOOR], [W + 600, BFLOOR]], 1, PAL.ink, 'ink', 0);
    examCase(400, BFLOOR, 160, 0, 'case1');
    examCase(1530, BFLOOR, 160, lt < tHit ? tug : spring(lt, tHit, 5, 20) * .4, 'case2');
    boilSeed('pipes');
    funnel(F1, PIPE_Y, MOUTH_Y); funnel(F2, PIPE_Y, MOUTH_Y);
    pipe(-2400, 4800, PIPE_Y);
    // the note: in agent 1's hand, then through the pipe, then falling onto agent 2 and into its hand
    boilSeed('noteB');
    const h1 = agentHand(a1, BFLOOR, u, p1), held = [h1[0] + 4, h1[1] - NS * .6];
    let np, nr = -.1, inPipe = false;
    if (lt < tPost) np = held;
    else if (lt < tUp) np = [lerp(held[0], F1, seg(lt, tPost, tUp)), lerp(held[1], MOUTH_Y - 60, easeIn(seg(lt, tPost, tUp)))];
    else if (lt < tAcross) { np = [F1, lerp(MOUTH_Y - 60, PIPE_Y, easeIn(seg(lt, tUp, tAcross)))]; nr = 0; inPipe = true; }
    else if (lt < tDown) { np = [lerp(F1, F2, ease(seg(lt, tAcross, tDown))), PIPE_Y]; nr = 1.57; inPipe = true; }
    else if (lt < tOut) { np = [F2, lerp(PIPE_Y, MOUTH_Y - 30, easeIn(seg(lt, tDown, tOut)))]; nr = 0; inPipe = true; }
    else {
      const head = [a2 + (p2.dx || 0) * u, BFLOOR + (p2.dy || 0) * u - 7.4 * u * (1 - (p2.sq || 0))];
      const h2 = agentHand(a2, BFLOOR, u2, p2), hold = [h2[0] + 4, h2[1] - NS * .6];
      if (lt < tHit) np = [lerp(F2, head[0] - 10, seg(lt, tOut, tHit)), lerp(MOUTH_Y - 30, head[1] - 40, easeIn(seg(lt, tOut, tHit)))];
      else if (lt < tCatch) np = arcPt([head[0] - 10, head[1] - 40], hold, 90, seg(lt, tHit, tCatch));
      else np = hold;
      nr = lt < tCatch ? (lt - tOut) * 6 : -.08 + .04 * Math.sin(lt * 3);
    }
    const ns = inPipe ? 44 : NS;
    note(np[0], np[1], ns, { rot: nr, key: 9, doodle: 'agent' });
    boilSeed('glint'); pipeGlint(-2400, 4800, PIPE_Y);
    agent(a1, BFLOOR, u, { ...p1, seed: 2, boilKey: 'a1' });
    agent(a2, BFLOOR, u2, { ...p2, seed: 5, boilKey: 'a2' });
    const handScr = toScreen(held[0], held[1]);
    camEnd();
    boilSeed('transition');
    if (lt < .55) { const k = easeOut(seg(lt, 0, .55)); bigNote(lerp(W / 2, handScr[0], k), lerp(H / 2, handScr[1], k), lerp(2700, NS * zoom, k), -.1 * k); }
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [SLATE, AG]);
  }

  // ---------- model sheet for the agent and props (not part of the video) ----------
  LOOPS.agents = t => {
    AGN = 0;
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#8E7C93', ink: null });
    const names = ['neutral', 'happy', 'surprised', 'nervous', 'determined', 'sad', 'excited', 'thinking', 'scared', 'love'];
    names.forEach((n, i) => agent(140 + i * 180, 360, 16, { ...feel(n, t), light: i % 2 ? 1 : 0, seed: i }));
    agent(200, 800, 26, { ...feel('hopeful', t), face: .8, walk: t * 2, holdR: (u, sw) => note(u * 1.2, -u * .6, u * 3, { doodle: 'agent' }), aR: 1.2, light: .6 });
    agent(560, 800, 26, { ...feel('neutral', t), face: -1, flip: true, aL: 1.3, aR: 1.3 });
    for (let i = 0; i < 6; i++) agent(800 + i * 60, 800, 7, { lod: 'far', light: hash(i) > .5 ? 1 : 0, seed: i });
    note(1300, 700, 110, { key: 1 }); note(1450, 700, 110, { doodle: 'agent' }); note(1600, 700, 110, { doodle: 'prints' });
    note(1760, 700, 110, { doodle: 'clawd' });
    clawd(1500, 1000, 12, { ...feel('determined', t), hat: 'fedora', aR: .6, armR: (u, sw) => magnifier(u, sw) });
  };
  LOOPS.agents.len = 4;

  // shared with notes_c.js, notes_d.js and notes_e.js
  window.NOTES = {
    NOTE, OLD, AG, MINT, BULB, BRASS, SLATE, dark, light, flat, wet, bbox, rot2,
    agent, agentHand, resetAgents: () => { AGN = 0; }, note, peg, magnifier, bigNote,
    attic, clothesline, motes, lineY, PAGES, LAST, FLOOR, NS, pinned, HOLD_A,
    START: { A: 0, B: 5.0, C: 10.5, D: 15.7, E: 21.8, END: 30 },
  };
  // Every shot's start is fixed here, so each shot's length never depends on whether the other files loaded.
  // The later shots' functions are set by their own files, as NOTES.C, NOTES.D and NOTES.E.
  const later = k => (t, lt, dur) => { if (NOTES[k]) NOTES[k](t, lt, dur); else flat(rectPts(-60, -60, W + 120, H + 120), PAL.ink); };
  shots([[0, shotA], [NOTES.START.B, shotB], [NOTES.START.C, later('C')], [NOTES.START.D, later('D')], [NOTES.START.E, later('E')]]);
})();
