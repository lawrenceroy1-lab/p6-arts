// Pictures drawn in code (SVG): exact shapes, light and shadow. Art.fig("name") gives an <svg> string.
// A name can have a setting after a colon, for example "sphere:left" (light from the left).
const Art = (() => {
  let uid = 0;
  const id = p => `${p}${++uid}`;

  // ---------- colour helpers ----------
  function mix(hex, to, f) {           // f = 0..1 towards "to"
    const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
    const ch = (x, s) => (x >> s) & 255;
    const c = s => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * f);
    return "#" + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
  }
  const light = (h, f) => mix(h, "#ffffff", f);
  const dark = (h, f) => mix(h, "#000000", f);

  const svg = (w, h, body, cls) => `<svg class="art ${cls || ""}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  const INK = "#2b2b2b";

  // direction of the light -> unit vector pointing FROM the object TO the light
  const DIRS = { left: [-1, -0.35], right: [1, -0.35], top: [0, -1], below: [0, 1], front: [0, 0], behind: [0, 0], topleft: [-0.75, -0.75], topright: [0.75, -0.75] };

  // ---------- basic pieces ----------
  function sun(x, y, r = 18) {
    let rays = "";
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4;
      rays += `<line x1="${x + Math.cos(a) * (r + 5)}" y1="${y + Math.sin(a) * (r + 5)}" x2="${x + Math.cos(a) * (r + 14)}" y2="${y + Math.sin(a) * (r + 14)}" stroke="#F9A825" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<g>${rays}<circle cx="${x}" cy="${y}" r="${r}" fill="#FFD54F" stroke="#F9A825" stroke-width="3"/></g>`;
  }
  function arrow(x1, y1, x2, y2, col = "#EF6C00", w = 6) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.6;
    const p1 = [x2 - Math.cos(a - 0.5) * h, y2 - Math.sin(a - 0.5) * h], p2 = [x2 - Math.cos(a + 0.5) * h, y2 - Math.sin(a + 0.5) * h];
    return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * h * 0.6}" y2="${y2 - Math.sin(a) * h * 0.6}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><polygon points="${x2},${y2} ${p1} ${p2}" fill="${col}"/>`;
  }
  const label = (x, y, t, col = "#0D2B6B", size = 20) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="900" fill="${col}" font-family="system-ui, sans-serif" paint-order="stroke" stroke="#fff" stroke-width="4">${t}</text>`;
  const ground = (y, w) => `<line x1="10" y1="${y}" x2="${w - 10}" y2="${y}" stroke="#cfd8dc" stroke-width="3"/>`;
  function shadowEll(cx, cy, rx, ry, dx = 0) {
    const g = id("sh");
    return `<defs><radialGradient id="${g}"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx + dx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g})"/>`;
  }

  // A ball. dir = where the light comes from. hatch = pencil lines instead of paint.
  function ball(cx, cy, r, col, dir = "topleft", opt = {}) {
    const [lx, ly] = DIRS[dir] || DIRS.topleft;
    const g = id("bg");
    let body;
    if (dir === "front") {
      body = `<radialGradient id="${g}" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${light(col, .85)}"/><stop offset=".7" stop-color="${light(col, .3)}"/><stop offset="1" stop-color="${dark(col, .35)}"/></radialGradient>`;
    } else if (dir === "behind") {
      body = `<radialGradient id="${g}" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="${dark(col, .45)}"/><stop offset=".88" stop-color="${dark(col, .2)}"/><stop offset="1" stop-color="${light(col, .8)}"/></radialGradient>`;
    } else {
      body = `<radialGradient id="${g}" cx="${.5 + lx * .28}" cy="${.5 + ly * .28}" r=".78"><stop offset="0" stop-color="${light(col, .9)}"/><stop offset=".35" stop-color="${light(col, .25)}"/><stop offset=".8" stop-color="${dark(col, .3)}"/><stop offset="1" stop-color="${dark(col, .5)}"/></radialGradient>`;
    }
    const sh = opt.shadow === false ? "" : shadowEll(cx - lx * r * .9, cy + r * .92, r * 1.05, r * .22);
    return `${sh}<defs>${body}</defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g})" stroke="${opt.line ? INK : "none"}" stroke-width="2"/>`;
  }

  // pencil-hatched ball: light, medium and heavy lines away from the light (light from top left)
  function hatchBall(cx, cy, r, opt = {}) {
    const c = id("hc");
    const lines = (gap, w, op) => { let s = ""; for (let x = cx - r; x < cx + r; x += gap) s += `<line x1="${x}" y1="${cy - r}" x2="${x + r}" y2="${cy + r}" stroke="#333" stroke-width="${w}" opacity="${op}"/>`; return s; };
    const sh = opt.shadow === false ? "" : shadowEll(cx + r * .7, cy + r * .92, r, r * .2);
    return `${sh}<defs><clipPath id="${c}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><clipPath id="${c}m"><circle cx="${cx + r * .35}" cy="${cy + r * .35}" r="${r * .85}"/></clipPath><clipPath id="${c}d"><circle cx="${cx + r * .55}" cy="${cy + r * .55}" r="${r * .62}"/></clipPath></defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
      <g clip-path="url(#${c})">${lines(9, 1.3, .55)}</g><g clip-path="url(#${c})"><g clip-path="url(#${c}m)">${lines(5, 1.4, .7)}</g></g><g clip-path="url(#${c})"><g clip-path="url(#${c}d)">${lines(3, 1.6, .85)}</g></g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="2.2"/>`;
  }

  // A cube in simple 3D (front square + top + right side). shade: true / false / "hatch" / "lines"
  function cube(x, y, s, col, opt = {}) {
    const d = s * .45, dx = d, dy = -d * .8;
    const F = [[x, y], [x + s, y], [x + s, y + s], [x, y + s]];
    const T = [[x, y], [x + dx, y + dy], [x + s + dx, y + dy], [x + s, y]];
    const R = [[x + s, y], [x + s + dx, y + dy], [x + s + dx, y + s + dy], [x + s, y + s]];
    const pts = p => p.map(q => q.join(",")).join(" ");
    const dir = opt.dir || "topleft";
    // brightness of each face for the light direction
    const val = { top: .55, front: .15, right: -.35 };
    if (dir === "right" || dir === "topright") { val.right = .45; val.front = -.1; val.top = .4; }
    if (dir === "left") { val.front = .5; val.right = -.45; val.top = .1; }
    if (dir === "top") { val.top = .7; val.front = -.05; val.right = -.2; }
    const fill = v => opt.shade === false ? (opt.flat || "#fff") : v >= 0 ? light(col, v) : dark(col, -v);
    let out = "";
    if (opt.shadow) { const sx = dir.includes("right") ? -1 : 1; out += `<polygon points="${pts([[x + s, y + s], [x + s + dx, y + s + dy], [x + s + dx + sx * s * .9, y + s + dy * .2], [x + s + sx * s * .9, y + s + 6]])}" fill="#000" opacity=".22"/>`; }
    const sw = opt.thin ? 2 : 2.6;
    out += `<polygon points="${pts(F)}" fill="${fill(val.front)}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    out += `<polygon points="${pts(T)}" fill="${fill(val.top)}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    out += `<polygon points="${pts(R)}" fill="${fill(val.right)}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    if (opt.hatch) {
      const c = id("cc");
      let l = "";
      for (let k = -s; k < s * 2; k += 5) l += `<line x1="${x + s + k * .3}" y1="${y + dy - 10}" x2="${x + s + k * .3}" y2="${y + s + 10}" stroke="#333" stroke-width="1.4" opacity=".8"/>`;
      let m = "";
      for (let k = 0; k < s; k += 9) m += `<line x1="${x + k}" y1="${y}" x2="${x + k}" y2="${y + s}" stroke="#333" stroke-width="1.2" opacity=".45"/>`;
      out += `<defs><clipPath id="${c}"><polygon points="${pts(R)}"/></clipPath><clipPath id="${c}f"><polygon points="${pts(F)}"/></clipPath></defs><g clip-path="url(#${c})">${l}</g><g clip-path="url(#${c}f)">${m}</g>`;
    }
    if (opt.hidden) out += `<polyline points="${x + dx},${y + s + dy} ${x},${y + s}" fill="none" stroke="${INK}" stroke-dasharray="6 5" stroke-width="2"/><line x1="${x + dx}" y1="${y + s + dy}" x2="${x + dx}" y2="${y + dy}" stroke="${INK}" stroke-dasharray="6 5" stroke-width="2"/><line x1="${x + dx}" y1="${y + s + dy}" x2="${x + s + dx}" y2="${y + s + dy}" stroke="${INK}" stroke-dasharray="6 5" stroke-width="2"/>`;
    return out;
  }

  function cylinder(cx, top, rx, h, col, opt = {}) {
    const ry = rx * .32, g = id("cy");
    const flat = opt.shade === false;
    const sh = opt.shadow ? shadowEll(cx + rx * 1.1, top + h + ry * .3, rx * 1.4, ry * 1.1) : "";
    return `${sh}<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${light(col, .55)}"/><stop offset=".3" stop-color="${light(col, .2)}"/><stop offset=".75" stop-color="${dark(col, .25)}"/><stop offset="1" stop-color="${dark(col, .45)}"/></linearGradient></defs>
      <path d="M${cx - rx},${top} L${cx - rx},${top + h} A${rx},${ry} 0 0 0 ${cx + rx},${top + h} L${cx + rx},${top}" fill="${flat ? "#fff" : `url(#${g})`}" stroke="${INK}" stroke-width="2.6"/>
      <ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${flat ? "#fff" : light(col, .45)}" stroke="${INK}" stroke-width="2.6"/>`;
  }
  function cone(cx, base, rx, h, col, opt = {}) {
    const ry = rx * .3, g = id("co");
    return `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${light(col, .55)}"/><stop offset=".35" stop-color="${light(col, .15)}"/><stop offset="1" stop-color="${dark(col, .45)}"/></linearGradient></defs>
      ${opt.shadow ? shadowEll(cx + rx * 1.1, base + 4, rx * 1.3, ry) : ""}
      <path d="M${cx - rx},${base} L${cx},${base - h} L${cx + rx},${base} A${rx},${ry} 0 0 1 ${cx - rx},${base}" fill="url(#${g})" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  }
  function pyramid(cx, base, w, h, col, opt = {}) {
    const flat = opt.shade === false;
    const A = [cx - w * .55, base], B = [cx + w * .2, base + 14], C = [cx + w * .6, base - 10], P = [cx, base - h];
    const pts = p => p.map(q => q.join(",")).join(" ");
    return `${opt.shadow ? `<polygon points="${pts([B, C, [C[0] + w * .7, base + 4], [B[0] + w * .5, base + 22]])}" fill="#000" opacity=".2"/>` : ""}
      <polygon points="${pts([A, B, P])}" fill="${flat ? "#fff" : light(col, .35)}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <polygon points="${pts([B, C, P])}" fill="${flat ? "#fff" : dark(col, .3)}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  }

  // a simple fruit (mango shape) in a colouring stage 0..3
  function mango(cx, cy, s, stage) {
    const g = id("mg");
    const path = `M${cx - s * .9},${cy + s * .1} C${cx - s * .95},${cy - s * .75} ${cx + s * .2},${cy - s * .95} ${cx + s * .8},${cy - s * .35} C${cx + s * 1.1},${cy + s * .1} ${cx + s * .55},${cy + s * .8} ${cx - s * .2},${cy + s * .75} C${cx - s * .6},${cy + s * .7} ${cx - s * .85},${cy + s * .45} ${cx - s * .9},${cy + s * .1}Z`;
    const fills = ["#fff", "#FFF176", `url(#${g})`, `url(#${g})`];
    const grad = stage === 2
      ? `<radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFDE7"/><stop offset=".4" stop-color="#FFEE58"/><stop offset="1" stop-color="#F9A825"/></radialGradient>`
      : `<radialGradient id="${g}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#F1F8E9"/><stop offset=".3" stop-color="#FFEB3B"/><stop offset=".65" stop-color="#9CCC65"/><stop offset="1" stop-color="#33691E"/></radialGradient>`;
    const leaf = `<path d="M${cx + s * .55},${cy - s * .55} q${s * .35},${-s * .45} ${s * .8},${-s * .3} q${-s * .25},${s * .4} ${-s * .8},${s * .3}Z" fill="${stage === 0 ? "#fff" : stage === 1 ? "#C5E1A5" : "#558B2F"}" stroke="${INK}" stroke-width="2"/>`;
    const sh = stage === 3 ? shadowEll(cx + s * .4, cy + s * .82, s, s * .16) : "";
    return `${sh}<defs>${grad}</defs><path d="${path}" fill="${fills[stage]}" stroke="${INK}" stroke-width="2.4"/>${leaf}`;
  }

  function apple(cx, cy, s, opt = {}) {
    const g = id("ap");
    const flat = opt.flat;
    const body = `M${cx},${cy - s * .55} C${cx - s * .35},${cy - s * .85} ${cx - s},${cy - s * .7} ${cx - s},${cy - s * .05} C${cx - s},${cy + s * .6} ${cx - s * .45},${cy + s * .95} ${cx - s * .15},${cy + s * .85} C${cx - s * .05},${cy + s * .8} ${cx + s * .05},${cy + s * .8} ${cx + s * .15},${cy + s * .85} C${cx + s * .45},${cy + s * .95} ${cx + s},${cy + s * .6} ${cx + s},${cy - s * .05} C${cx + s},${cy - s * .7} ${cx + s * .35},${cy - s * .85} ${cx},${cy - s * .55}Z`;
    const col = opt.col || "#E53935";
    return `${flat || opt.noShadow ? "" : shadowEll(cx + s * .55, cy + s * .9, s * 1.05, s * .16)}<defs><radialGradient id="${g}" cx=".32" cy=".3" r=".85"><stop offset="0" stop-color="${light(col, .8)}"/><stop offset=".25" stop-color="${light(col, .2)}"/><stop offset=".75" stop-color="${dark(col, .25)}"/><stop offset="1" stop-color="${dark(col, .5)}"/></radialGradient></defs>
      <path d="${body}" fill="${flat === "line" ? "none" : flat ? col : `url(#${g})`}" stroke="${flat === "line" ? "#FB8C00" : INK}" stroke-width="${flat === "line" ? 3 : 2.4}"/>
      <path d="M${cx},${cy - s * .55} q${s * .05},${-s * .3} ${s * .2},${-s * .45}" stroke="#5D4037" stroke-width="${s * .09}" fill="none" stroke-linecap="round"/>
      <path d="M${cx + s * .1},${cy - s * .75} q${s * .35},${-s * .35} ${s * .7},${-s * .15} q${-s * .3},${s * .35} ${-s * .7},${s * .15}Z" fill="${flat === "line" ? "none" : "#7CB342"}" stroke="${flat === "line" ? "#FB8C00" : INK}" stroke-width="2"/>`;
  }

  function palm(x, base, h, opt = {}) {
    const trunk = `<path d="M${x - 10},${base} C${x - 4},${base - h * .5} ${x + 10},${base - h * .8} ${x + 22},${base - h}" stroke="${opt.flat ? "#8D6E63" : "#6D4C41"}" stroke-width="${h * .09}" fill="none" stroke-linecap="round"/>
      ${opt.flat ? "" : `<path d="M${x - 6},${base} C${x},${base - h * .5} ${x + 13},${base - h * .8} ${x + 24},${base - h}" stroke="#3E2723" stroke-width="${h * .03}" fill="none" opacity=".6"/>`}`;
    const tx = x + 22, ty = base - h;
    let leaves = "";
    [[-1.1, .2], [-.6, -.5], [.1, -.7], [.8, -.4], [1.2, .25], [.4, .5], [-.5, .55]].forEach(([a, b]) => {
      leaves += `<path d="M${tx},${ty} q${a * h * .25},${b * h * .25 - h * .12} ${a * h * .5},${b * h * .4}" stroke="${opt.flat ? "#66BB6A" : "#2E7D32"}" stroke-width="${h * .05}" fill="none" stroke-linecap="round"/>`;
    });
    const nuts = opt.nuts ? `<circle cx="${tx - 6}" cy="${ty + 8}" r="${h * .045}" fill="#7CB342" stroke="${INK}"/><circle cx="${tx + 6}" cy="${ty + 10}" r="${h * .045}" fill="#689F38" stroke="${INK}"/>` : "";
    const sh = opt.shadow ? `<path d="M${x - 10},${base} L${x - 10 + h * .9 * opt.shadow},${base + h * .12} L${x + h * .9 * opt.shadow},${base + h * .14} L${x + 4},${base}Z" fill="#000" opacity=".18"/>` : "";
    return sh + trunk + leaves + nuts;
  }

  // a child (simple figure). light: "left" makes the right side darker.
  function kid(x, base, h, opt = {}) {
    const hr = h * .17;
    const skin = "#FFCC80", shirt = opt.shirt || "#FFEB3B", skirt = opt.skirt || "#AB47BC";
    const g = id("kd");
    const dark1 = opt.flat ? shirt : `url(#${g})`;
    const sh = opt.shadow ? `<ellipse cx="${x + h * .35}" cy="${base + 3}" rx="${h * .4}" ry="${h * .06}" fill="#000" opacity=".2"/>` : "";
    return `${sh}<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${light(shirt, .4)}"/><stop offset=".55" stop-color="${shirt}"/><stop offset="1" stop-color="${dark(shirt, .3)}"/></linearGradient></defs>
      <line x1="${x - h * .07}" y1="${base - h * .3}" x2="${x - h * .07}" y2="${base}" stroke="${skin}" stroke-width="${h * .06}" stroke-linecap="round"/>
      <line x1="${x + h * .07}" y1="${base - h * .3}" x2="${x + h * .07}" y2="${base}" stroke="${opt.flat ? skin : dark(skin, .15)}" stroke-width="${h * .06}" stroke-linecap="round"/>
      <path d="M${x - h * .2},${base - h * .25} L${x - h * .12},${base - h * .55} L${x + h * .12},${base - h * .55} L${x + h * .2},${base - h * .25}Z" fill="${opt.flat ? skirt : dark(skirt, .05)}" stroke="${INK}" stroke-width="1.5"/>
      <rect x="${x - h * .13}" y="${base - h * .78}" width="${h * .26}" height="${h * .26}" rx="${h * .05}" fill="${dark1}" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="${x}" cy="${base - h * .78 - hr}" r="${hr}" fill="${skin}" stroke="${INK}" stroke-width="1.5"/>
      ${opt.flat ? "" : `<path d="M${x + hr * .2},${base - h * .78 - hr * 1.95} A${hr},${hr} 0 0 1 ${x + hr * .2},${base - h * .78 - hr * .05} A${hr * .8},${hr} 0 0 0 ${x + hr * .2},${base - h * .78 - hr * 1.95}Z" fill="#000" opacity=".12"/>`}
      <path d="M${x - hr},${base - h * .78 - hr} a${hr},${hr * .9} 0 0 1 ${hr * 2},0" fill="#5D4037"/>
      <circle cx="${x - hr * .35}" cy="${base - h * .78 - hr * .9}" r="${hr * .1}" fill="${INK}"/><circle cx="${x + hr * .35}" cy="${base - h * .78 - hr * .9}" r="${hr * .1}" fill="${INK}"/>
      <path d="M${x - hr * .3},${base - h * .78 - hr * .5} q${hr * .3},${hr * .25} ${hr * .6},0" stroke="${INK}" stroke-width="1.5" fill="none"/>`;
  }

  // ---------- scenes ----------
  function beach(w, h, opt = {}) {
    const g = id("sky");
    const sd = opt.wrong ? null : 1;
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#81D4FA"/><stop offset="1" stop-color="#E1F5FE"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${g})"/>
      <rect y="${h * .42}" width="${w}" height="${h * .2}" fill="#26A69A"/>
      <path d="M0,${h * .62} Q${w * .45},${h * .52} ${w},${h * .6} L${w},${h} L0,${h}Z" fill="#FFE082"/>
      <path d="M0,${h * .62} Q${w * .45},${h * .52} ${w},${h * .6}" stroke="#fff" stroke-width="5" fill="none" opacity=".8"/>`;
    if (!opt.noSun) s += sun(w * .1, h * .12, 16);
    s += palm(w * .78, h * .5, h * .14, { flat: opt.flat, shadow: opt.flat ? 0 : (opt.wrong ? -1 : 1) });
    s += palm(w * .88, h * .49, h * .11, { flat: opt.flat, shadow: opt.flat ? 0 : 1 });
    s += palm(w * .18, h * .92, h * .7, { flat: opt.flat, nuts: true, shadow: opt.flat ? 0 : sd });
    s += kid(w * .52, h * .9, h * .45, { flat: opt.flat, shadow: !opt.flat && !opt.wrong });
    if (opt.wrong) s += `<ellipse cx="${w * .4}" cy="${h * .9 + 3}" rx="${h * .18}" ry="${h * .03}" fill="#000" opacity=".2"/>`;
    s += `<g transform="translate(${w * .8},${h * .86})"><ellipse rx="10" ry="6" fill="#E53935"/><path d="M-10,0 l-8,-6 M10,0 l8,-6 M-6,4 l-5,6 M6,4 l5,6" stroke="#C62828" stroke-width="2.5"/></g>`;
    return s;
  }

  function surreal(w, h) {
    const g = id("su"), g2 = id("su");
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7E57C2"/><stop offset=".5" stop-color="#EC407A"/><stop offset="1" stop-color="#FFA726"/></linearGradient>
      <radialGradient id="${g2}" cx=".3" cy=".3" r=".8"><stop offset="0" stop-color="#E0F7FA"/><stop offset=".5" stop-color="#26C6DA"/><stop offset="1" stop-color="#006064"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${g})"/>
      <circle cx="${w * .78}" cy="${h * .2}" r="${h * .1}" fill="#76FF03" opacity=".9"/><circle cx="${w * .78}" cy="${h * .2}" r="${h * .16}" fill="#76FF03" opacity=".25"/>
      <path d="M0,${h * .78} L${w},${h * .72} L${w},${h} L0,${h}Z" fill="#311B92" opacity=".75"/>
      <ellipse cx="${w * .55}" cy="${h * .82}" rx="${w * .2}" ry="${h * .04}" fill="#FFEB3B" opacity=".75"/>
      <ellipse cx="${w * .5}" cy="${h * .82}" rx="${w * .11}" ry="${h * .03}" fill="#00E5FF" opacity=".75"/>
      <circle cx="${w * .42}" cy="${h * .45}" r="${h * .2}" fill="url(#${g2})" stroke="#fff" stroke-width="3"/>
      <path d="M${w * .42},${h * .25} q${w * .02},${-h * .09} ${w * .07},${-h * .1}" stroke="#76FF03" stroke-width="6" fill="none"/>
      ${[0, 1, 2, 3, 4].map(k => `<line x1="${w * .78}" y1="${h * .2}" x2="${w * (.5 - k * .06)}" y2="${h * (.35 + k * .05)}" stroke="#CCFF90" stroke-width="2" opacity=".55"/>`).join("")}`;
  }

  // stained-glass fruit (very surreal, like the book's example on p.54)
  function glassFruit(w, h) {
    const cols = ["#FFD54F", "#4DD0E1", "#BA68C8", "#81C784", "#FF8A65", "#F06292", "#7986CB", "#AED581"];
    let s = `<rect width="${w}" height="${h}" fill="#263238"/>`;
    for (let k = 0; k < 14; k++) {
      const x = (k * 53) % w, y = (k * 37) % h;
      s += `<polygon points="${x},${y} ${x + 90},${y + 20} ${x + 40},${y + 80}" fill="${cols[k % 8]}" opacity=".85" stroke="#111" stroke-width="3"/>`;
    }
    s += `<ellipse cx="${w * .45}" cy="${h * .55}" rx="${w * .22}" ry="${h * .28}" fill="#FFB300" stroke="#111" stroke-width="4" opacity=".92"/>
      <path d="M${w * .3},${h * .4} L${w * .6},${h * .7} M${w * .55},${h * .3} L${w * .35},${h * .75} M${w * .25},${h * .58} L${w * .66},${h * .5}" stroke="#111" stroke-width="3"/>
      <circle cx="${w * .75}" cy="${h * .7}" r="${h * .12}" fill="#E53935" stroke="#111" stroke-width="4"/>`;
    return s;
  }

  function veg(w, h) {   // realistic still life: pepper and tomato with cast shadows
    return `<rect width="${w}" height="${h}" fill="#FFF8E1"/>` + ball(w * .32, h * .55, h * .24, "#43A047", "topleft") + ball(w * .66, h * .64, h * .16, "#E53935", "topleft")
      + `<path d="M${w * .32},${h * .31} q${w * .02},${-h * .1} ${w * .06},${-h * .1}" stroke="#2E7D32" stroke-width="6" fill="none"/>`;
  }

  function hatchBox(x, y, w, h, gap, lw) {
    const c = id("hb");
    let l = "";
    for (let k = -h; k < w; k += gap) l += `<line x1="${x + k}" y1="${y + h}" x2="${x + k + h}" y2="${y}" stroke="#333" stroke-width="${lw}"/>`;
    return `<defs><clipPath id="${c}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/></clipPath></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff"/><g clip-path="url(#${c})">${l}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  }

  function octagon(cx, cy, r, col) {
    let p = []; for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; p.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`); }
    return `<polygon points="${p.join(" ")}" fill="none" stroke="${col}" stroke-width="4"/>`;
  }
  function umbrella(cx, cy, r) {
    return `<path d="M${cx - r},${cy} A${r},${r * .8} 0 0 1 ${cx + r},${cy} Q${cx + r * .75},${cy - r * .15} ${cx + r * .5},${cy} Q${cx + r * .25},${cy - r * .15} ${cx},${cy} Q${cx - r * .25},${cy - r * .15} ${cx - r * .5},${cy} Q${cx - r * .75},${cy - r * .15} ${cx - r},${cy}Z" fill="none" stroke="#9CCC65" stroke-width="3.5"/>
      <path d="M${cx},${cy - r * .8} L${cx},${cy + r * .9} q0,${r * .25} ${-r * .22},${r * .2}" fill="none" stroke="#9CCC65" stroke-width="3.5"/>`;
  }
  function flatSun(cx, cy, r) {
    let rays = ""; for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; rays += `<line x1="${cx + Math.cos(a) * (r + 6)}" y1="${cy + Math.sin(a) * (r + 6)}" x2="${cx + Math.cos(a) * (r + 18)}" y2="${cy + Math.sin(a) * (r + 18)}" stroke="#FB8C00" stroke-width="4" stroke-linecap="round"/>`; }
    return rays + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFA726"/>`;
  }
  function teapot(cx, cy, s) {
    const g = id("tp");
    return shadowEll(cx + s * .5, cy + s * .75, s * 1.1, s * .15) + `<defs><radialGradient id="${g}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#C8E6C9"/><stop offset=".4" stop-color="#43A047"/><stop offset="1" stop-color="#1B5E20"/></radialGradient></defs>
      <path d="M${cx + s * .55},${cy} q${s * .55},${-s * .1} ${s * .7},${-s * .5}" stroke="#2E7D32" stroke-width="${s * .14}" fill="none" stroke-linecap="round"/>
      <path d="M${cx - s * .6},${cy - s * .2} q${-s * .45},${s * .05} ${-s * .3},${s * .45}" stroke="#1B5E20" stroke-width="${s * .1}" fill="none"/>
      <ellipse cx="${cx}" cy="${cy + s * .1}" rx="${s * .7}" ry="${s * .6}" fill="url(#${g})" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy - s * .45}" rx="${s * .35}" ry="${s * .1}" fill="#66BB6A" stroke="${INK}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy - s * .6}" r="${s * .08}" fill="#2E7D32" stroke="${INK}"/>`;
  }
  function puppyBall(cx, cy, s) {   // a pencil-shaded animal-like form: hatched ball with ears
    return hatchBall(cx, cy, s) + `<ellipse cx="${cx - s * .75}" cy="${cy - s * .45}" rx="${s * .25}" ry="${s * .45}" fill="#333" transform="rotate(-25 ${cx - s * .75} ${cy - s * .45})"/><ellipse cx="${cx + s * .75}" cy="${cy - s * .45}" rx="${s * .25}" ry="${s * .45}" fill="#333" transform="rotate(25 ${cx + s * .75} ${cy - s * .45})"/>
      <circle cx="${cx - s * .3}" cy="${cy - s * .1}" r="${s * .08}" fill="#111"/><circle cx="${cx + s * .3}" cy="${cy - s * .1}" r="${s * .08}" fill="#111"/><ellipse cx="${cx}" cy="${cy + s * .2}" rx="${s * .14}" ry="${s * .1}" fill="#111"/>`;
  }
  function tree(cx, base, s, opt = {}) {
    const g = id("tr");
    return `${opt.shadow ? shadowEll(cx + s * .7, base + 2, s * .9, s * .14) : ""}<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C5E1A5"/><stop offset=".5" stop-color="#43A047"/><stop offset="1" stop-color="#1B5E20"/></radialGradient></defs>
      <rect x="${cx - s * .1}" y="${base - s * .7}" width="${s * .2}" height="${s * .7}" fill="#6D4C41"/>
      <circle cx="${cx}" cy="${base - s * 1.1}" r="${s * .6}" fill="${opt.flat ? "#66BB6A" : `url(#${g})`}" stroke="${INK}" stroke-width="2"/>`;
  }
  function vase(cx, base, s) {  // lit from the left, shadow on the right (test Q6)
    const g = id("vs");
    return `<polygon points="${cx + s * .3},${base} ${cx + s * 1.9},${base - s * .15} ${cx + s * 1.8},${base + s * .2} ${cx + s * .2},${base + s * .18}" fill="#000" opacity=".22"/>
      <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#e0e0e0"/><stop offset=".75" stop-color="#757575"/><stop offset="1" stop-color="#424242"/></linearGradient></defs>
      <path d="M${cx - s * .25},${base - s * 1.7} L${cx + s * .25},${base - s * 1.7} L${cx + s * .2},${base - s * 1.4} C${cx + s * .75},${base - s * 1.1} ${cx + s * .7},${base - s * .2} ${cx + s * .35},${base} L${cx - s * .35},${base} C${cx - s * .7},${base - s * .2} ${cx - s * .75},${base - s * 1.1} ${cx - s * .2},${base - s * 1.4}Z" fill="url(#${g})" stroke="${INK}" stroke-width="2.4"/>`;
  }

  // ---------- named pictures ----------
  const F = {
    flatToCube: () => svg(420, 220, `<rect x="40" y="60" width="110" height="110" fill="#fff" stroke="${INK}" stroke-width="3"/>${arrow(175, 115, 235, 115)}${cube(260, 80, 100, "#42A5F5", { shadow: true })}`),
    cubeBeforeAfter: () => svg(420, 220, `${cube(40, 80, 100, "#fff", { shade: false })}${arrow(195, 115, 245, 115, "#EC407A")}${cube(260, 80, 100, "#9E9E9E", { shadow: true })}`),
    shapesForms: () => svg(440, 300, `<circle cx="90" cy="80" r="52" fill="#fff" stroke="${INK}" stroke-width="3"/>${arrow(160, 80, 215, 80)}${ball(310, 80, 52, "#EF5350", "topleft")}
      <rect x="40" y="175" width="100" height="100" fill="#fff" stroke="${INK}" stroke-width="3"/>${arrow(160, 225, 215, 225)}${cube(255, 195, 85, "#42A5F5", {})}`),
    dims: () => svg(460, 250, `<rect x="30" y="70" width="150" height="110" fill="#E3F2FD" stroke="${INK}" stroke-width="3"/>
      ${arrow(30, 200, 180, 200, "#1E88E5", 4)}${arrow(180, 200, 30, 200, "#1E88E5", 4)}${label(105, 228, "W", "#1E88E5")}
      ${arrow(10, 70, 10, 180, "#2E7D32", 4)}${arrow(10, 180, 10, 70, "#2E7D32", 4)}${label(22, 60, "L", "#2E7D32")}
      ${cube(270, 95, 110, "#FFB74D", {})}${arrow(270, 222, 380, 222, "#1E88E5", 4)}${label(325, 246, "W", "#1E88E5")}
      ${arrow(255, 95, 255, 205, "#2E7D32", 4)}${label(240, 150, "L", "#2E7D32")}
      ${arrow(392, 214, 438, 172, "#E53935", 4)}${label(440, 210, "D", "#E53935")}`),
    squareToCube: () => svg(520, 200, `<rect x="20" y="50" width="100" height="100" fill="#fff" stroke="${INK}" stroke-width="3"/>${arrow(135, 100, 175, 100, "#EC407A")}
      ${cube(190, 70, 95, "#fff", { shade: false })}${cube(355, 70, 95, "#fff", { shade: false, hidden: true })}`),
    shade3d: () => svg(460, 300, `<circle cx="95" cy="80" r="55" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${arrow(170, 80, 220, 80, "#EC407A")}${hatchBall(320, 80, 55)}
      ${cube(40, 190, 85, "#fff", { shade: false })}${arrow(170, 230, 220, 230, "#EC407A")}${cube(250, 190, 85, "#BDBDBD", { hatch: true, shadow: true })}`),
    forms: () => svg(560, 220, `${ball(70, 120, 50, "#EF5350")}${cube(140, 100, 70, "#42A5F5", {})}${cylinder(300, 80, 42, 90, "#66BB6A", {})}${pyramid(410, 165, 100, 120, "#FFB300", {})}${cone(510, 170, 42, 120, "#AB47BC", {})}`),
    nearFar: () => svg(460, 260, `<rect width="460" height="260" fill="#E3F2FD"/><path d="M0,120 L460,120 L460,260 L0,260Z" fill="#AED581"/>
      <path d="M200,120 L260,120 L380,260 L80,260Z" fill="#BCAAA4"/>
      ${tree(60, 250, 90, { shadow: true })}${tree(150, 175, 50, {})}${tree(195, 140, 26, {})}
      ${tree(400, 250, 90, { shadow: true })}${tree(310, 175, 50, {})}${tree(265, 140, 26, {})}`),
    lightSides: () => svg(440, 260, `${sun(60, 55)}${arrow(90, 75, 150, 105, "#F9A825", 4)}${cube(170, 110, 120, "#FF7043", { shadow: true })}`),
    sphere: dir => svg(220, 220, `${dir === "behind" ? "" : ""}${ball(110, 105, 70, "#1E88E5", dir || "topleft")}
      ${({ top: arrow(110, 8, 110, 30, "#EC407A", 4), left: arrow(8, 105, 30, 105, "#EC407A", 4), right: arrow(212, 105, 190, 105, "#EC407A", 4), below: arrow(110, 215, 110, 190, "#EC407A", 4), front: `<circle cx="110" cy="105" r="8" fill="none" stroke="#EC407A" stroke-width="3"/>`, behind: `<circle cx="196" cy="25" r="10" fill="#EC407A" opacity=".5"/>` })[dir] || ""}`),
    voteRightQ: () => svg(420, 240, `${sun(380, 60)}<circle cx="200" cy="120" r="85" fill="#fff" stroke="${INK}" stroke-width="3"/><line x1="200" y1="35" x2="200" y2="205" stroke="#90A4AE" stroke-dasharray="7 6" stroke-width="2"/>${label(150, 130, "A", "#E21B3C", 40)}${label(250, 130, "B", "#1368CE", 40)}`),
    voteRightA: () => svg(420, 240, `${sun(380, 60)}${ball(200, 120, 85, "#1E88E5", "right")}`),
    hatch3: () => svg(480, 170, `${hatchBox(20, 20, 130, 130, 14, 1.4)}${hatchBox(175, 20, 130, 130, 7, 1.6)}${hatchBox(330, 20, 130, 130, 3.5, 1.8)}`),
    paintStages: () => svg(600, 190, [0, 1, 2, 3].map(k => mango(80 + k * 148, 100, 52, k)).join("")),
    valueBlock: () => svg(520, 230, `${[0, 1, 2].map(k => `<rect x="${30 + k * 160}" y="50" width="90" height="140" fill="${["#BBDEFB", "#42A5F5", "#0D47A1"][k]}" stroke="${INK}" stroke-width="2.5"/>${label(75 + k * 160, 36, String(k + 1), "#EC407A", 24)}`).join("")}`),
    boxValues: () => svg(380, 260, `${sun(50, 40)}${cube(110, 100, 130, "#1E88E5", { shadow: true })}${label(205, 78, "1", "#0D2B6B", 28)}${label(175, 172, "2", "#0D2B6B", 28)}${label(270, 160, "3", "#0D2B6B", 28)}`),
    pencilScale: () => svg(520, 210, `${[0, 1, 2, 3, 4].map(k => `<rect x="${20 + k * 62}" y="40" width="58" height="58" fill="${mix("#ffffff", "#212121", k * .22)}" stroke="${INK}" stroke-width="2"/>`).join("")}${hatchBall(420, 95, 70)}`),
    castShadow: () => svg(480, 250, `${sun(50, 45)}${ground(220, 480)}${ball(170, 170, 50, "#EF5350", "topleft", { shadow: false })}<ellipse cx="250" cy="222" rx="80" ry="14" fill="#000" opacity=".25"/>${cube(320, 150, 70, "#FFB300", { shadow: true })}`),
    noShadow: () => svg(300, 230, `${ball(150, 100, 60, "#EF5350", "topleft", { shadow: false })}${ground(215, 300)}`),
    voteShadowQ: () => svg(440, 240, `${sun(40, 50)}${ground(205, 440)}${ball(220, 150, 50, "#66BB6A", "left", { shadow: false })}<ellipse cx="110" cy="207" rx="60" ry="12" fill="none" stroke="#E21B3C" stroke-width="3" stroke-dasharray="6 5"/><ellipse cx="330" cy="207" rx="60" ry="12" fill="none" stroke="#1368CE" stroke-width="3" stroke-dasharray="6 5"/>${label(110, 235, "A", "#E21B3C", 26)}${label(330, 235, "B", "#1368CE", 26)}`),
    voteShadowA: () => svg(440, 240, `${sun(40, 50)}${ground(205, 440)}${ball(220, 150, 50, "#66BB6A", "left", { shadow: false })}<ellipse cx="320" cy="207" rx="85" ry="13" fill="#000" opacity=".28"/>`),
    lampCup: () => svg(440, 240, `<rect x="40" y="170" width="60" height="12" fill="#795548"/><line x1="70" y1="170" x2="70" y2="80" stroke="#795548" stroke-width="6"/><path d="M40,80 L100,80 L85,45 L55,45Z" fill="#FFD54F" stroke="${INK}" stroke-width="2"/>${ground(215, 440)}<polygon points="250,212 400,200 400,222 250,224" fill="#000" opacity=".22"/>${cylinder(220, 120, 45, 90, "#FF7043", {})}`),
    scenery: () => svg(480, 320, beach(480, 320)),
    sceneryWrong: () => svg(480, 320, beach(480, 320, { wrong: true })),
    sceneryFlat: () => svg(480, 320, beach(480, 320, { flat: true, noSun: true })),
    surreal: () => svg(480, 320, surreal(480, 320)),
    glassFruit: () => svg(400, 280, glassFruit(400, 280)),
    veg: () => svg(400, 280, veg(400, 280)),
    // Activity 1 (book p.55): our own pictures, same 2D / 3D answers as the book
    sort1: () => svg(200, 180, octagon(100, 90, 62, "#1E88E5")),
    sort2: () => svg(200, 180, apple(100, 95, 60)),
    sort3: () => svg(200, 180, umbrella(100, 80, 70)),
    sort4: () => svg(200, 180, puppyBall(100, 90, 55)),
    sort5: () => svg(200, 180, teapot(100, 95, 60)),
    sort6: () => svg(200, 180, `<circle cx="100" cy="90" r="62" fill="none" stroke="#FB8C00" stroke-width="3.5"/>`),
    sort7: () => svg(200, 180, pyramid(100, 145, 120, 110, "#B0BEC5", { shadow: true })),
    sort8: () => svg(200, 180, flatSun(100, 90, 45)),
    // Unit test pictures (book p.59 to 61): our own versions
    t1a: () => svg(200, 170, `<polygon points="100,20 175,150 25,150" fill="none" stroke="#FB8C00" stroke-width="3.5"/>`),
    t1b: () => svg(200, 170, hatchBall(100, 85, 60, { shadow: true })),
    t1c: () => svg(200, 170, apple(100, 95, 58, { flat: "line" })),
    t1d: () => svg(200, 170, `<rect x="45" y="20" width="110" height="130" fill="none" stroke="${INK}" stroke-width="3.5"/>`),
    t3a: () => svg(200, 170, mango(100, 90, 55, 3)),
    t3b: () => svg(200, 170, kid(100, 160, 130, { shirt: "#FF7043", skirt: "#EC407A" })),
    t3c: () => svg(200, 170, puppyBall(100, 85, 55)),
    t3d: () => svg(200, 170, tree(100, 160, 75, { shadow: true })),
    t5: () => svg(480, 320, beach(480, 320)),
    t6: () => svg(320, 260, vase(140, 220, 100)),
    t8: () => svg(260, 220, `<polygon points="60,70 160,70 160,190 60,190" fill="#90CAF9" stroke="${INK}" stroke-width="2.5"/><polygon points="60,70 100,35 200,35 160,70" fill="#90CAF9" stroke="${INK}" stroke-width="2.5"/><polygon points="160,70 200,35 200,155 160,190" fill="#90CAF9" stroke="${INK}" stroke-width="2.5"/>`),
    t9a: () => svg(240, 160, beach(240, 160, {})),
    t9b: () => svg(240, 160, veg(240, 160)),
    t9c: () => svg(240, 160, `<rect width="240" height="160" fill="#ECEFF1"/>${cube(70, 60, 70, "#8D6E63", { shadow: true })}`),
    t9d: () => svg(240, 160, glassFruit(240, 160)),
    // Activity 4 (book p.57): the base picture is a circle
    base4: () => svg(300, 300, `<rect x="10" y="10" width="280" height="280" rx="14" fill="#fff" stroke="#1E88E5" stroke-width="3"/><circle cx="150" cy="165" r="85" fill="none" stroke="#EC407A" stroke-width="3"/>`),
    idea4a: () => svg(240, 200, ball(120, 95, 70, "#FFA726", "topleft")),
    idea4b: () => svg(240, 200, `${ball(120, 100, 65, "#5C6BC0", "topleft")}<ellipse cx="120" cy="100" rx="105" ry="22" fill="none" stroke="#FFCA28" stroke-width="7" transform="rotate(-12 120 100)"/>`),
    idea4c: () => svg(240, 200, `${ball(120, 100, 65, "#FFF59D", "left")}<circle cx="100" cy="80" r="10" fill="#FBC02D" opacity=".6"/><circle cx="140" cy="120" r="14" fill="#FBC02D" opacity=".5"/>`),
    // materials
    matPencil: () => svg(260, 110, `<polygon points="20,55 60,35 220,35 220,75 60,75" fill="#FFCA28" stroke="${INK}" stroke-width="2.5"/><polygon points="20,55 60,35 60,75" fill="#FFE0B2" stroke="${INK}" stroke-width="2.5"/><polygon points="20,55 32,49 32,61" fill="#333"/><rect x="220" y="35" width="25" height="40" fill="#EF9A9A" stroke="${INK}" stroke-width="2.5"/>${label(140, 62, "2B", "#333", 18)}`),
    matEraser: () => svg(200, 110, `<rect x="40" y="30" width="120" height="55" rx="10" fill="#F48FB1" stroke="${INK}" stroke-width="2.5"/><rect x="40" y="30" width="55" height="55" rx="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`),
    matSharpener: () => svg(200, 110, `<rect x="60" y="30" width="80" height="55" rx="8" fill="#4FC3F7" stroke="${INK}" stroke-width="2.5"/><circle cx="100" cy="57" r="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`),
    matBook: () => svg(200, 120, `<rect x="45" y="15" width="110" height="95" rx="6" fill="#F06292" stroke="${INK}" stroke-width="2.5"/><rect x="55" y="15" width="8" height="95" fill="#C2185B"/>${label(110, 70, "ARTS", "#fff", 18)}`),
    matColourPencils: () => svg(260, 120, ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA", "#6D4C41"].map((c, k) => `<g transform="translate(${30 + k * 30},10) rotate(${-8 + k * 3})"><rect x="0" y="20" width="20" height="80" fill="${c}" stroke="${INK}" stroke-width="1.5"/><polygon points="0,20 10,0 20,20" fill="#FFE0B2" stroke="${INK}" stroke-width="1.5"/><polygon points="6,8 10,0 14,8" fill="${c}"/></g>`).join("")),
    matCrayons: () => svg(260, 120, ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA"].map((c, k) => `<g transform="translate(${35 + k * 33},15)"><rect x="0" y="22" width="24" height="75" rx="4" fill="${c}" stroke="${INK}" stroke-width="1.5"/><path d="M0,22 Q12,-4 24,22Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/><rect x="0" y="45" width="24" height="25" fill="#fff" opacity=".6"/></g>`).join("")),
    matWatercolours: () => svg(260, 120, `<rect x="20" y="25" width="190" height="75" rx="10" fill="#ECEFF1" stroke="${INK}" stroke-width="2.5"/>${["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA"].map((c, k) => `<ellipse cx="${45 + (k % 3) * 60}" cy="${48 + Math.floor(k / 3) * 30}" rx="22" ry="11" fill="${c}"/>`).join("")}<line x1="215" y1="105" x2="250" y2="15" stroke="#8D6E63" stroke-width="6" stroke-linecap="round"/><path d="M212,112 l3,-12 8,3z" fill="#333"/>`),
  };

  function fig(name, cls) {
    if (!name) return "";
    const [n, arg] = String(name).split(":");
    const f = F[n];
    if (!f) return `<div class="small">(picture "${n}" missing)</div>`;
    return f(arg).replace('class="art ', `class="art ${cls || ""} `);
  }
  return { fig, ball, cube, cylinder, cone, pyramid, hatchBall, hatchBox, apple, mango, palm, kid, beach, sun, arrow, label, ground, shadowEll, svg, light, dark, mix, INK, names: () => Object.keys(F) };
})();
