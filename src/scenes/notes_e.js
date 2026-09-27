// notes_e.js: shot E of "The Notes They Left Behind" (see STORYBOARD.md). Uses the shared pieces in NOTES (notes.js).
//   THEY FOLLOWED THE NOTES (21.8–30). Night lifting to dawn. Clawd, fedora on and magnifier held low, trots right along a
//   trail of notes lying on the floor; each one lights up as the magnifier passes over it. The dark lifts: it is the attic
//   wall of shot A, its clothesline empty now, only pegs, except one note still pinned at the far end, which catches the
//   first light. Clawd stops under it (surprised), crouches, hops and takes it down (the line springs up, the empty peg
//   wobbles), lands holding it, turns to the front and reads it (a little drawing of an agent), looks back over its
//   shoulder along the glowing trail it followed, and back to the note: hopeful. Iris out to black.
//   The ending rhymes with shot A: the same wall, line and framing; dusk then, dawn now; the agent hopped to pin it, Clawd
//   hops to unpin it.
//   Seam in (cut on action from D): at lt = 0 Clawd trots right in side view, ground point at screen (1150, 900),
//   u × zoom = 26, fedora, magnifier in the near arm (aL .15), feel('determined', t), walk = 2.2 (t − 21).
(() => {
  const { NOTE, flat, note, magnifier, lineY, PAGES, LAST, FLOOR, NS, pinned, dark, rot2 } = NOTES;
  const T0 = NOTES.START.E;

  // ---------- scale and places, in the attic's world px (shot A's) ----------
  const Z = 1.5, U = 26 / Z, STRIDE = 2.2 * U;   // Clawd's unit in the world; its stride per leg cycle (the feet don't slide)
  const XS = 1477;                                 // where Clawd stops: under the far end of the line, just left of the note
  const LENS = 5.8 * U;                            // the magnifier's lens, ahead of Clawd's feet while it trots
  const NIGHTC = '#1F2049', FLOORNOTE = '#E6D8BC', LITNOTE = '#FFF3D2', GLOWC = '#FFD98E';
  const GRIP = [25, -38];                          // the held note's centre, from the hand (it holds the bottom-left corner)

  // ---------- timing, in shot time ----------
  // The reads: trot along the trail (0–2.56, it pulls up at 24.36) → STOP, then the first light finds the one note left
  // on the line (2.71) → Clawd looks up (2.84, held) → take (3.3; the surprised face holds ~.65 s) → determined (4.02) →
  // crouch, hop, unpin (4.16–4.78) → turn front and READ it (5.14–6.1, the camera lands at 5.62 and holds) → LOOK BACK
  // along the trail it followed (6.1–6.92: the camera pulls out left, a light runs back along the notes) → back to the
  // note, hopeful (7.06) → iris (7.0–7.48), hold (a blink), shut by 8.15.
  const tUp = .7, RATE = 3.0, tDec = 1.95;         // the trot quickens from shot D's 2.2 leg cycles a second, then slows
  const tRay = 2.71, tLook = 2.84, tTurnQ = 3.26, tTake = 3.3, tDet = 4.02;
  const tHop0 = 4.28, tHop1 = 4.78, HOPH = 2.7, tGrab = 4.5, tRel = 4.63;
  const tFront0 = 5.14, tFront1 = 5.3, tThink = 5.34, tBack0 = 6.1, tBack1 = 6.24, tRet0 = 6.92, tRet1 = 7.06, tHope = 7.06;
  const tIris0 = 7.0, tIris1 = 7.48, tShut0 = 7.95, tShut1 = 8.15;
  const WAVEV = 950;                               // how fast the light runs back along the trail (world px/s)

  // the trot, in closed form: leg phase → position (x follows the phase, so the feet never skate). It ends on a phase
  // where all four feet are down (≡ .25 mod .5), so the stop needs no leg pop.
  const P0 = 2.2 * (T0 - 21.0);
  const P1 = P0 + 2.2 * tUp + (RATE - 2.2) * tUp * .5, P2 = P1 + RATE * (tDec - tUp);
  const PE = .25 + .5 * Math.ceil((P2 + RATE * .25 - .25) / .5), TD = 2 * (PE - P2) / RATE, tStop = tDec + TD;
  function phase(lt) {
    if (lt <= 0) return P0 + 2.2 * lt;
    if (lt <= tUp) { const X = lt / tUp; return P0 + 2.2 * lt + (RATE - 2.2) * tUp * (X ** 3 - X ** 4 / 2); }
    if (lt <= tDec) return P1 + RATE * (lt - tUp);
    if (lt <= tStop) { const s = lt - tDec; return P2 + RATE * s - RATE * s * s / (2 * TD); }
    return PE;
  }
  function rate(lt) {
    if (lt <= 0) return 2.2;
    if (lt <= tUp) return 2.2 + (RATE - 2.2) * ease(lt / tUp);
    if (lt <= tDec) return RATE;
    return Math.max(0, RATE * (1 - (lt - tDec) / TD));
  }
  const clawdX = lt => XS - STRIDE * (PE - phase(lt));

  // the trail of notes on the floor, and when the lens passes over each one: the last lights .35 s before the stop, and
  // the spacing puts the three the lens passes in this shot about a second apart (22.17, 23.16, 24.01)
  const TRAIL = [];
  {
    const last = clawdX(tStop - .35) + LENS;
    for (let i = 0, x = last; x > 380; i++) { TRAIL.push({ i, x, y: FLOOR + 11 + 7 * hash(i + 3), r: (hash(i + 11) - .5) * .5, s: 62 + 8 * hash(i + 5) }); x -= 90 + 22 * hash(i + 17); }
    for (const n of TRAIL) {   // solve clawdX(tp) + LENS = x (clawdX rises monotonically)
      let a = -30, b = tStop;
      for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (clawdX(m) + LENS < n.x) a = m; else b = m; }
      n.tp = (a + b) / 2;
      n.tw = n.x < XS ? tBack1 + .06 + (XS - n.x) / WAVEV : Infinity;   // when the look-back's light reaches it
    }
  }

  // emotions (video time) and acting channels (shot time)
  const KEYS = [[-6, 'determined'], [tTake, 'surprised', { emote: null }], [tDet, 'determined'], [tThink, 'thinking', { emote: null }],
    [tHope, 'hopeful']].map(([k, n, o]) => [k + T0, n, o]);
  // (the look-back: the eyes glance left first, in the front view; the view flips to face left at tBack0 + .07, where
  // lookX changes sign, and they aim down at the trail on the floor)
  const LOOKX = [[0, 0], [.5, .25], [tLook, .25], [tLook + .08, .6], [tHop1, .6], [tHop1 + .2, .45], [tFront0, .45], [tFront1, .75],
    [tBack0 - .12, .75], [tBack0 - .03, -.9], [tBack0 + .065, -.9], [tBack0 + .075, 1], [tRet0, 1], [tRet1, .7]];
  const LOOKY = [[0, 0], [.5, .35], [tLook, .35], [tLook + .08, -1], [tHop0 + .1, -1], [tHop1, -.5], [tFront1, -.45], [tBack0 - .12, -.45],
    [tBack0 - .03, .2], [tBack0 + .3, .85], [tRet0, .85], [tRet1, -.3]];
  // the magnifier arm and the note arm (whichever hand they are in). On the take the magnifier is flung up while still
  // in the side view, so it is already high when the view changes to 3/4 and the hand moves to Clawd's left side.
  const MAG = [[0, .15], [tTurnQ - .1, .15], [tTurnQ + .05, 1.35], [tTake + .12, 1.0], [tTake + .42, -.3], [tHop0 - .12, -.25], [tHop0 + .15, -.85], [tHop1, -.2],
    [tHop1 + .15, -.55], [tFront0, -.45], [tBack0, -.4], [tRet1, -.45]];
  const NOTEA = [[0, -.3], [tTurnQ, -.3], [tTake + .06, 1.0], [tTake + .4, .25], [tHop0 - .12, -.45], [tHop0 + .19, 1.1], [tRel, 1.12],
    [tHop1, 1.25], [tHop1 + .12, .95], [tHop1 + .3, 1.05], [tFront0, 1.0], [tFront1 + .1, .95]];

  // ---------- small helpers ----------
  // Light, added like glow() (same falloff, same boil), as one fan of triangles whose vertex colours fall off with the
  // radius: a single flat pass, several times cheaper than glow()'s tinted texture without a GPU (from shot D).
  // a may go up to 1.9 (brighter than glow() allows), for the look-back's flare along the trail.
  // noFlush: the caller has flushed the brush layer already (several lights in a row).
  const FALL = [[0, 1], [.18, .8], [.45, .32], [.75, .08], [1, 0]];
  function light(x, y, r, col, a = 1, sy = 1, noFlush = false) {
    if (a <= 0 || r < 1) return;
    if (!noFlush) flushBrush();
    const c = color(col), rr = r * (1 + jit(.03)), k = .59 * clamp(a, 0, 1.9), n = 30, cr = red(c), cg = green(c), cb = blue(c);
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
  // Speed: p5.brush composites its pending work every time the brush colour changes, and every flat() flushes it; each
  // composite stalls the software GL. So repeated small things are drawn in passes: their paper as flat colour after ONE
  // flush, then all their outlines in one ink colour, then all their marks in one colour.
  function flats(list) {
    flushBrush(); noStroke();
    for (const [pts, col, a] of list) { const c = color(col); c.setAlpha(a ?? 255); fill(c); beginShape(); for (const [x, y] of pts) vertex(x, y); endShape(CLOSE); }
  }
  // everything OUTSIDE a ragged circle, in flat colour (a cheap iris: a p5 shape with a hole)
  function darkOutside(cx, cy, r, col, a = 255) {
    flushBrush(); noStroke(); const c = color(col); c.setAlpha(a); fill(c);
    beginShape();
    vertex(-200, -200); vertex(W + 200, -200); vertex(W + 200, H + 200); vertex(-200, H + 200);
    beginContour();
    for (let i = 0; i < 56; i++) { const q = -i / 56 * TAU, rr = r * (1 + .025 * Math.sin(i * 1.7) + .018 * Math.sin(i * .6 + 1) + jit(.006)); vertex(cx + Math.cos(q) * rr, cy + Math.sin(q) * rr); }
    endContour();
    endShape(CLOSE);
  }
  // a clothes-peg in any colour (NOTES.peg's shape), so the last one can sit in the dark
  function peg2(x, y, s, rot, col) {
    push(); translate(x, y); rotate(rot);
    paint(rrPts(-s * .22, -s * .55, s * .44, s * 1.1, s * .15), { wash: col, ink: PAL.ink, sw: clamp(s / 30, .3, .8) });
    inkLine([[0, -s * .5], [0, s * .5]], clamp(s / 40, .25, .6), dark(col, .4), 'inkfine', 0);
    pop();
  }
  // the empty pegs along the line, in three passes (wood, outlines, the split down the middle): [[x, y, rot], ...]
  const PEG = '#C99A6A';
  function pegRow(list, s = 28) {
    const at = (x, y, r) => p => { const q = rot2(p, r); return [x + q[0], y + q[1]]; };
    const body = list.map(([x, y, r]) => rrPts(-s * .22, -s * .55, s * .44, s * 1.1, s * .15).map(at(x, y, r)));
    flats(body.map(b => [b, PEG]));
    list.forEach((q, i) => { boilSeed('e peg' + i); paint(body[i], { ink: PAL.ink, sw: clamp(s / 30, .3, .8) }); });
    list.forEach(([x, y, r], i) => { boilSeed('e pegl' + i); inkLine([[0, -s * .5], [0, s * .5]].map(at(x, y, r)), clamp(s / 40, .25, .6), dark(PEG, .4), 'inkfine', 0); });
  }
  // notes lying on the floor: each rotated in its plane, then squashed flat, with a folded corner and two squiggles.
  // list: [{ x, y, s, r, col, key }]. Drawn in passes: paper, outlines, squiggles.
  function lyingNotes(list) {
    const SQ = .3, shape = n => {
      const w = n.s, h = n.s * 1.3, f = n.s * .2, T = p => { const q = rot2(p, n.r); return [n.x + q[0], n.y + q[1] * SQ]; };
      return { T, w, h, body: [[-w / 2, -h / 2], [w / 2 - f, -h / 2], [w / 2, -h / 2 + f], [w / 2, h / 2], [-w / 2, h / 2]].map(T), fold: [[w / 2 - f, -h / 2], [w / 2 - f, -h / 2 + f], [w / 2, -h / 2 + f]].map(T) };
    };
    const S = list.map(shape);
    flats(S.flatMap((q, i) => [[q.body, list[i].col], [q.fold, dark(list[i].col, .14)]]));
    S.forEach((q, i) => { boilSeed('e slip' + list[i].key); paint(q.body, { ink: PAL.ink, sw: .5 }); });
    S.forEach((q, i) => {
      const n = list[i]; boilSeed('e slipl' + n.key);
      for (let j = 0; j < 2; j++) {
        const yy = -q.h * .2 + j * q.h * .32, len = q.w * (.5 + .25 * hash(n.key * 7 + j)), P = [];
        for (let k = 0; k <= 4; k++) P.push(q.T([-q.w * .34 + len * k / 4, yy + Math.sin(k * 2.1 + j + n.key) * n.s * .06]));
        inkLine(P, .5, '#8E8272', 'inkfine', .4);
      }
    });
  }
  // dust in the dawn light (NOTES.motes' drift), as flat specks for a flats() batch
  function motes2(t, k, x0, x1) {
    boilSeed('e motes');
    const L = [];
    for (let i = 0; i < 18; i++) {
      const x = x0 + (x1 - x0) * hash(i + 40) + 30 * Math.sin(t * .4 + i), y = 120 + 700 * frac(hash(i + 60) - t * .02 * (1 + hash(i)));
      L.push([ellPts(x, y, 2.4, 2.4, 6), mixCol(PAL.cream, '#FFD9A0', k), (150 + 80 * Math.sin(t * 2 + i)) * k]);
    }
    return L;
  }
  // Clawd's arm transforms (as clawd() does them), for where a hand is in the world
  function armTip(x, y, u, o, which, ext = 0) {   // ext: that far further out along the hook's +x (2.8: the lens centre)
    const V = VIEWS[o.view] || VIEWS.front, A = V.arms.find(q => q[2] === which); if (!A) return [x, y];
    const [px, dir] = A, a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), sq = (o.sq || 0) + (o.take || 0), sm = clamp(o.smear || 0);
    let p;
    if (dir === 0) { p = rot2([(2.1 + ext) * u, 0], .7 - a); p[1] += .3 * u; } else p = rot2([dir * (2.2 + ext) * u, 0], dir < 0 ? a : -a);
    p = [p[0] + (px + dir * .55 * clamp((Math.abs(a) - .7) / .9)) * u, p[1] - 4.5 * u];
    p = [p[0] * (o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35), p[1] * (o.sy ?? 1) * (1 - sq)];
    p = rot2(p, o.rot || 0);
    return [x + (o.dx || 0) * u + p[0], y + (o.dy || 0) * u + p[1]];
  }
  // An arm hook that undoes the arm's and the body's transforms, so what it draws sits upright and unsquashed at the hand
  // (the note must not tumble with the arm or mirror when Clawd turns).
  function uprightHook(o, which, fn) {
    return (u, sw) => {
      const V = VIEWS[o.view] || VIEWS.front, A = V.arms.find(q => q[2] === which), dir = A[1];
      const a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), sq = (o.sq || 0) + (o.take || 0), sm = clamp(o.smear || 0);
      push();
      if (dir < 0) scale(-1, 1);
      rotate(dir < 0 ? -a : dir > 0 ? a : -(.7 - a));
      scale(1 / ((o.flip ? -1 : 1) * (o.sx ?? 1) * (1 + sq * .6) * (1 + sm * .35)), 1 / ((o.sy ?? 1) * (1 - sq)));
      rotate(-(o.rot || 0));
      fn(u, sw);
      pop();
    };
  }

  // ---------- the attic (NOTES.attic, copied so it can skip what's out of view and lay its flat areas in one batch) ----------
  // At k = 1 the palette is shot E's own dawn: the wall and the window pushed from A's dusty pink toward rose and apricot.
  const WIN = { x: 1480, y: 170, w: 240, h: 220 };
  const wallCol = k => mixCol('#8E7C93', '#CFA296', k);
  function attic2(t, k, x0, x1, y0, y1) {
    const wall = wallCol(k), shade = mixCol('#6E5C78', '#AE7F84', k), fl = mixCol('#5E4A5C', '#8E6460', k);
    const L = [];
    boilSeed('wall');
    L.push([rectPts(x0, y0 - 60, x1 - x0, FLOOR - y0 + 60), wall]);
    for (let i = Math.floor(x0 / 420) - 1; i < x1 / 420 + 1; i++) {   // big soft stains in the plaster, stable per panel
      boilSeed('plaster' + i);
      L.push([ellPts(i * 420 + 200 * hash(i), 150 + 500 * hash(i + 9), 180 + 90 * hash(i + 3), 120 + 60 * hash(i + 5), 16, 6, hash(i) * 3), shade, 45]);
    }
    boilSeed('floor');
    L.push([rectPts(x0, FLOOR, x1 - x0, 400), fl], [rectPts(x0, FLOOR - 26, x1 - x0, 30), mixCol('#4B3A4E', '#6E4F55', k)]);
    const { x: wx, y: wy, w: ww, h: wh } = WIN, winIn = wx - 30 < x1 && wx + ww + 30 > x0 && wy - 30 < y1 && wy + wh + 30 > y0;
    boilSeed('window');
    if (winIn) L.push([rectPts(wx - 18, wy - 18, ww + 36, wh + 36, 2), mixCol('#5C4450', '#8A5A50', k)], [rectPts(wx, wy, ww, wh * .55, 2), mixCol('#6A5C9C', '#EE857E', k)],
      [rectPts(wx, wy + wh * .5, ww, wh * .5, 2), mixCol('#D98A6A', '#FFAC84', k)]);
    flats(L);
    // the window's light (it reaches down the wall even when the window itself is out of view)
    light(wx + ww / 2, wy + wh * .7, 150 + 120 * k, mixCol('#FF9F6A', '#FF9C7A', k), .35 + .3 * k, 1, true);
    if (winIn) {
      boilSeed('window ink');
      inkLine(rectPts(wx - 18, wy - 18, ww + 36, wh + 36, 2).concat([[wx - 18, wy - 18]]), 1, dark(mixCol('#5C4450', '#8A6456', k), .28), 'dry', .2);
      paint(rectPts(wx - 18, wy - 18, ww + 36, wh + 36, 2), { ink: PAL.ink, sw: 1 });
      inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 1.2, PAL.ink, 'ink', 0);
      inkLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 1.2, PAL.ink, 'ink', 0);
      paint(rectPts(wx, wy, ww, wh), { ink: PAL.ink, sw: 1 });
    }
    boilSeed('floor ink');
    inkLine([[x0, FLOOR - 26], [x1, FLOOR - 27]], 1, PAL.ink, 'ink', 0);
    inkLine([[x0, FLOOR + 4], [x1, FLOOR + 3]], .8, PAL.ink, 'ink', 0);
    for (let i = Math.floor(x0 / 300); i < x1 / 300; i++) inkLine([[i * 300 + 90 * hash(i), FLOOR + 30], [i * 300 + 90 * hash(i) + 140, FLOOR + 32]], .5, mixCol('#5E4A5C', PAL.ink, .3), 'inkfine', 0);
  }

  // ---------- the clothesline's last stretch: tugged down by the grab, then it springs up when the note comes free ----------
  function lineLift(lt) {
    if (lt < tGrab) return 0;
    if (lt < tRel) return -7 * ease(seg(lt, tGrab, tRel));
    const a = lt - tRel; return 4 - 11 * Math.exp(-3.6 * a) * Math.cos(13 * a);
  }
  const liftAt = (x, lift) => x > LAST - 300 ? lift * Math.sin(Math.PI * clamp((x - (LAST - 300)) / 435)) : 0;
  // NOTES.clothesline's line, but only the part in view and in canvas-sized pieces: one 1840 px stroke collapses to a
  // dot once the camera zooms in past ~1.6 (a p5.brush quirk)
  const LX0 = -120, LX1 = 1720;   // the line's ends, as in notes.js
  function clothesline2(lift, vx0, vx1) {
    boilSeed('line');
    const yAt = x => lineY(x) - liftAt(x, lift);
    const a = Math.max(LX0, LX0 + Math.floor((vx0 - 100 - LX0) / 80) * 80), b = Math.min(LX1, vx1 + 100);
    const P = []; for (let x = a; x < b; x += 80) P.push([x, yAt(x)]); P.push([b, yAt(b)]);
    // pieces of up to 7 points that share their end points. A 2-point piece draws nothing (a spline needs 3), so a lone
    // leftover point joins the piece before it, and a line only 2 points long gets a midpoint.
    for (let i = 0; i < P.length - 1;) {
      let C = P.slice(i, i + 7);
      if (P.length - (i + 7) === 1) C = P.slice(i);
      if (C.length === 2) C = [C[0], [(C[0][0] + C[1][0]) / 2, (C[0][1] + C[1][1]) / 2], C[1]];
      inkLine(C, .9, mixCol(PAL.ink, '#8C6A5A', .3), 'ink', .5);
      i += C.length === P.length - i ? P.length : 6;
    }
    if (LX1 < vx1 + 50) paint(ellPts(LX1, lineY(LX1), 7, 7, 8), { wash: '#8A8A96', ink: PAL.ink, sw: .6 });   // the nail
  }

  // ---------- Clawd ----------
  function pose(t, lt) {
    const m = emotions(t, KEYS, { take: .6 });
    const o = { ...m, hat: 'fedora', boilKey: 'clawdE', seed: 4 };
    o.lookX = kf(lt, LOOKX); o.lookY = kf(lt, LOOKY);
    // the magnifier sweeps a little over the floor as it trots
    const scan = seg(lt, .15, .7) * (1 - seg(lt, tDec, tStop));
    const mag = kf(lt, MAG) + .07 * Math.sin(lt * 5.2) * scan, na = kf(lt, NOTEA) + .04 * Math.sin(lt * 2.4) * seg(lt, tHop1 + .4, tHop1 + .8);
    // a bob with the stride, fading in after the cut and out as it slows; it leans back as it pulls up
    const bob = -.22 * Math.abs(Math.sin(TAU * phase(lt))) * seg(lt, 0, .45) * rate(lt) / RATE;
    const brake = -.08 * Math.sin(Math.PI * seg(lt, tStop - .45, tStop + .25));
    // it looks up at the light: the eyes go first, then it tips right back and stretches a little, and holds it
    const up = ease(seg(lt, tLook + .03, tLook + .17)) * (1 - ease(seg(lt, tTake - .02, tTake + .12)));
    const lookBack = ease(seg(lt, tBack0, tBack1 + .12)) * (1 - ease(seg(lt, tRet0 - .05, tRet1)));             // leans toward the trail
    const hop = jump(lt, tHop0, tHop1, HOPH);
    o.dy = (m.dy || 0) + bob + hop.dy; o.sq = (m.sq || 0) + hop.sq - .05 * up + .04 * lookBack;
    o.rot = (m.rot || 0) + brake - .15 * up - .15 * lookBack;
    o.dx = (m.dx || 0) - .75 * lookBack;
    // views: side while it trots; 3/4 on the take (toward the note); front to read; 3/4 left to look back; front
    let v = { view: 'side', flip: false, smear: 0 };
    if (lt >= tTurnQ) v = turn(lt, tTurnQ, tTurnQ + .12, .25, .125);
    if (lt >= tFront0) v = turn(lt, tFront0, tFront1, .125, 0);
    if (lt >= tBack0) v = turn(lt, tBack0, tBack1, 0, -.125);
    if (lt >= tRet0) v = turn(lt, tRet0, tRet1, -.125, 0);
    Object.assign(o, v);
    o.walk = o.view === 'side' ? phase(lt) : null;
    // hands: the magnifier stays in L (the near arm in side view), the note goes in R; facing left, they swap sides
    if (o.flip) { o.aL = na; o.aR = mag; } else { o.aL = mag; o.aR = na; }
    // a blink in the last hold
    o.squint = Math.max(o.squint || 0, kf(lt, [[7.64, 0], [7.69, 1], [7.76, 1], [7.82, 0]]));
    return o;
  }

  // the iris: closes onto Clawd and the note, holds (a slight breath), then shuts
  const IRIS_R = 352;
  const irisR = lt => lt < tIris1 ? lerp(1200, IRIS_R, ease(seg(lt, tIris0, tIris1))) : lt < tShut0 ? IRIS_R + 5 * Math.sin((lt - tIris1) * 5) : lerp(IRIS_R, 0, easeIn(seg(lt, tShut0, tShut1)));

  NOTES.E = (t, lt, dur) => {
    NOTES.resetAgents();
    if (lt > tShut0 && irisR(lt) < 6) { boilSeed('e iris'); flat(rectPts(-60, -60, W + 120, H + 120), PAL.ink); return; }   // shut: black
    const o = pose(t, lt), x = clawdX(lt), gy = FLOOR;
    const k = ease(seg(lt, .2, 4.2));                                   // dusk palette → dawn palette
    const night = .86 * (1 - ease(seg(lt, .1, 3.0)));                    // the dark lifting
    const lift = lineLift(lt);

    // camera: tracks Clawd from the cut (the same speed), runs a little ahead (it looks where Clawd is going), and settles
    // on shot A's last framing as Clawd pulls up; then it drifts, and pushes in on Clawd and the note for the ending
    const lead = .42 * ease(seg(lt, 0, 1.3));
    let cx = clawdX(lt + lead) - 190 / Z, cy = lerp(FLOOR - 360 / Z, 660, ease(seg(lt, .3, 2.9))), zoom = Z;
    cx += 5 * Math.sin(Math.max(0, lt - 2.6) * .6) * seg(lt, 2.6, 3.6);
    // the ending: in on Clawd and the note, landing before it reads and holding while it does; out and to the left along
    // the trail as Clawd looks back (8–9 notes in frame); then in on the iris framing (Clawd's face and the note)
    const irisW = [XS + 2.4 * U, FLOOR - 7.3 * U];
    if (lt > 4.9) {
      [cx, cy, zoom] = kf(lt, [[4.9, [cx, cy, Z]], [5.62, [1528, 792, 2.1]], [6.12, [1521, 794, 2.13]], [6.78, [1296, 786, 1.74]],
        [6.96, [1287, 787, 1.745]], [7.44, [irisW[0], irisW[1], 2.35]]]);
      zoom += .04 * ease(seg(lt, 7.44, 8.15));                          // a last slow push through the hold
    }
    camBegin(cx, cy, zoom);
    const vx0 = cx - 960 / zoom, vx1 = cx + 960 / zoom, vy0 = cy - 540 / zoom, vy1 = cy + 540 / zoom;

    // the attic: wall and window, the empty line with its empty pegs
    attic2(t, k, vx0 - 40, vx1 + 40, vy0, vy1);
    clothesline2(lift, vx0, vx1);
    pegRow(PAGES.map((px, i) => [px, lineY(px) - liftAt(px, lift), (.04 * Math.sin(t * 1.3 + i * 1.7) + (hash(i + 5) - .5) * .12) * .5]).filter(([px]) => px > vx0 - 40 && px < vx1 + 40));
    // dust in the dawn light, then night: a flat indigo wash of dark over the room, lifting (a little thinner on the floor,
    // so the floor separates from the wall)
    boilSeed('e night');
    const L = motes2(t, k, 900, 2000);
    if (night > .005) L.push([rectPts(vx0 - 60, vy0 - 60, vx1 - vx0 + 120, FLOOR - 26 - vy0 + 60), NIGHTC, 255 * night],
      [rectPts(vx0 - 60, FLOOR - 26, vx1 - vx0 + 120, vy1 - FLOOR + 86), NIGHTC, 255 * night * .8]);
    flats(L);
    // light (all after that one flush): dawn pouring in from the window, the first of it catching the one note left on
    // the line, and the glow of each note on the floor that the lens has passed over
    boilSeed('e dawn');
    light(1600, 330, 820, '#FF9F8A', .3 * k, .85, true);
    const ray = ease(seg(lt, tRay, tRay + .3)) * (1 - .55 * ease(seg(lt, 3.9, 4.7)));
    const pn = pinned(), pinY = pn[1] - liftAt(LAST, lift);
    if (ray > 0) light(LAST, pinY, 190, '#FFE0A6', .9 * ray, 1, true);
    // the trail: dim notes on the floor; each lights up as the lens passes over it and keeps a soft glow; when Clawd looks
    // back, a light runs back along them, each flaring and glinting in turn
    const dimCol = mixCol(FLOORNOTE, NIGHTC, night * .9), slips = [];
    TRAIL.forEach(n => {
      if (n.x < vx0 - 80 || n.x > vx1 + 80) return;
      // (the ones the lens passed before the cut stay dim, as shot D left them, until the look-back's light reaches them)
      const a = lt - n.tp, on = n.tp < 0 ? .55 * ease(seg(lt - n.tw, -.05, .12)) : ease(seg(a, -.06, .08)), lit = n.tp < 0 ? on : on * (1 - .45 * ease(seg(a, .15, 1.1)));
      const flash = seg(a, -.06, .04) * (1 - ease(seg(a, .04, .55)));                              // the moment it lights
      const aw = lt - n.tw, wave = seg(aw, -.05, .03) * (1 - ease(seg(aw, .03, .5)));             // the look-back's light
      boilSeed('e trail' + n.i);
      const g = Math.min(1, lit * (.55 + .45 * night) + .7 * flash) + .9 * wave;
      if (g > .01) light(n.x, n.y, n.s * (1.25 + .5 * flash + .7 * wave), GLOWC, g, .55, true);
      slips.push({ ...n, key: n.i, col: mixCol(mixCol(dimCol, LITNOTE, lit), '#FFFBEA', .6 * flash + .8 * wave), a, aw });
    });
    lyingNotes(slips);
    slips.forEach(n => {   // a glint as each one lights, and again as the look-back's light reaches it
      for (const [a, w] of [[n.a, ''], [n.aw, 'w']]) {
        if (!(a >= -.04 && a <= .45)) continue;
        boilSeed('e glint' + w + n.i);
        const g = backOut(seg(a, -.04, .12)) * (1 - ease(seg(a, .2, .45)));
        push(); translate(n.x + n.s * .18, n.y - 8); rotate(a * 3);
        paint(starPts(0, 0, 32 * g, .3, 4), { wash: '#FFF0B4', ink: PAL.ink, sw: .45 }); pop();
      }
    });

    // the first note: pinned on the line, unseen in the dark until the first light finds it (a flat of the wall's own
    // colour over it: its peg shows, like every other empty peg), then tugged, then in Clawd's hand
    boilSeed('e first note');
    const noteDim = mixCol(NOTE, NIGHTC, night), noteCol = mixCol(noteDim, '#FFF8E6', .5 * ray);
    const sway = .02 + .018 * Math.sin(t * 1.4), hide = .97 * (1 - ease(seg(lt, tRay - .02, tRay + .24)));
    if (lt < tRel) {
      let np = [pn[0], pinY];
      if (lt >= tGrab) {   // pulled toward the hand, which has hold of its corner
        const h = armTip(x, gy, U, o, o.flip ? 'L' : 'R');
        np = [lerp(np[0], h[0] + GRIP[0], seg(lt, tGrab, tRel)), lerp(np[1], h[1] + GRIP[1], seg(lt, tGrab, tRel))];
      }
      note(np[0], np[1], NS, { rot: sway, key: 9, doodle: 'agent', col: noteCol });
      if (hide > .005) {
        const w = NS / 2 + 4, h = NS * .65, cover = [[-w, -h - 2.5], [w, -h - 2.5], [w, h + 4], [-w, h + 4]].map(p => { const q = rot2(p, sway); return [np[0] + q[0], np[1] + q[1]]; });
        flat(cover, mixCol(wallCol(k), NIGHTC, night), 255 * hide);
      }
    }
    // its peg (drawn over Clawd for a moment after the release, so the note leaves from under its jaws)
    const pw = lt < tRel ? 0 : .5 * spring(lt, tRel, 4.5, 17), pegLate = lt >= tRel && lt < tRel + .2;
    const lastPeg = () => { boilSeed('e last peg'); peg2(LAST, lineY(LAST) + 2 - liftAt(LAST, lift), 26, .03 + pw, mixCol('#C99A6A', NIGHTC, night * .9)); };
    if (!pegLate) lastPeg();

    // Clawd: the magnifier in one hand; after the grab, the note in the other
    const nrot = lt < tRel ? sway : sway + .22 * spring(lt, tRel, 5, 15) - .12 * spring(lt, tHop1, 6, 18) + .03 * Math.sin(lt * 2.1);
    const noteHook = uprightHook(o, o.flip ? 'L' : 'R', () => {
      push(); rotate(nrot * .6); note(GRIP[0], GRIP[1], NS, { rot: nrot * .4, key: 9, doodle: 'agent', col: mixCol(NOTE, '#FFF8E6', .25) }); pop();
    });
    // On the turn to 3/4 at the take the hand swings from Clawd's front (side view) to its left flank (3/4) in one frame:
    // for that stretch the lens is a smear drawing along the path, drawn after Clawd, instead of a crisp jump.
    const ks = seg(lt, tTurnQ + .01, tTurnQ + .11), smearing = ks > 0 && ks < 1;
    const magHook = (u, sw) => magnifier(u, sw);
    o.armL = o.flip ? (lt >= tRel ? noteHook : null) : smearing ? null : magHook;
    o.armR = o.flip ? magHook : (lt >= tRel ? noteHook : null);
    clawd(x, gy, U, o);
    if (smearing) {
      boilSeed('e lens smear');
      const S = { ...o, view: 'side', flip: false, smear: 0 }, Q = { ...o, view: 'q', flip: false, smear: 0 };
      NOTES.lensSmear(armTip(x, gy, U, S, 'L', 2.8), armTip(x, gy, U, Q, 'L', 2.8), ease(ks), U, 1.2 * U, clamp(U / 15, .45, 2.4));
    }
    if (pegLate) lastPeg();

    // painted marks, on the note's side of the hat: the take's "!" and the reading dots (these pop quicker than the
    // emote's own cycle, so all three are up and held before the look-back)
    boilSeed('e emotes');
    const hy = gy + (o.dy || 0) * U, bang = seg(lt, tTake + .05, tTake + .3) * (1 - seg(lt, tDet - .1, tDet + .1));
    if (bang > .01) emote('!', x + 3.4 * U, hy - 12.4 * U, U * .95, bang, lt - tTake);
    const dots = seg(lt, tThink - .06, tThink + .1) * (1 - seg(lt, tBack0 - .06, tBack0 + .06));
    if (dots > .01) emote('dots', x + 2.6 * U, hy - 12.1 * U, U * 1.1, dots, Math.min(1.75, (lt - tThink + .06) * 3));
    const irisC = toScreen(irisW[0], irisW[1]);
    camEnd();

    // out: an iris onto Clawd and the note; it holds, then shuts. It comes in from the frame's corners (centred on the
    // frame) and slides onto Clawd as it closes, while the camera, still pushing in from the look-back, lands there too.
    if (lt > tIris0) {
      boilSeed('e iris');
      const r = irisR(lt), kc = ease(seg(lt, tIris0, tIris1 - .05)), ic = [lerp(W / 2, irisC[0], kc), lerp(H / 2, irisC[1], kc)];
      darkOutside(ic[0], ic[1], r, PAL.ink);
      const P = []; for (let i = 0; i <= 40; i++) { const q = i / 40 * TAU; P.push([ic[0] + Math.cos(q) * (r + 3), ic[1] + Math.sin(q) * (r + 3)]); }
      inkLine(P, 2.2, PAL.ink, 'dry', .2);
    }
  };
})();
