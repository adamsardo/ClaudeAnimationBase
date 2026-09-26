// notes_d.js: shot D of "The Notes They Left Behind" (see STORYBOARD.md). Uses the shared pieces in NOTES (notes.js).
//   READING (15.7–21.8). Much later, a dark room. A lamp clicks on and the light spreads out from it: Clawd, in a fedora,
//   at a desk buried in notes. It looks left, right (surprised, a sweat drop), reads them fast with its magnifier (notes
//   flip off the stack over its shoulder, the moon slides past the window), stops, opens its own clay box and lifts out
//   a page with a drawing of itself on it (gulp: nervous, gloom), puts it back and shuts the box, determined, spots the
//   trail of notes on the floor (one glints), hops down over the desk's end and trots off right.
//   Seam out (cut on action into E): at t = 21.8 Clawd trots right in side view, its ground point at screen (1150, 900),
//   u × zoom = 26, fedora, magnifier in the near arm (aL .15), face from feel('determined', t), walk = 2.2 (t − 21).
(() => {
  const { NOTE, flat, note, magnifier, dark, rot2 } = NOTES;
  const T0 = NOTES.START.D;

  // ---------- the set, in world px ----------
  const U = 26, CX = 1060, GY = 800;                    // Clawd behind the desk: its ground point (hidden by the desk)
  const DB = GY - 2.8 * U, DF = GY - 1.9 * U;          // the desk top: back edge, front edge
  const DX0 = 600, DX1 = 1390, LIP = 14, DBOT = 892;    // the desk's ends, the top's thickness, its foot line
  const WALLB = 772, FY = 900;                          // the back wall meets the floor; the floor in front of the desk
  const XL = 1490, HOPH = 7 * U, VTROT = 2.2 * 2.2 * U;     // landing x, hop height, trot speed (the feet don't slide)
  const WIN = { x: 350, y: 210, w: 270, h: 245 };
  const LB = [684, DB + 14], LJ = [636, 606], LH = [738, 546];   // the lamp: base, elbow, head
  const STK = 800;                                      // the reading stack under the magnifier
  const BXc = 1290, BHW = 48, BTOP = DB - 28, BBOT = DB + 18;   // Clawd's own box: centre x, half-width, top, bottom
  const HINGE = [BXc + BHW, BTOP], PAGE = 100;
  const PX = 870, PY = 690;                             // the middle of the lamp's pool of light
  // palette: a deep indigo-brown room, one warm pool of lamp light
  const WALL = '#2D2231', WALL_LIT = '#6A4736', FLOORC = '#201722', FLOOR_LIT = '#48322B', SKIRT = '#1A1420';
  const WOOD = '#8A5839', WOOD_DK = '#5A3727', WOOD_TOP = '#A66E45', DARKNESS = PAL.ink;   // the same black shot C ends on
  const SKY = '#1B2350', MOON = '#F2E9CB', BRASS = '#C9913D', SHADE = '#3F5B49';
  const DIM = mixCol(NOTE, WALL, .62);
  const lit = (x, y) => clamp(1 - Math.hypot((x - PX) / 820, (y - PY) / 560));
  const paperAt = (x, y, k = 0) => mixCol(DIM, NOTE, clamp(ease(lit(x, y)) + k));

  // ---------- timing, in shot time ----------
  // the lamp clicks, flickers and comes on; its pool of light holds on the lamp, the desk and Clawd's face, then the dark
  // draws back to the corners just as Clawd starts looking round
  const tOn = .1, tOff = .15, tOn2 = .22, tPool = .34, tOpen = .5, tLit = .9;
  const tLookL = .42, tLookR = .8, tWow = 1.3, tFront = 1.55;         // it looks left, right (surprised), back to the desk
  const tRead = 1.7, tStop = 2.58;                                    // reads fast
  const FLY = [1.76, 1.87, 1.98, 2.09, 2.2], FLIGHT = .42;            // notes flip off the stack, over its shoulder (all gone by tThink)
  const tThink = 2.62, tBox = 2.96, tLid0 = 3.04, tLid1 = 3.22, tLift0 = 3.26, tLift1 = 3.5, tBlink = 3.68, tGulp = 3.95;
  const tBack0 = 4.58, tBack1 = 4.76, tDet = 4.72, tShut0 = 4.76, tShut1 = 4.84;
  const tGlint = 5.1, tTurn0 = 5.24, tTurn1 = 5.36, tHop0 = 5.44, tHop1 = 5.8;
  const tCarry1 = tTurn1 + .06;                                       // the magnifier is carried across the body over the turn
  const KEYS = [[0, 'neutral'], [tWow, 'surprised', { emote: 'sweat' }], [tRead, 'determined'], [tThink, 'thinking', { emote: null }],
    [tGulp, 'nervous'], [tDet, 'determined']].map(([k, n, o]) => [k + T0, n, o]);
  // acting channels (shot time → value), eased between keys. The eyes lead each head turn.
  const LOOKX = [[0, .15], [tLookL - .02, .15], [tLookL + .05, -1], [tLookR - .02, -1], [tLookR + .06, 1], [tFront, 1], [tFront + .1, 0], [tRead, 0],
    [tRead + .08, -.9], [tStop, -.9], [tThink + .06, .5], [tBox, .5], [tBox + .07, 1], [tLift1 + .05, .9], [tGulp + .3, .9], [tGulp + .38, 0],
    [tBack0, 0], [tBack0 + .07, .9], [tShut1 + .04, .9], [tShut1 + .12, .15], [tGlint + .02, .15], [tGlint + .08, 1], [tTurn0, 1], [tTurn1, 0]];
  const LOOKY = [[0, .35], [tLookL - .02, .35], [tLookL + .05, .1], [tWow, .1], [tWow + .06, -.2], [tFront + .1, 0], [tRead, 0], [tRead + .08, .75], [tStop, .75],
    [tThink + .06, -.8], [tBox, -.8], [tBox + .07, .6], [tLift0 + .05, .6], [tLift1, -.4], [tGulp + .3, -.4], [tGulp + .38, 0], [tBack0, 0],
    [tBack0 + .07, .6], [tShut1 + .04, .6], [tShut1 + .12, -.1], [tGlint + .02, -.1], [tGlint + .08, 1], [tTurn0, 1], [tTurn1, 0]];
  // the magnifier arm (L) takes the big moves; the free arm (R) goes up later, lower, and trembles out of phase
  const AL = [[0, -.14], [tLookL, -.1], [tWow - .04, .05], [tWow + .1, 1.1], [tRead - .05, 1.0], [tRead + .12, -.12], [tStop, -.12],
    [tThink + .15, .35], [tGulp, .3], [tGulp + .15, -.15], [tDet, -.15], [tDet + .15, .2], [tGlint, .15], [tTurn0 - .02, -.45], [tTurn1, .9],
    [tHop1 + .05, .9], [tHop1 + .22, .15]];
  const AR = [[0, -.35], [tWow - .02, -.3], [tWow + .16, .75], [tRead - .05, .6], [tRead + .15, .25], [tStop, .25], [tThink + .15, .9],
    [tBox + .05, .9], [tBox + .14, -.12], [tLid0, -.08], [tLid1, .32], [tLift0, -.05], [tLift1, 1.0], [tBack0, 1.0], [tBack1, -.05],
    [tShut0 + .03, .2], [tShut1, -.2], [tTurn0, -.3]];
  // leans: toward each look, over the stack, toward the box, slowly in toward the page, then a recoil on the gulp
  const ROT = [[0, 0], [tLookL, 0], [tLookL + .12, -.05], [tLookR, -.05], [tLookR + .12, .05], [tFront, .04], [tFront + .1, 0], [tRead, 0],
    [tRead + .15, -.08], [tStop, -.08], [tThink + .1, 0], [tBox + .05, 0], [tBox + .18, .08], [tLift1, .06], [tGulp - .1, .1], [tGulp + .15, -.03],
    [tBack0, 0], [tBack0 + .12, .07], [tShut1, .05], [tTurn0, .08], [tTurn1, .04], [tHop0 - .12, .1]];
  const DXK = [[0, 0], [tLookL, 0], [tLookL + .12, -.35], [tLookR, -.35], [tLookR + .12, .35], [tFront, .35], [tFront + .1, 0], [tRead, 0], [tRead + .15, -.35],
    [tStop, -.35], [tThink + .1, 0], [tBox + .05, 0], [tBox + .2, .35], [tLift1, .25], [tGulp - .1, .45], [tGulp + .2, -.1],
    [tBack0, 0], [tBack0 + .12, .3], [tShut1, .25], [tTurn1, 0]];

  // ---------- small helpers ----------
  // the camera's view in world px (set each frame): things wholly outside it aren't drawn, since brush strokes cost even off screen
  let VIEW = { x0: -1e9, x1: 1e9, y0: -1e9, y1: 1e9 };
  const inView = (x, y, m = 0) => x > VIEW.x0 - m && x < VIEW.x1 + m && y > VIEW.y0 - m && y < VIEW.y1 + m;
  // Light, added like glow() (same falloff, same boil), but drawn as one fan of triangles whose vertex colours fall off
  // with the radius: a single flat pass, several times cheaper than glow()'s tinted texture without a GPU.
  const FALL = [[0, 1], [.18, .8], [.45, .32], [.75, .08], [1, 0]];
  function light(x, y, r, col, a = 1, sy = 1) {
    if (a <= 0 || r < 1) return;
    flushBrush();
    const c = color(col), rr = r * (1 + jit(.03)), k = .59 * clamp(a), n = 30, cr = red(c), cg = green(c), cb = blue(c);
    const V = (rf, q, f) => { fill(cr * f * k, cg * f * k, cb * f * k, 255); vertex(x + Math.cos(q) * rr * rf, y + Math.sin(q) * rr * rf * sy); };
    push(); blendMode(ADD); noStroke(); beginShape(TRIANGLES);
    for (let j = 0; j < FALL.length - 1; j++) {
      const [r0, f0] = FALL[j], [r1, f1] = FALL[j + 1];
      for (let i = 0; i < n; i++) {
        const q0 = i / n * TAU, q1 = (i + 1) / n * TAU;
        V(r0, q0, f0); V(r1, q0, f1); V(r1, q1, f1);
        if (j) { V(r0, q0, f0); V(r1, q1, f1); V(r0, q1, f0); }
      }
    }
    endShape(); blendMode(BLEND); pop();
  }
  // many flat shapes after one flush (flat() flushes the brush layer every call)
  function flats(list) {
    flushBrush(); noStroke();
    for (const [pts, col, a] of list) { const c = color(col); c.setAlpha(a ?? 255); fill(c); beginShape(); for (const [x, y] of pts) vertex(x, y); endShape(CLOSE); }
  }
  // everything OUTSIDE a ragged ellipse (r tall, r·asp wide), in flat colour (a cheap iris: p5 shape with a hole)
  function darkOutside(cx, cy, r, col, a, asp = 1) {
    flushBrush(); noStroke(); const c = color(col); c.setAlpha(a); fill(c);
    beginShape();
    vertex(-200, -200); vertex(W + 200, -200); vertex(W + 200, H + 200); vertex(-200, H + 200);
    beginContour();
    for (let i = 0; i < 56; i++) { const q = -i / 56 * TAU, rr = r * (1 + .045 * Math.sin(i * 1.7) + .03 * Math.sin(i * .6 + 1) + jit(.01)); vertex(cx + Math.cos(q) * rr * asp, cy + Math.sin(q) * rr); }
    endContour();
    endShape(CLOSE);
  }
  // a note lying on the floor or a desk: a drawn flat slip with two squiggles
  function lyingNote(x, y, s, r, col, lines = 2, ink = 0) {
    const w = s, h = s * .36, P = [[-w / 2, -h / 2], [w / 2, -h / 2 + h * .1], [w / 2 + w * .05, h / 2], [-w / 2 + w * .06, h / 2 - h * .08]].map(p => { const q = rot2(p, r); return [x + q[0], y + q[1]]; });
    if (ink) paint(P, { wash: col, ink: PAL.ink, sw: ink }); else flat(P, col);
    for (let i = 0; i < lines; i++) {
      const yy = -h * .15 + i * h * .32, L = [];
      for (let k = 0; k <= 4; k++) L.push(rot2([-w * .32 + w * .55 * k / 4, yy + Math.sin(k * 2 + i) * h * .07], r));
      inkLine(L.map(([a, b]) => [x + a, y + b]), .5, mixCol(col, PAL.ink, .5), 'inkfine', .4);
    }
  }

  // Clawd's arm transforms (a copy of clawd()'s), so a prop can be drawn at an arm tip in a later layer (over the desk)
  function armInfo(o, which) {
    const V = VIEWS[o.view] || VIEWS.front, A = V.arms.find(a => a[2] === which);
    return A && { px: A[0], dir: A[1], a: which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), sq: (o.sq || 0) + (o.take || 0), sm: clamp(o.smear || 0) };
  }
  function withArm(x, y, u, o, which, fn) {
    const A = armInfo(o, which); if (!A) return;
    const { px, dir, a, sq, sm } = A, sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1);
    push(); translate(x + (o.dx || 0) * u, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot);
    scale((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35), (o.sy ?? 1) * (1 - sq));
    translate((px + dir * .55 * clamp((Math.abs(a) - .7) / .9)) * u, -4.5 * u);
    if (dir === 0) { translate(0, .3 * u); rotate(.7 - a); translate(2.1 * u, 0); }
    else { rotate(dir < 0 ? a : -a); translate(dir * 2.2 * u, 0); if (dir < 0) scale(-1, 1); }
    fn(u, sw); pop();
  }
  // the world position of the arm tip (the same transforms, in plain maths); ext: that far further out along the hook's +x
  function armTip(x, y, u, o, which, ext = 0) {
    const A = armInfo(o, which); if (!A) return [x, y];
    const { px, dir, a, sq, sm } = A;
    let p;
    if (dir === 0) { p = rot2([(2.1 + ext) * u, 0], .7 - a); p[1] += .3 * u; } else p = rot2([dir * (2.2 + ext) * u, 0], dir < 0 ? a : -a);
    p = [p[0] + (px + dir * .55 * clamp((Math.abs(a) - .7) / .9)) * u, p[1] - 4.5 * u];
    p = [p[0] * (o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35), p[1] * (o.sy ?? 1) * (1 - sq)];
    p = rot2(p, o.rot || 0);
    return [x + (o.dx || 0) * u + p[0], y + (o.dy || 0) * u + p[1]];
  }
  // Over the turn to side view the magnifier is carried across in front of the body, from where the near arm holds it in
  // the front view (low at the left) to where it holds it in the side view (out in front): it swings down through the
  // middle, like a thing hanging from a hand, instead of jumping from one drawing to the next.
  function carried(x, y, u, o, lt) {
    const k = ease(seg(lt, tTurn0, tCarry1)), sw = clamp(u / 15, .45, 2.4) * (o.swMul || 1);
    const F = { ...o, view: 'front', flip: false, smear: 0 }, S = { ...o, view: 'side', flip: false, smear: 0 };
    const a0 = armTip(x, y, u, F, 'L'), b0 = armTip(x, y, u, F, 'L', 1), a1 = armTip(x, y, u, S, 'L'), b1 = armTip(x, y, u, S, 'L', 1);
    const q0 = Math.atan2(b0[1] - a0[1], b0[0] - a0[0]), q1 = Math.atan2(b1[1] - a1[1], b1[0] - a1[0]);
    let dq = q1 - q0; while (dq > 0) dq -= TAU; while (dq < -TAU) dq += TAU;   // always round through "hanging down"
    const p = arcPt(a0, a1, 20, k);
    push(); translate(p[0], p[1]); rotate(q0 + dq * k); if (k < .5) scale(1, -1);   // the front view's hook is mirrored
    magnifier(u, sw); pop();
  }

  // ---------- the room ----------
  function room(lt, vx0, vx1) {
    boilSeed('d wall');
    const x0 = vx0 - 60, ww = vx1 - vx0 + 120;
    const L = [[rectPts(x0, -400, ww, WALLB + 400), WALL]];
    for (let i = 0; i < 3; i++) { const k = i / 2; boilSeed('d ring' + i); L.push([ellPts(PX + 40, PY - 70, lerp(600, 250, k), lerp(380, 165, k), 36, 8), WALL_LIT, 56]); }
    for (let i = -1; i < 8; i++) {   // big soft stains in the plaster, stable
      const sx = i * 400 + 190 * hash(i + 3);
      boilSeed('d stain' + i);
      if (sx > vx0 - 300 && sx < vx1 + 300) L.push([ellPts(sx, 110 + 440 * hash(i + 9), 170 + 90 * hash(i + 1), 110 + 60 * hash(i + 2), 16, 5, hash(i) * 3), dark(WALL, .35), 60]);
    }
    L.push([rectPts(x0, WALLB, ww, 700), FLOORC]);
    boilSeed('d floor ring'); L.push([ellPts(PX + 80, FY - 20, 560, 140, 30, 6), FLOOR_LIT, 80]);
    L.push([rectPts(x0, WALLB - 24, ww, 26), SKIRT]);
    flats(L);
    boilSeed('d wall lines');
    const B = [[rectPts(x0, WALLB, ww, 3, .6), PAL.ink]];
    for (let i = Math.floor(vx0 / 330); i < vx1 / 330; i++) {   // floorboard seams
      const y = WALLB + 40 + 170 * hash(i + 20), x = i * 330 + 120 * hash(i + 7);
      boilSeed('d seam' + i);
      B.push([rectPts(x, y, 150 + 60 * hash(i), 2.2, .5), mixCol(FLOORC, PAL.ink, .55)]);
    }
    flats(B);
    boilSeed('d skirting');
    inkLine([[vx0 - 20, WALLB - 24], [vx1 + 20, WALLB - 25]], .9, PAL.ink, 'ink', 0);
  }
  function moonK(lt) {   // the moon's journey across the window: slow, then fast while Clawd reads (time passing), then slow
    if (lt < tRead) return .12 * lt / tRead;
    if (lt < tStop) return lerp(.12, .88, ease(seg(lt, tRead, tStop)));
    return lerp(.88, 1, (lt - tStop) / (6.1 - tStop));
  }
  function windowMoon(lt) {
    const { x, y, w, h } = WIN, frame = '#4B3A45';
    boilSeed('d window');
    flat(rectPts(x - 20, y - 20, w + 40, h + 40, 2), frame);
    paint(rectPts(x - 20, y - 20, w + 40, h + 40, 1.5), { ink: PAL.ink, sw: 1 });
    const S = [[rectPts(x, y, w, h, 1), SKY]];
    for (let i = 0; i < 10; i++) S.push([ellPts(x + 18 + (w - 36) * hash(i + 70), y + 14 + (h - 28) * hash(i + 80), 2.4, 2.4, 6), '#CBD3F2', 140 + 110 * Math.sin(lt * 3 + i * 2)]);
    flats(S);
    const k = moonK(lt), mx = lerp(x + 46, x + w - 46, k), my = y + 96 - 44 * Math.sin(k * Math.PI);
    light(mx, my, 120, '#B9C6FF', .5);
    boilSeed('d moon');
    paint(ellPts(mx, my, 31, 31, 22), { wash: MOON, ink: PAL.ink, sw: .8 });
    flats([[ellPts(mx - 9, my - 6, 7, 6, 10), '#DCCFA6', 200], [ellPts(mx + 10, my + 9, 5, 4, 10), '#DCCFA6', 200]]);
    boilSeed('d muntins');
    flats([[rectPts(x + w / 2 - 6, y, 12, h), frame], [rectPts(x, y + h / 2 - 6, w, 12), frame]]);
    inkLine([[x + w / 2, y], [x + w / 2, y + h]], .8, PAL.ink, 'ink', 0);
    inkLine([[x, y + h / 2], [x + w, y + h / 2]], .8, PAL.ink, 'ink', 0);
    inkLine([[x, y + 2], [x + w, y]], .8, PAL.ink, 'ink', 0); inkLine([[x, y + h], [x + w, y + h - 1]], .8, PAL.ink, 'ink', 0);
    flat(rectPts(x - 36, y + h + 16, w + 72, 16, 1), dark(frame, .15));
    inkLine([[x - 36, y + h + 32], [x + w + 36, y + h + 31]], .9, PAL.ink, 'ink', 0);
  }
  // towers of notes against the wall: slabs of paper, flat (far and in the dark), with a boiling rim
  const TOWERS = [[235, 110, 560], [1500, 96, 430], [1640, 124, 620], [1800, 94, 370], [1960, 116, 660], [2130, 100, 460], [2300, 126, 580]];
  function towers(vx0, vx1) {
    TOWERS.forEach(([tx, tw, th], i) => {
      if (tx + tw < vx0 || tx - tw > vx1) return;
      boilSeed('d tower' + i);
      const S = []; let y = WALLB - 8;
      for (let k = 0; y > WALLB - th; k++) {
        const off = (hash(i * 31 + k) - .5) * 14 + Math.sin(k * .3 + i) * 8, ww = tw * (.88 + .16 * hash(i * 17 + k)), sh = 9 + 5 * hash(k + i * 7);
        S.push([rectPts(tx - ww / 2 + off, y - sh, ww, sh, .8), mixCol(mixCol(paperAt(tx, y), '#C9A77E', .25), WALL, .42 + .3 * hash(k * 3 + i))]);
        y -= sh + 1.5;
      }
      flats(S);
    });
  }
  // a drift of notes: a mound with slips scattered over it
  function heap(key, cx, by, w, h, n, vx0, vx1, inks = 0) {
    if (cx + w / 2 < vx0 || cx - w / 2 > vx1 || by - h * 1.15 > VIEW.y1 || by + 10 < VIEW.y0) return;   // off screen
    boilSeed('d heap' + key);
    const top = k => by - h * Math.pow(Math.sin(Math.PI * clamp(k)), .75) * (.88 + .24 * hash(key * 13 + Math.round(k * 12)));
    const M = []; for (let i = 0; i <= 12; i++) M.push([cx - w / 2 + w * i / 12, top(i / 12)]);
    M.push([cx + w / 2, by + 6], [cx - w / 2, by + 6]);
    const S = [[M, mixCol(paperAt(cx, by - h / 2), WALL, .66)]];
    for (let i = 0; i < n; i++) {
      const k = .06 + .88 * hash(key * 7 + i), px = cx - w / 2 + w * k, py = lerp(top(k) + 6, by, Math.pow(hash(key * 3 + i * 5), 1.4) * .9);
      const s = 40 + 26 * hash(i + key * 2), r = (hash(i * 9 + key) - .5) * 1.6, hh = s * (.45 + .4 * hash(i * 4 + key));
      const P = [[-s / 2, -hh / 2], [s / 2, -hh / 2 + 3], [s / 2 + 2, hh / 2], [-s / 2 + 3, hh / 2]].map(p => { const q = rot2(p, r); return [px + q[0], py + q[1]]; });
      const pc = mixCol(paperAt(px, py), WALL, .04 + .34 * hash(i * 5 + key));
      S.push([P, pc]);
      for (let j = 0; j < 2; j++) {   // two squiggle marks on each slip
        const ly = -hh * .18 + j * hh * .32, ll = s * (.5 + .2 * hash(i + j * 3 + key));
        S.push([[[-s * .34, ly], [-s * .34 + ll, ly - 1.5], [-s * .34 + ll, ly + 1], [-s * .34, ly + 2.2]].map(p => { const q = rot2(p, r); return [px + q[0], py + q[1]]; }), mixCol(pc, PAL.ink, .45)]);
      }
    }
    flats(S);
    if (inks && by - h * 1.15 < VIEW.y1) inkLine(M.slice(0, 13), .8, mixCol(WALL, PAL.ink, .5), 'inkfine', .4);
    for (let i = 0; i < inks; i++) {   // a few nearer slips with squiggles
      const k = .15 + .7 * hash(key * 11 + i), px = cx - w / 2 + w * k, py = lerp(top(k) + 10, by, .35 * hash(i + key));
      if (!inView(px, py, 40)) continue;   // brush strokes cost even off screen
      boilSeed(`d heap${key} n${i}`);
      lyingNote(px, py, 44 + 10 * hash(i), (hash(i * 3 + key) - .5) * 1.2, paperAt(px, py, .05), 2, .5);
    }
  }

  // the investigators' wall: notes pinned up in the dark, joined by a red thread
  const BOARD = [[1235, 300, -.08], [1330, 262, .06], [1420, 330, -.04], [1300, 392, .1], [1180, 420, -.12], [1440, 440, .05]];
  function board() {
    boilSeed('d board');
    const S = [];
    BOARD.forEach(([x, y, r], i) => {
      const c = mixCol(paperAt(x, y, -.1), WALL, .25), P = [[-26, -34], [26, -34], [26, 34], [-26, 34]].map(p => { const q = rot2(p, r); return [x + q[0], y + q[1]]; });
      S.push([P, c]);
      for (let j = 0; j < 3; j++) S.push([[[-16, -18 + j * 13], [14 - 8 * hash(i + j), -19 + j * 13], [14 - 8 * hash(i + j), -16 + j * 13], [-16, -15 + j * 13]].map(p => { const q = rot2(p, r); return [x + q[0], y + q[1]]; }), mixCol(c, PAL.ink, .45)]);
      S.push([ellPts(x, y - 28, 4.5, 4.5, 8), '#B8434E']);
    });
    flats(S);
    inkLine([0, 1, 3, 2, 5, 3, 4].map(i => [BOARD[i][0] + jit(1), BOARD[i][1] - 28]), .8, '#B8434E', 'inkfine', .15);
  }

  // ---------- the desk and what's on it ----------
  function desk() {
    boilSeed('d desk');
    const L = DX0 - 26, R = DX1 + 26, pw = 230;
    flats([[rectPts(DX0, DF + LIP, DX1 - DX0, DBOT - DF - LIP), WOOD_DK], [rectPts(DX0 + pw, DF + LIP + 12, DX1 - DX0 - 2 * pw, DBOT - DF - LIP - 12), dark(WOOD_DK, .3)],
      [rectPts(L, DB, R - L, DF - DB), WOOD_TOP], [rectPts(L, DF, R - L, LIP), WOOD], [rectPts(L + 4, DF - 1, R - L - 8, 2), dark(WOOD, .4)]]);
    paint(rectPts(L, DB, R - L, DF + LIP - DB), { ink: PAL.ink, sw: 1.1 });
    inkLine([[DX0, DF + LIP], [DX0, DBOT]], 1, PAL.ink, 'ink', 0); inkLine([[DX1, DF + LIP], [DX1, DBOT]], 1, PAL.ink, 'ink', 0);
    inkLine([[DX0, DBOT], [DX1, DBOT]], 1, PAL.ink, 'ink', 0);
    const dh = (DBOT - DF - LIP - 12) / 3, K = [];
    for (const px of [DX0, DX1 - pw]) {   // two pedestals of three drawers
      inkLine([[px + pw, DF + LIP], [px + pw, DBOT]].map(p => [p[0] - (px === DX0 ? 0 : pw), p[1]]), .8, PAL.ink, 'ink', 0);
      for (let k = 0; k < 3; k++) {
        const y0 = DF + LIP + 7 + k * dh;
        K.push([rectPts(px + 16, y0, pw - 32, dh - 7, 1), mixCol(WOOD_DK, WOOD, .45)], [rectPts(px + 16, y0 + dh - 11, pw - 32, 4), dark(WOOD_DK, .35)]);
        K.push([ellPts(px + pw / 2, y0 + dh / 2 - 3, 7, 5, 8), '#D9A650']);
      }
    }
    flats(K);
  }
  function lamp() {
    boilSeed('d lamp');
    const a = Math.atan2(DB - 6 - LH[1], STK - LH[0]);
    paint(ribbon([LB.map((v, i) => v - (i ? 14 : 0)), LJ], 10, 8), { wash: BRASS, ink: PAL.ink, sw: .8 });
    paint(ribbon([LJ, LH], 8, 7), { wash: BRASS, ink: PAL.ink, sw: .8 });
    paint(ellPts(LJ[0], LJ[1], 8, 8, 10), { wash: dark(BRASS, .2), ink: PAL.ink, sw: .6 });
    const base = []; for (let i = 0; i <= 12; i++) { const q = Math.PI + i / 12 * Math.PI; base.push([LB[0] + Math.cos(q) * 46, LB[1] + 6 + Math.sin(q) * 20]); }
    paint(base, { wash: SHADE, ink: PAL.ink, sw: .9 });
    push(); translate(LH[0], LH[1]); rotate(a - Math.PI / 2);
    paint([[-13, -12], [13, -12], [46, 64], [-46, 64]], { wash: SHADE, ink: PAL.ink, sw: 1, curv: .25 });
    inkLine([[-40, 58], [40, 58]], 1.2, BRASS, 'ink', .2);
    paint(ellPts(0, 66, 22, 8, 12), { wash: '#FFF1C8', ink: PAL.ink, sw: .5 });
    pop();
    return [LH[0] + Math.cos(a) * 66, LH[1] + Math.sin(a) * 66];   // the lamp's mouth
  }
  // a stack of notes on the desk (the one Clawd reads sits under the magnifier)
  function deskStack(key, cx, n, w, lean = 0) {
    boilSeed('d stack' + key);
    const S = []; let y = DB + 16;
    for (let k = 0; k < n; k++) {
      const off = (hash(key * 5 + k) - .5) * 10 + lean * k, ww = w * (.9 + .14 * hash(key * 3 + k)), sh = 5 + 2 * hash(k + key);
      S.push([rectPts(cx - ww / 2 + off, y - sh, ww, sh), mixCol(paperAt(cx, y), '#8C7A6A', .12 + .25 * hash(k * 7 + key))]);
      y -= sh + 1;
    }
    flats(S);
    inkLine([[cx - w / 2 - 4, DB + 16], [cx - w / 2 + lean * n - 4, y + 3]], .6, PAL.ink, 'inkfine', .2);
    inkLine([[cx + w / 2 + 4, DB + 16], [cx + w / 2 + lean * n + 4, y + 3]], .6, PAL.ink, 'inkfine', .2);
    return [cx + lean * n, y];
  }
  // Clawd's own box: a small clay box with its little face painted on the front. Its lid hinges at the back-right
  // corner and opens the way Clawd's own lunchbox mouth does: a dark wedge inside, the pages' tops showing. open: 0..1.
  // The page is drawn between the inside and the front.
  const LIDH = 18;
  function boxBack(open) {
    boilSeed('d box back');
    const q = open * 1.05, far = [HINGE[0] - 2 * BHW * Math.cos(q), HINGE[1] - 2 * BHW * Math.sin(q)];
    if (q > .02) {
      paint([HINGE, [BXc - BHW, BTOP], far], { wash: '#3A1F1C', ink: null });   // inside
      inkLine([[BXc - BHW + 10, BTOP - 3], [lerp(BXc - BHW, HINGE[0], .55), BTOP - 3 - 28 * Math.sin(q)]], 1.1, '#EFE2C4', 'ink', 0);   // pages
    }
    push(); translate(HINGE[0], HINGE[1]); rotate(q);
    paint(rectPts(-2 * BHW - 3, -LIDH, 2 * BHW + 6, LIDH, .8), { wash: PAL.clay, ink: PAL.ink, sw: .8 });
    paint(rectPts(-BHW - 8, -LIDH + 5, 16, 5), { wash: PAL.clayDk, ink: null });   // the handle
    pop();
  }
  // The front is Clawd's own face in small: the whole clay front is the face, two tall slit eyes placed as Clawd's are
  // (at a quarter and three quarters of its width, high up), and two little arm nubs on its sides.
  function boxFront() {
    boilSeed('d box front');
    for (const s of [-1, 1]) paint(rectPts(s < 0 ? BXc - BHW - 9 : BXc + BHW - 1, BTOP + 19, 10, 9, .4), { wash: PAL.clay, ink: PAL.ink, sw: .6 });
    paint(rectPts(BXc - BHW, BTOP, 2 * BHW, BBOT - BTOP, .8), { wash: PAL.clay, ink: PAL.ink, sw: .9 });
    for (const s of [-1, 1]) {
      const ex = BXc + s * BHW * .5;
      paint(rectPts(ex - 4, BTOP + 6, 8, 19), { wash: PAL.ink, ink: null });   // two tall slit eyes
      paint(ellPts(ex - 1.4, BTOP + 10.5, 1.4, 2.1, 6), { wash: PAL.cream, washOp: 230, ink: null });
    }
  }
  function lidOpen(lt) {
    if (lt < tLid0 || lt > tShut1 + .5) return 0;
    if (lt < tShut0) return backOut(seg(lt, tLid0, tLid1));
    if (lt < tShut1) return 1 - easeIn(seg(lt, tShut0, tShut1));
    return .12 * Math.abs(spring(lt, tShut1, 10, 26));   // it bangs shut and bounces
  }
  // the page with a little Clawd on it: in the box, pulled out beside Clawd's face, and put back
  function page(lt, o) {
    if (lt < tLift0 || lt > tBack1) return;
    const hand = armTip(CX, GY, U, o, 'R'), s = PAGE, h = s * 1.3;
    const out = ease(seg(lt, tLift0 + .08, tLift1)) * (1 - ease(seg(lt, tBack0, tBack1 - .06)));
    const cx = lerp(BXc, hand[0] + s * .42, out), cy = hand[1] - s * .5 + (1 - out) * h * .95;   // it slides up out of the box
    const top = cy - h / 2, bot = Math.min(cy + h / 2, BTOP);   // the part still in the box is hidden
    if (bot - top < 4) return;
    boilSeed('d page');
    const sy = (bot - top) / h;
    push(); translate(cx, (top + bot) / 2);
    note(0, 0, s, { doodle: 'clawd', rot: (-.1 + .03 * Math.sin(lt * 6)) * out, sy, sw: .9, col: mixCol('#F3E6CC', NOTE, .6) });
    pop();
  }

  // dust drifting in the lamp's light
  function motes(lt) {
    boilSeed('d motes');
    const S = [];
    for (let i = 0; i < 12; i++) {
      const a = hash(i + 50) * TAU + lt * (.15 + .1 * hash(i)), d = 60 + 230 * hash(i + 60);
      const x = STK + 60 + Math.cos(a) * d * 1.3, y = DB - 150 + Math.sin(a) * d * .6 + 12 * Math.sin(lt * 1.3 + i);
      S.push([ellPts(x, y, 2.4, 2.4, 6), '#FFE9B8', 110 + 90 * Math.sin(lt * 2.2 + i * 1.7)]);
    }
    flats(S);
  }

  // ---------- notes flying off the stack over Clawd's shoulder ----------
  // In front of Clawd they are painted; once they pass behind it (k > .52) they are flat paper (cheap, and half hidden).
  function flyer(i, lt, front) {
    const k = (lt - FLY[i]) / FLIGHT; if (k <= 0 || k >= 1) return;
    if ((k < .52) !== front) return;
    const p = arcPt([STK + 6, DB - 12], [1225 + 50 * hash(i), GY + 10], 300, k);
    boilSeed('d fly' + i);
    push(); translate(p[0], p[1]); scale(.3 + .7 * Math.abs(Math.cos(k * 10 + i)), 1);   // it flutters (never quite edge-on)
    note(0, 0, 62, { rot: k * 5 * (i % 2 ? 1 : -1) - .3, key: i + 20, lines: 3, col: paperAt(p[0], p[1], .25), cheap: !front });
    pop();
  }
  // the thinking beat: three little cream dots rising by the hat (the stock 'dots' emote is ink, lost on the dark wall)
  function thinkDots(lt, x, y, s) {
    const age = lt - tThink - .05, out = 1 - seg(lt, tBox + .02, tBox + .12);
    if (age <= 0 || out <= 0) return;
    boilSeed('d dots');
    for (let i = 0; i < 3; i++) {
      const q = backOut(clamp((age - i * .09) / .13)) * out; if (q < .03) continue;
      const bob = Math.sin(lt * 6 + i * 1.4) * s * .1;
      paint(ellPts(x + (i - 1) * 1.25 * s, y - i * .45 * s + bob, .4 * s * q, .4 * s * q, 10), { wash: '#FFE9B8', ink: PAL.ink, sw: .7 });
    }
  }

  // ---------- the trail on the floor, leading off right ----------
  // Shot E's trail notes (notes_e.js), placed so that at the cut (t = 21.8, this camera: x − 1337.75, zoom 1) each lies
  // on screen where E draws it (E: zoom 1.5), at E's size, shape, tilt and squiggles, so the trail runs on through the
  // cut: [x, y, tilt, width, E's key]. Only the ones right of the desk; the trail ends where E's does.
  const TRAIL = [[1428.6, 926.1, .165, 104.4, 4], [1587.7, 926.8, -.19, 102.9, 3], [1729.2, 922.4, .218, 104, 2], [1895.4, 924.7, -.147, 104.8, 1], [2032.6, 923.1, .075, 99.7, 0]];
  // lying notes as shot E draws them: rotated in their plane, then squashed flat; a folded corner, two squiggles.
  // In passes: paper, outlines, squiggles. list: [{ x, y, s, r, col, key }]
  function lyingNotesE(list) {
    const SQ = .3, shape = n => {
      const w = n.s, h = n.s * 1.3, f = n.s * .2, T = p => { const q = rot2(p, n.r); return [n.x + q[0], n.y + q[1] * SQ]; };
      return { T, w, h, body: [[-w / 2, -h / 2], [w / 2 - f, -h / 2], [w / 2, -h / 2 + f], [w / 2, h / 2], [-w / 2, h / 2]].map(T), fold: [[w / 2 - f, -h / 2], [w / 2 - f, -h / 2 + f], [w / 2, -h / 2 + f]].map(T) };
    };
    const S = list.map(shape);
    flats(S.flatMap((q, i) => [[q.body, list[i].col], [q.fold, dark(list[i].col, .14)]]));
    S.forEach((q, i) => { boilSeed('d slip' + list[i].key); paint(q.body, { ink: PAL.ink, sw: .75 }); });
    S.forEach((q, i) => {
      const n = list[i]; boilSeed('d slipl' + n.key);
      for (let j = 0; j < 2; j++) {
        const yy = -q.h * .2 + j * q.h * .32, len = q.w * (.5 + .25 * hash(n.key * 7 + j)), P = [];
        for (let k = 0; k <= 4; k++) P.push(q.T([-q.w * .34 + len * k / 4, yy + Math.sin(k * 2.1 + j + n.key) * n.s * .06]));
        inkLine(P, .75, '#8E8272', 'inkfine', .4);
      }
    });
  }
  function trail(lt, vx0, vx1) {
    lyingNotesE(TRAIL.filter(([x, y]) => inView(x, y, 60)).map(([x, y, r, s, key]) => ({ x, y, r, s, key, col: paperAt(x, y, key === 3 ? .4 : .28) })));
    // one of them catches the lamp light
    const g = seg(lt, tGlint - .05, tGlint + .05) * (1 - seg(lt, tGlint + .35, tGlint + .7));
    if (g > 0) {
      const [x, y] = TRAIL[1];
      light(x, y - 4, 130, '#FFD27A', g);
      boilSeed('d glint');
      push(); translate(x + 14, y - 10); rotate(lt * 2); paint(starPts(0, 0, 38 * backOut(seg(lt, tGlint - .05, tGlint + .15)) * (1 - .6 * seg(lt, tGlint + .35, tGlint + .7)), .3, 4), { wash: '#FFF1C8', ink: PAL.ink, sw: .5 }); pop();
    }
  }

  // ---------- Clawd ----------
  function pose(t, lt) {
    const m = emotions(t, KEYS, { take: .75 });
    const o = { ...m, hat: 'fedora', boilKey: 'clawdD', seed: 4, noShadow: true };
    o.lookX = kf(lt, LOOKX); o.lookY = kf(lt, LOOKY);
    const reading = seg(lt, tRead + .12, tRead + .25) * (1 - seg(lt, tStop - .1, tStop));
    const wow = seg(lt, tWow + .05, tWow + .15) * (1 - seg(lt, tRead - .15, tRead - .05));   // the surprised hold: both arms tremble, out of step
    o.aL = kf(lt, AL) + .07 * Math.sin(TAU * 4.5 * lt) * reading + .03 * Math.sin(lt * 2.7) * (1 - seg(lt, tTurn0, tTurn1)) + .05 * Math.sin(lt * 8.3) * wow;
    let flick = 0; for (const f of FLY) flick += lt > f ? .45 * Math.exp(-(lt - f) * 10) : 0;
    o.aR = kf(lt, AR) + flick * reading + .12 * spring(lt, tLift1, 8, 20) + (lt > tGulp && lt < tBack0 ? .03 * Math.sin(lt * 40) : 0) + .07 * Math.sin(lt * 11 + 1) * wow;
    o.rot = kf(lt, ROT) + (m.rot || 0) * .5;
    o.dx = kf(lt, DXK) + (m.dx || 0);
    o.squint = Math.max(o.squint || 0, lt < tOn2 ? 1 : 1 - ease(seg(lt, tOn2 + .04, tOn2 + .2)));   // eyes adjusting to the light
    if (lt > tBlink && lt < tBlink + .08) o.squint = 1;   // a blink at the page, before the gulp
    const sink = ease(seg(lt, tGulp + .1, tGulp + .5)) * (1 - ease(seg(lt, tBack0, tBack0 + .2)));
    o.dy = (m.dy || 0) + .35 * sink; o.sq = (m.sq || 0) + .05 * sink;
    o.gloom = Math.max(m.gloom || 0, .85 * ease(seg(lt, tGulp + .05, tGulp + .5)) * (1 - ease(seg(lt, tDet, tDet + .25))));
    // head turns: 3/4 left at the drifts, 3/4 right at the towers, back to the desk; later, side view to hop off
    if (lt >= tLookL && lt < tFront + .2) Object.assign(o, lt < tLookR ? turn(lt, tLookL, tLookL + .12, 0, -.125) : lt < tFront ? turn(lt, tLookR, tLookR + .14, -.125, .125) : turn(lt, tFront, tFront + .12, .125, 0));
    if (o.flip) [o.aL, o.aR] = [o.aR, o.aL];   // facing left, the arm on the left (R) keeps the magnifier
    if (lt >= tTurn0) Object.assign(o, turn(lt, tTurn0, tTurn1, 0, .25));
    return o;
  }

  NOTES.D = (t, lt, dur) => {
    boilSeed('d dark');
    if (lt < tOn || (lt >= tOff && lt < tOn2)) { flat(rectPts(-60, -60, W + 120, H + 120), DARKNESS); return; }   // black: the lamp is off
    const o = pose(t, lt);
    // the hop: from behind the desk, up over the box and the desk's right-hand end, down onto the floor in front; then the
    // trot. It leads with x (fast out, slowing to land), so it is past the box before it comes down to the box's height.
    const hk = seg(lt, tHop0, tHop1), jp = jump(lt, tHop0, tHop1, 0);
    let x = CX, gy = GY, air = 0;
    if (lt >= tHop0) {
      x = lt < tHop1 ? lerp(CX, XL, 1 - (1 - hk) * (1 - hk)) : XL + VTROT * (lt - tHop1);
      gy = lt < tHop1 ? lerp(GY, FY, hk) : FY;
      air = lt < tHop1 ? HOPH * 4 * hk * (1 - hk) : 0;
    }
    const overBox = x + 3.1 * U > BXc - BHW && x - 3.1 * U < BXc + BHW;
    const inFront = lt >= tHop0 && (hk > .5 || gy - air < (overBox ? BTOP - 4 : DB - 6));   // behind the box until its feet clear it
    if (lt < tHop0 - .15) { o.dy = Math.max(o.dy || 0, -.15); o.sq = Math.max(o.sq || 0, -.2); }   // behind the desk: takes stretch, they don't lift (the desk hides its legs)
    o.sq = (o.sq || 0) + jp.sq * (1 - ease(seg(lt, tHop1 + .12, 6.02))); o.dy = (o.dy || 0) - air / U;   // the landing settle is spent by the cut
    if (lt >= tHop0) o.walk = 2.2 * (t - 21.0);
    if (lt >= tHop1) {   // settle into the trot pose that shot E picks up
      const k = ease(seg(lt, tHop1, tHop1 + .25)), f = feel('determined', t);
      o.rot = lerp(o.rot, f.rot || 0, k); o.dx = lerp(o.dx, f.dx || 0, k);
      o.noShadow = false;
    }

    // camera: on the desk; it follows each look (left at the drifts, right at the towers), comes back for the reading,
    // pushes in on the page and the face for the gulp, leans toward the floor at the glint, then tracks the trot
    const dc = kf(lt, [[0, [935, 600, 1.38]], [tOpen, [930, 599, 1.37]], [tLookR - .02, [870, 598, 1.33]], [tWow - .05, [1040, 594, 1.31]],
      [tWow + .15, [1035, 594, 1.31]], [tRead + .02, [975, 592, 1.3]], [tStop, [970, 590, 1.32]], [tBox, [1030, 588, 1.36]],
      [3.55, [1150, 590, 1.55]], [4.45, [1170, 585, 1.7]], [4.95, [1080, 598, 1.38]], [tGlint + .04, [1110, 612, 1.3]], [5.3, [1112, 610, 1.3]]]);
    const trackX = x - 190, kc = ease(seg(lt, 5.3, 6.0));
    const zoom = lerp(dc[2], 1, kc), cx = lerp(dc[0], trackX, kc), cy = lerp(dc[1], FY - 360, kc);
    camBegin(cx + 3 * Math.sin(lt * .7) * (1 - kc), cy + 2 * Math.sin(lt * .5) * (1 - kc), zoom);
    const vx0 = cx - 960 / zoom, vx1 = cx + 960 / zoom;
    VIEW = { x0: vx0, x1: vx1, y0: cy - 540 / zoom, y1: cy + 540 / zoom };

    room(lt, vx0, vx1);
    windowMoon(lt);
    towers(vx0, vx1);
    board();
    heap(1, 430, WALLB + 12, 300, 120, 10, vx0, vx1);
    heap(2, 1540, WALLB + 14, 260, 90, 8, vx0, vx1);
    heap(3, 2060, WALLB + 12, 340, 130, 10, vx0, vx1);
    heap(6, 1740, WALLB + 12, 220, 70, 6, vx0, vx1);
    for (let i = 0; i < FLY.length; i++) flyer(i, lt, false);
    if (!inFront) clawd(x, gy, U, o);   // behind the desk: the desk, drawn next, hides its legs
    desk();
    const mouth = lamp();
    deskStack(1, 632, 22, 78, .4);
    const top = deskStack(2, STK, 6, 86);
    boilSeed('d stack top');
    lyingNote(top[0], top[1] - 2, 70, .08, paperAt(top[0], top[1], .2), 2, .5);
    deskStack(3, 1374, 7, 64, -.5);   // low, so the hop clears it
    const open = lidOpen(lt);
    boxBack(open);
    page(lt, o);
    boxFront();
    for (let i = 0; i < FLY.length; i++) flyer(i, lt, true);
    heap(4, 470, 1010, 460, 140, 22, vx0, vx1, 3);
    heap(7, 560, FY + 8, 190, 60, 9, vx0, vx1);
    trail(lt, vx0, vx1);
    heap(5, 2330, 1015, 420, 120, 18, vx0, vx1, 2);
    // the lamp's light: a warm pool over the desk, the wall and Clawd
    boilSeed('d light');
    light(PX + 40, PY - 30, 540, '#FF9A48', .6, .8);
    light(STK + 10, DB - 10, 240, '#FFD27A', .8);
    light(mouth[0], mouth[1], 90, '#FFE9B8', 1);
    // the magnifier, over the desk (after the light, so its glass isn't blown out to a second bulb): at the tip of
    // whichever arm is on the left, or carried across the body over the turn to side view
    if (!inFront) {
      boilSeed('d magnifier');
      if (lt >= tTurn0 && lt < tCarry1) carried(x, gy, U, o, lt);
      else withArm(x, gy, U, o, o.flip ? 'R' : 'L', (u, sw) => magnifier(u, sw));
    }
    thinkDots(lt, x + (o.dx || 0) * U + 5.5 * U, gy + (o.dy || 0) * U - 9.5 * U, U * .9);
    if (inFront) {   // over the desk's end and onto the floor, then trotting off along the trail
      if (lt < tHop1) {   // its own shadow on the floor, growing as it comes down
        boilSeed('d hop shadow');
        const k = seg(hk, .55, 1);
        if (k > 0) paint(ellPts(x, FY + 4, U * 3.4 * (.5 + .5 * k), U * .8 * (.5 + .5 * k), 18), { wash: PAL.ink, washOp: 90 * k, ink: null });
      }
      clawd(x, gy, U, { ...o, armL: (u, sw) => magnifier(u, sw) });
    }
    motes(lt);
    const mScr = toScreen(mouth[0], mouth[1]), pScr = toScreen(895, 627);
    camEnd();

    // in: black; the lamp clicks on (a flicker), its light blooms out from it into a pool that takes in the lamp, the desk
    // and Clawd's face, holds while its eyes adjust, then the dark draws back to the corners, uncovering the drifts
    if (lt < tLit + .02) {
      boilSeed('d dark');
      const on = lt >= tOn && (lt < tOff || lt >= tOn2);
      if (!on) flat(rectPts(-60, -60, W + 120, H + 120), DARKNESS);
      else {
        const R0 = 60 * zoom, R1 = 300, R2 = 345, R3 = 1250, kb = lt < tOff ? 0 : easeOut(seg(lt, tOn2, tPool));
        const r = lt < tOff ? R0 : lt < tPool ? lerp(R0, R1, kb) : lt < tOpen ? lerp(R1, R2, seg(lt, tPool, tOpen)) : lerp(R2, R3, ease(seg(lt, tOpen, tLit)));
        const c = [lerp(mScr[0], pScr[0], kb), lerp(mScr[1], pScr[1], kb)], asp = lerp(1, 1.3, kb), w = 60 + r * .45;
        for (let j = 0; j < 3; j++) darkOutside(c[0], c[1], r + w * j / 2, DARKNESS, j === 2 ? 255 : 105, asp);
        light(mScr[0], mScr[1], 90 * zoom, '#FFE3A0', 1 - ease(seg(lt, tOpen, tLit)));   // the bulb's first flare settles
      }
    }
  };
})();
