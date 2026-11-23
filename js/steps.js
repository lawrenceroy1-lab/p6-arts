// Draw along: step-by-step pictures. Steps.draw("cube", 3) gives the picture for step 3 (steps start at 1).
// New lines in each step are drawn in pink so students see what to add.
const Steps = (() => {
  const A = Art, INK = A.INK, NEW = "#EC407A";
  const S = (w, h, b) => A.svg(w, h, b, "step-art");
  const pen = (k, at) => (k === at ? NEW : INK);          // pink only in the step where the line is new
  const ln = (x1, y1, x2, y2, c, w = 3, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${dash ? 'stroke-dasharray="7 6"' : ""}/>`;

  const G = {
    // ---------- 1. A cube from a square (book p.45) ----------
    cube: { n: 6, draw(k) {
      let s = "";
      const x = 110, y = 110, z = 120, dx = 55, dy = -45;
      if (k >= 5) s += A.sun(40, 40);
      if (k >= 6) s += `<polygon points="${x + z},${y + z} ${x + z + dx},${y + z + dy} ${x + z + dx + 110},${y + z + dy + 30} ${x + z + 100},${y + z + 18}" fill="#000" opacity=".22"/>`;
      if (k >= 5) return S(420, 300, s + A.cube(x, y, z, "#FFB74D", {}));
      s += `<rect x="${x}" y="${y}" width="${z}" height="${z}" fill="none" stroke="${pen(k, 1)}" stroke-width="3"/>`;
      if (k >= 2 && k < 4) s += `<rect x="${x + dx}" y="${y + dy}" width="${z}" height="${z}" fill="none" stroke="${pen(k, 2)}" stroke-width="3" ${k === 3 ? 'stroke-dasharray="7 6"' : ""}/>`;
      if (k === 3) [[x, y], [x + z, y], [x + z, y + z], [x, y + z]].forEach(([a, b]) => { s += ln(a, b, a + dx, b + dy, NEW); });
      if (k === 4) s += A.cube(x, y, z, "#fff", { shade: false });
      return S(420, 300, s);
    } },
    // ---------- 2. A shaded ball (book p.48 to 51) ----------
    ball: { n: 5, draw(k) {
      let s = "";
      const cx = 200, cy = 140, r = 90;
      if (k >= 2) s += A.sun(45, 40) + A.arrow(75, 60, 120, 85, "#F9A825", 4);
      if (k >= 5) s += `<ellipse cx="${cx + 70}" cy="${cy + r + 8}" rx="${r * 1.05}" ry="20" fill="#000" opacity=".25"/>`;
      if (k <= 2) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${pen(k, 1)}" stroke-width="3"/>` + (k === 2 ? `<circle cx="${cx - 35}" cy="${cy - 35}" r="18" fill="none" stroke="${NEW}" stroke-width="3" stroke-dasharray="5 4"/>` : "");
      if (k === 3) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M${cx + r * .1},${cy - r} A${r},${r} 0 0 1 ${cx - r},${cy + r * .1} A${r * 1.3},${r * 1.3} 0 0 0 ${cx + r * .1},${cy - r}" fill="#fff"/>` + `<path d="M${cx - r * .95},${cy + r * .3} A${r},${r} 0 0 0 ${cx + r * .3},${cy - r * .95} A${r * .95},${r * .95} 0 0 1 ${cx - r * .95},${cy + r * .3}Z" fill="${NEW}" opacity=".0"/>` + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#90CAF9" opacity=".55"/><circle cx="${cx - 35}" cy="${cy - 35}" r="30" fill="#fff" opacity=".9"/>`;
      if (k >= 4) s += A.ball(cx, cy, r, "#1E88E5", "topleft", { shadow: false, line: true });
      return S(420, 290, s);
    } },
    // ---------- 3. A cup (cylinder) ----------
    cup: { n: 5, draw(k) {
      let s = "";
      const cx = 200, top = 70, rx = 70, h = 150, ry = 22;
      if (k >= 4) s += A.sun(45, 40);
      if (k >= 5) s += `<polygon points="${cx},${top + h + ry} ${cx + rx},${top + h} ${cx + rx + 130},${top + h + 10} ${cx + 90},${top + h + 36}" fill="#000" opacity=".22"/>`;
      if (k >= 4) return S(420, 300, s + A.cylinder(cx, top, rx, h, "#26A69A", {}) + `<path d="M${cx + rx - 4},${top + 35} q55,10 40,60 q-10,25 -40,20" fill="none" stroke="#00796B" stroke-width="10"/>`);
      s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${pen(k, 1)}" stroke-width="3"/>`;
      if (k >= 2) s += ln(cx - rx, top, cx - rx, top + h, pen(k, 2)) + ln(cx + rx, top, cx + rx, top + h, pen(k, 2));
      if (k >= 3) s += `<path d="M${cx - rx},${top + h} A${rx},${ry} 0 0 0 ${cx + rx},${top + h}" fill="none" stroke="${pen(k, 3)}" stroke-width="3"/><path d="M${cx + rx - 4},${top + 35} q55,10 40,60 q-10,25 -40,20" fill="none" stroke="${pen(k, 3)}" stroke-width="3"/>`;
      return S(420, 300, s);
    } },
    // ---------- 4. Line shading: light, medium, heavy (book p.49) ----------
    lines: { n: 4, draw(k) {
      let s = "";
      if (k >= 1) s += A.hatchBox(20, 30, 130, 130, 14, 1.4);
      if (k >= 2) s += A.hatchBox(175, 30, 130, 130, 7, 1.6);
      if (k >= 3) s += A.hatchBox(330, 30, 130, 130, 3.5, 1.8);
      if (k >= 4) return S(480, 360, s + A.hatchBall(240, 270, 70));
      return S(480, 200, s);
    } },
    // ---------- 5. An apple with colour pencils (4 steps) ----------
    apple: { n: 4, draw(k) {
      let s = A.sun(40, 40);
      if (k === 1) s += A.apple(210, 160, 95, { flat: "line" });
      if (k === 2) s += A.apple(210, 160, 95, { flat: true, col: "#EF5350" });
      if (k === 3) s += A.apple(210, 160, 95, { noShadow: true });
      if (k === 4) s += A.apple(210, 160, 95, {});
      return S(420, 300, s);
    } },
    // ---------- 6. A 3D heart ----------
    heart: { n: 5, draw(k) {
      const path = "M210,250 C120,190 70,140 90,95 C110,50 180,55 210,100 C240,55 310,50 330,95 C350,140 300,190 210,250Z";
      let s = "";
      if (k >= 2) s += A.sun(40, 40);
      if (k >= 5) s += `<ellipse cx="260" cy="262" rx="110" ry="16" fill="#000" opacity=".22"/>`;
      const g = "hg" + k;
      if (k >= 4) s += `<defs><radialGradient id="${g}" cx=".32" cy=".3" r=".85"><stop offset="0" stop-color="#FCE4EC"/><stop offset=".35" stop-color="#F06292"/><stop offset=".8" stop-color="#C2185B"/><stop offset="1" stop-color="#880E4F"/></radialGradient></defs>`;
      const fill = k >= 4 ? `url(#${g})` : k === 3 ? "#F48FB1" : "#fff";
      s += `<path d="${path}" fill="${fill}" stroke="${pen(k, 1)}" stroke-width="3"/>`;
      if (k === 2) s += `<ellipse cx="140" cy="100" rx="22" ry="14" fill="none" stroke="${NEW}" stroke-width="3" stroke-dasharray="5 4"/>`;
      if (k >= 5) s += `<ellipse cx="140" cy="100" rx="22" ry="13" fill="#fff" opacity=".9"/>`;
      return S(420, 290, s);
    } },
    // ---------- 7. The beach scene (book p.53) ----------
    beach: { n: 5, draw(k) {
      const w = 480, h = 320;
      if (k >= 4) return S(w, h, A.beach(w, h, { flat: k === 4, noSun: k === 4 }));
      let s = `<rect width="${w}" height="${h}" fill="#fff"/>`;
      s += ln(0, h * .42, w, h * .42, pen(k, 1)) + `<path d="M0,${h * .62} Q${w * .45},${h * .52} ${w},${h * .6}" fill="none" stroke="${pen(k, 1)}" stroke-width="3"/>`;
      if (k >= 2) {
        const c = pen(k, 2);
        s += A.palmLine(w * .18, h * .92, h * .7, c) + A.palmLine(w * .78, h * .5, h * .14, c) + A.palmLine(w * .88, h * .49, h * .11, c);
        s += A.kidLine(w * .52, h * .9, h * .45, c, k >= 3 ? NEW : "");
      }
      if (k >= 3) s += `<circle cx="${w * .18 + 16}" cy="${h * .22 + 8}" r="8" fill="none" stroke="${NEW}" stroke-width="3"/><circle cx="${w * .18 + 30}" cy="${h * .22 + 11}" r="8" fill="none" stroke="${NEW}" stroke-width="3"/>
        <g transform="translate(${w * .8},${h * .86})"><ellipse rx="11" ry="7" fill="none" stroke="${NEW}" stroke-width="3"/><path d="M-11,0 l-8,-7 M11,0 l8,-7 M-6,5 l-5,7 M6,5 l5,7" stroke="${NEW}" stroke-width="3"/></g>`;
      return S(w, h, s);
    } },
    // ---------- 8. Activity 4: turn the circle into a 3D object (book p.57) ----------
    circle: { n: 5, draw(k) {
      let s = `<rect x="10" y="10" width="380" height="300" rx="14" fill="#fff" stroke="#1E88E5" stroke-width="3"/>`;
      if (k >= 2) s += A.sun(55, 55, 16);
      if (k <= 2) s += `<circle cx="200" cy="170" r="95" fill="none" stroke="#EC407A" stroke-width="3"/>`;
      if (k === 3) s += `<circle cx="200" cy="170" r="95" fill="#FFB74D" stroke="${INK}" stroke-width="3"/><circle cx="200" cy="72" r="6" fill="#6D4C41"/>`;
      if (k >= 4) s += A.ball(200, 170, 95, "#FB8C00", "topleft", { shadow: k >= 5, line: true }) + `<circle cx="200" cy="72" r="6" fill="#6D4C41"/><path d="M203,72 q20,-25 45,-10 q-20,20 -45,10Z" fill="#66BB6A" stroke="${INK}" stroke-width="2"/>`;
      if (k >= 5) s += `<text x="200" y="300" text-anchor="middle" font-size="22" font-weight="900" fill="#0D2B6B" font-family="system-ui">My Orange</text>`;
      return S(400, 320, s);
    } },
  };
  return { draw: (g, k) => (G[g] ? G[g].draw(k) : `<p>(missing guide ${g})</p>`), count: g => (G[g] ? G[g].n : 0), names: () => Object.keys(G) };
})();
