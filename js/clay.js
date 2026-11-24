// Clay step pictures for Unit 4. Clay.draw("elephant", 2) gives the picture for step 2.
// Each picture: on the left, the pieces to make ("MAKE"); on the right, the sculpture so far.
const Clay = (() => {
  let n = 0;
  const id = () => "cl" + (++n);
  const L = (c, f) => Art.light(c, f), Dk = (c, f) => Art.dark(c, f);
  const INK = "#1b1b1b";

  // ---------- clay pieces ----------
  function rg(c) { const g = id(); return [g, `<radialGradient id="${g}" cx=".34" cy=".3" r=".85"><stop offset="0" stop-color="${L(c, .5)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${Dk(c, .38)}"/></radialGradient>`]; }
  function lg(c, vertical) { const g = id(); return [g, `<linearGradient id="${g}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${L(c, .45)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${Dk(c, .35)}"/></linearGradient>`]; }
  const edge = c => `stroke="${Dk(c, .5)}" stroke-width="1.6"`;
  function ball(cx, cy, r, c) { const [g, d] = rg(c); return `<defs>${d}</defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g})" ${edge(c)}/>`; }
  function oval(cx, cy, rx, ry, c, rot = 0) { const [g, d] = rg(c); return `<defs>${d}</defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g})" ${edge(c)} transform="rotate(${rot} ${cx} ${cy})"/>`; }
  // a rolled sausage (cylinder with round ends) from (x1,y1) to (x2,y2)
  function saus(x1, y1, x2, y2, w, c) {
    const len = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const [g, d] = lg(c, true);
    return `<defs>${d}</defs><g transform="translate(${x1} ${y1}) rotate(${a})"><rect x="${-w / 2}" y="${-w / 2}" width="${len + w}" height="${w}" rx="${w / 2}" fill="url(#${g})" ${edge(c)}/></g>`;
  }
  function curl(dPath, w, c) {   // a bent sausage along a path
    return `<path d="${dPath}" fill="none" stroke="${Dk(c, .45)}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="${dPath}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="${dPath}" fill="none" stroke="${L(c, .35)}" stroke-width="${w * .3}" stroke-linecap="round" transform="translate(-2 -2)" opacity=".8"/>`;
  }
  function cone(cx, base, w, h, c, rot = 0) {
    const [g, d] = lg(c, false);
    return `<defs>${d}</defs><g transform="rotate(${rot} ${cx} ${base})"><path d="M${cx - w / 2},${base} L${cx - w * .1},${base - h} Q${cx},${base - h - w * .12} ${cx + w * .1},${base - h} L${cx + w / 2},${base} A${w / 2},${w * .16} 0 0 1 ${cx - w / 2},${base}Z" fill="url(#${g})" ${edge(c)}/></g>`;
  }
  function pancake(cx, cy, rx, ry, c, rot = 0) { const [g, d] = rg(c); return `<defs>${d}</defs><g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy + 4}" rx="${rx}" ry="${ry}" fill="${Dk(c, .35)}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g})" ${edge(c)}/></g>`; }
  function block(x, y, w, h, dd, c) {
    const [g, d] = lg(c, true);
    return `<defs>${d}</defs><polygon points="${x},${y} ${x + dd},${y - dd * .7} ${x + w + dd},${y - dd * .7} ${x + w},${y}" fill="${L(c, .35)}" ${edge(c)} stroke-linejoin="round"/>
      <polygon points="${x + w},${y} ${x + w + dd},${y - dd * .7} ${x + w + dd},${y + h - dd * .7} ${x + w},${y + h}" fill="${Dk(c, .3)}" ${edge(c)} stroke-linejoin="round"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#${g})" ${edge(c)}/>`;
  }
  const tooth = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C9A36A" stroke-width="5" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#E8CFA3" stroke-width="2" stroke-linecap="round"/>`;
  const dot = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .12}" fill="#000" opacity=".16"/>`;
  function pencil(x, y, rot = -35) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="0" y="-7" width="95" height="14" fill="#FFCA28" stroke="${INK}" stroke-width="1.5"/><polygon points="0,-7 -20,0 0,7" fill="#FFE0B2" stroke="${INK}" stroke-width="1.5"/><polygon points="-14,-2 -20,0 -14,2" fill="#333"/><rect x="95" y="-7" width="14" height="14" fill="#EF9A9A" stroke="${INK}" stroke-width="1.5"/></g>`;
  }
  function knife(x, y, rot = -20) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="0" y="-6" width="45" height="12" rx="4" fill="#90CAF9" stroke="${INK}" stroke-width="1.5"/><path d="M45,-6 L110,-6 Q118,0 110,6 L45,6Z" fill="#E3F2FD" stroke="${INK}" stroke-width="1.5"/></g>`;
  }
  function label(x, y, en, th) { return `<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="800" fill="#0D2B6B">${en}</text>${th ? `<text x="${x}" y="${y + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#00695C">${th}</text>` : ""}`; }
  const arrow = (x1, y, x2) => `<line x1="${x1}" y1="${y}" x2="${x2 - 10}" y2="${y}" stroke="#EC407A" stroke-width="6" stroke-linecap="round"/><polygon points="${x2},${y} ${x2 - 16},${y - 10} ${x2 - 16},${y + 10}" fill="#EC407A"/>`;

  // frame: MAKE panel on the left, sculpture on the right
  function frame(left, right) {
    return Art.svg(640, 360, `<rect x="2" y="2" width="636" height="356" rx="18" fill="#FFF8E1"/>
      <rect x="10" y="10" width="220" height="340" rx="14" fill="#fff" stroke="#F8BBD0" stroke-width="3" stroke-dasharray="8 6"/>
      <rect x="20" y="18" width="70" height="24" rx="12" fill="#EC407A"/><text x="55" y="35" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="900" fill="#fff">MAKE</text>
      ${left}${arrow(236, 180, 268)}${right}`, "step-art");
  }
  // a pieces row helper: [{svg, en, th, x, y}] labels under each piece
  const piece = (svg, x, y, en, th) => svg + label(x, y, en, th);

  // ---------- 1. Elephant (book p.70) ----------
  const EB = "#4A84D6";
  const eleBody = () => oval(450, 200, 95, 62, EB);
  const eleLegs = () => saus(395, 230, 395, 292, 30, Dk(EB, .12)) + saus(500, 230, 500, 292, 30, Dk(EB, .12)) + saus(420, 238, 420, 300, 30, EB) + saus(475, 238, 475, 300, 30, EB);
  const eleTail = () => saus(356, 185, 342, 232, 9, EB);
  const eleHead = () => ball(548, 165, 50, EB);
  const eleEar = () => pancake(512, 165, 30, 44, L(EB, .05), -8);
  const eleTrunk = () => curl("M578,185 C600,215 600,260 585,292 C578,305 566,300 570,288", 20, EB);
  const eleFace = () => cone(572, 214, 10, 26, "#FAFAFA", 160) + dot(556, 150, 5) + `<path d="M583,230 l8,0 M584,245 l9,0 M583,260 l8,0" stroke="${Dk(EB, .5)}" stroke-width="2"/>`;
  function elephant(k) {
    const sh = shadow(455, 302, 150);
    const parts = [sh];
    if (k >= 2) parts.push(eleLegs());
    if (k >= 4) parts.push(eleTail());
    parts.push(eleBody());
    if (k >= 3) parts.push(tooth(500, 185, 540, 172));
    if (k >= 5) parts.push(eleEar());
    if (k >= 3) parts.push(eleHead());
    if (k >= 5) parts.push(pancake(522, 162, 26, 38, L(EB, .08), -8));
    if (k >= 4) parts.push(eleTrunk());
    if (k >= 6) parts.push(eleFace());
    const left = [
      piece(ball(80, 110, 42, EB), 80, 175, "Big ball", "ลูกกลมใหญ่") + `<text x="135" y="118" font-size="26" fill="#EC407A" font-weight="900">→</text>` + piece(oval(185, 110, 34, 24, EB), 185, 175, "Oval", "วงรี") + label(120, 240, "Squeeze it long", "บีบให้ยาว"),
      piece(saus(45, 80, 45, 140, 24, EB) + saus(90, 80, 90, 140, 24, EB) + saus(135, 80, 135, 140, 24, EB) + saus(180, 80, 180, 140, 24, EB), 115, 195, "4 thick sausages", "ไส้กรอกอ้วน 4 ชิ้น"),
      piece(ball(80, 110, 38, EB), 80, 175, "Ball", "ลูกกลม") + piece(tooth(150, 85, 190, 135), 170, 175, "Toothpick", "ไม้จิ้มฟัน"),
      piece(curl("M40,95 C90,70 140,120 195,95", 18, EB), 118, 150, "Long sausage", "ไส้กรอกยาว") + piece(saus(80, 215, 160, 215, 9, EB), 120, 250, "Thin sausage", "ไส้กรอกเส้นเล็ก"),
      piece(ball(55, 100, 26, EB) + `<text x="88" y="108" font-size="24" fill="#EC407A" font-weight="900">→</text>` + pancake(150, 100, 40, 32, EB), 115, 165, "Flatten 2 balls", "กดลูกกลม 2 ลูกให้แบน"),
      piece(cone(70, 110, 14, 36, "#FAFAFA") + cone(100, 110, 14, 36, "#FAFAFA"), 85, 150, "2 white cones", "กรวยสีขาว 2 ชิ้น") + piece(pencil(130, 230), 120, 300, "Pencil: eyes, lines", "ดินสอ: ตา เส้น"),
    ][k - 1];
    return frame(left, parts.join(""));
  }

  // ---------- 2. Hippopotamus (book p.69) ----------
  const HB = "#B5543C";
  function hippo(k) {
    const r = [shadow(450, 300, 160)];
    const headX = k >= 4 ? 548 : 575, headY = k >= 4 ? 205 : 160;
    r.push(oval(420, 240, 110, 58, HB));
    const head = () => {
      let s = "";
      if (k >= 3) s += ball(headX - 25, headY - 45, 11, HB) + ball(headX + 10, headY - 48, 11, HB);
      s += oval(headX, headY, 62, 46, HB);
      if (k >= 3) s += ball(headX - 18, headY - 22, 10, L(HB, .6)) + ball(headX + 14, headY - 24, 10, L(HB, .6)) + dot(headX - 16, headY - 20, 4) + dot(headX + 16, headY - 22, 4) + dot(headX + 30, headY + 4, 3) + dot(headX + 44, headY + 2, 3)
        + `<path d="M${headX - 20},${headY + 24} q25,14 55,0" stroke="${Dk(HB, .55)}" stroke-width="3" fill="none"/>` + cone(headX - 6, headY + 30, 10, 18, "#FAFAFA", 180) + cone(headX + 18, headY + 30, 10, 18, "#FAFAFA", 180);
      return s;
    };
    if (k >= 4) r.push(tooth(500, 225, 530, 210));
    r.push(head());
    if (k === 2) r.push(ball(470, 120, 11, HB) + ball(495, 120, 11, HB) + ball(520, 120, 10, L(HB, .6)) + ball(545, 120, 10, L(HB, .6)) + cone(600, 128, 10, 18, "#FAFAFA") + cone(620, 128, 10, 18, "#FAFAFA"));
    const left = [
      piece(oval(95, 100, 60, 34, HB), 115, 160, "Big oval: body", "วงรีใหญ่: ลำตัว") + piece(oval(115, 240, 42, 30, HB), 115, 300, "Oval: head", "วงรี: หัว"),
      piece(ball(45, 95, 11, HB) + ball(75, 95, 11, HB), 60, 135, "2 ears", "หู 2 ข้าง") + piece(ball(150, 95, 10, L(HB, .6)) + ball(180, 95, 10, L(HB, .6)), 165, 135, "2 eyes", "ตา 2 ข้าง") + piece(cone(100, 230, 12, 24, "#FAFAFA") + cone(130, 230, 12, 24, "#FAFAFA"), 115, 265, "2 white teeth", "ฟันสีขาว 2 ซี่"),
      piece(pencil(130, 150), 120, 220, "Stick the parts on.", "ติดชิ้นส่วน") + label(120, 275, "Pencil: nose, mouth", "ดินสอ: จมูก ปาก"),
      piece(tooth(80, 110, 160, 170), 120, 230, "Toothpick:", "ไม้จิ้มฟัน") + label(120, 275, "hold the head", "ยึดหัวไว้"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- 3. Princess doll (book p.66) ----------
  const PD = "#C2504F";
  function doll(k) {
    const r = [shadow(450, 318, 120), pancake(450, 305, 98, 20, PD), cone(450, 310, 170, 165, PD)];
    const face = (x, y) => ball(x, y, 40, L(PD, .15)) + ball(x, y + 6, 7, L(PD, .3)) + dot(x - 14, y - 6, 4) + dot(x + 14, y - 6, 4) + `<path d="M${x - 9},${y + 20} q9,7 18,0" stroke="${INK}" stroke-width="2.5" fill="none"/>`;
    if (k === 2) r.push(face(585, 110), saus(560, 200, 575, 270, 14, PD), saus(600, 200, 615, 270, 14, PD));
    if (k === 3) r.push(face(450, 118), saus(565, 200, 580, 270, 14, PD), saus(600, 200, 615, 270, 14, PD));
    if (k >= 4) r.push(saus(425, 170, 400, 245, 14, PD), saus(475, 170, 500, 245, 14, PD), face(450, 118));
    const left = [
      piece(cone(115, 140, 90, 90, PD), 115, 180, "Cone", "กรวย") + piece(pancake(115, 250, 70, 14, PD), 115, 290, "Spread the bottom", "กดขอบล่างให้บาน"),
      piece(ball(65, 90, 30, L(PD, .15)) + ball(120, 95, 8, L(PD, .3)), 85, 145, "Ball + tiny nose", "ลูกกลม + จมูกเล็ก") + piece(saus(50, 220, 180, 220, 14, PD) + saus(50, 250, 180, 250, 14, PD), 115, 290, "2 thin sausages: arms", "ไส้กรอกเล็ก 2 เส้น: แขน"),
      label(120, 170, "Put the head", "วางหัว") + label(120, 210, "on top of the cone", "บนยอดกรวย"),
      label(120, 160, "Stick the arms", "ติดแขน") + label(120, 200, "on the sides.", "ที่ด้านข้าง") + label(120, 250, "Make a nice pose!", "จัดท่าให้สวย"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- 4. Cutie Bun (book p.67) ----------
  const CB = "#9B59B6", BUN = "#2C3E8F";
  function bun(k) {
    const head = (x, y, rot = 0) => `<g transform="rotate(${rot} ${x} ${y + 40})">${ball(x - 36, y - 28, 13, CB)}${ball(x + 36, y - 28, 13, CB)}${ball(x, y, 45, CB)}${ball(x, y - 50, 17, BUN)}${ball(x, y + 10, 8, L(CB, .25))}${dot(x - 15, y - 8, 4)}${dot(x + 15, y - 8, 4)}<path d="M${x - 8},${y + 25} q8,6 16,0" stroke="${INK}" stroke-width="2.5" fill="none"/></g>`;
    const body = (x, y) => saus(x - 18, y + 30, x - 24, y + 85, 28, CB) + saus(x + 18, y + 30, x + 24, y + 85, 28, CB) + oval(x, y, 40, 50, CB) + saus(x - 36, y - 25, x - 52, y + 20, 13, CB) + saus(x + 36, y - 25, x + 52, y + 20, 13, CB);
    const r = [shadow(450, 315, 110)];
    if (k === 1) r.push(head(450, 170));
    if (k === 2) r.push(head(560, 120), body(410, 220));
    if (k >= 3) r.push(body(450, 225), tooth(450, 200, 450, 165), head(450, 130, k === 4 ? -14 : 0));
    const left = [
      piece(ball(55, 85, 26, CB), 55, 130, "Ball: head", "ลูกกลม: หัว") + piece(ball(130, 80, 9, CB) + ball(155, 80, 9, CB) + ball(180, 80, 9, CB), 155, 115, "Nose, 2 ears", "จมูก หู 2 ข้าง") + piece(ball(115, 205, 15, BUN), 115, 245, "Other colour: bun", "สีอื่น: มวยผม"),
      piece(oval(70, 100, 26, 34, CB), 70, 160, "Oval: body", "วงรี: ลำตัว") + piece(saus(130, 75, 190, 75, 12, CB) + saus(130, 100, 190, 100, 12, CB) + saus(130, 130, 190, 130, 22, CB) + saus(130, 160, 190, 160, 22, CB), 126, 200, "Arms, fat legs (pants)", "แขน ขาอ้วน (กางเกง)"),
      piece(tooth(80, 110, 160, 170), 120, 230, "Toothpick: head on body", "ไม้จิ้มฟัน: ติดหัวกับตัว"),
      label(120, 170, "Turn the head.", "หมุนหัว") + label(120, 215, "Choose a pose!", "เลือกท่าทาง"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- 5. Tank (book p.68) ----------
  const TB = "#2E86DE";
  function tank(k) {
    const r = [shadow(465, 312, 150), block(360, 230, 200, 55, 32, TB)];
    if (k >= 2) r.push(block(400, 182, 120, 48, 26, TB));
    if (k >= 2) [385, 435, 485, 535].forEach(x => r.push(pancake(x, 290, 24, 22, Dk(TB, .15))));
    if (k >= 3) r.push(dot(425, 205, 6), dot(455, 205, 6), dot(485, 205, 6), `<path d="M375,250 l30,0 M420,250 l30,0 M465,250 l30,0 M510,250 l30,0" stroke="${Dk(TB, .55)}" stroke-width="3" stroke-dasharray="6 5"/>`);
    if (k >= 4) r.push(saus(520, 192, 605, 160, 14, TB), ball(552, 246, 9, "#FFD54F"), saus(355, 228, 375, 228, 10, TB));
    const left = [
      piece(block(60, 110, 110, 50, 24, TB), 120, 200, "Block", "ก้อนสี่เหลี่ยม"),
      piece(block(70, 80, 70, 34, 18, TB), 110, 145, "Small block", "ก้อนสี่เหลี่ยมเล็ก") + piece(pancake(60, 220, 20, 18, TB) + pancake(105, 220, 20, 18, TB) + pancake(150, 220, 20, 18, TB) + pancake(195, 220, 20, 18, TB), 125, 265, "Flatten 4 balls: wheels", "กดลูกกลม 4 ลูก: ล้อ"),
      piece(pencil(130, 150), 120, 230, "Pierce windows, etch lines", "เจาะหน้าต่าง ขีดลวดลาย"),
      piece(saus(50, 100, 180, 100, 14, TB), 115, 140, "Sausage: gun", "ไส้กรอก: ปืน") + piece(ball(90, 215, 10, "#FFD54F") + ball(140, 215, 10, "#FFD54F"), 115, 255, "Small balls: lights", "ลูกกลมเล็ก: ไฟ"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- 6. Vase (book p.71) ----------
  const VB = "#2E86DE";
  function vase(k) {
    const r = [shadow(450, 318, 110)];
    const bottle = `<rect x="410" y="120" width="80" height="190" rx="22" fill="#E3F2FD" stroke="#90A4AE" stroke-width="3"/><rect x="428" y="96" width="44" height="30" rx="8" fill="#E3F2FD" stroke="#90A4AE" stroke-width="3"/>`;
    if (k === 1) r.push(bottle, `<path d="M405,180 Q450,170 495,180 L497,305 Q450,322 403,305Z" fill="${VB}" opacity=".9"/>`);
    if (k >= 2) {
      const [g, d] = lg(VB, false);
      r.push(`<defs>${d}</defs><path d="M428,98 L472,98 L478,135 C540,165 540,280 492,312 L408,312 C360,280 360,165 422,135Z" fill="url(#${g})" ${edge(VB)}/>`);
    }
    if (k >= 3) [[420, 200], [480, 200], [450, 250], [405, 260], [495, 260]].forEach(([x, y]) => r.push(pancake(x, y, 13, 11, "#FFD54F") + ball(x, y - 2, 5, "#E53935")));
    if (k >= 4) r.push(`<path d="M440,100 Q420,40 395,30 M455,100 Q460,30 470,18 M465,100 Q500,50 525,45" stroke="#43A047" stroke-width="5" fill="none"/>`, ball(395, 30, 16, "#E91E63"), ball(470, 18, 16, "#AB47BC"), ball(525, 45, 16, "#FF7043"));
    const left = [
      piece(`<rect x="95" y="55" width="50" height="100" rx="14" fill="#E3F2FD" stroke="#90A4AE" stroke-width="3"/>`, 120, 180, "Empty small bottle", "ขวดเล็กเปล่า") + piece(pancake(120, 250, 50, 22, VB), 120, 300, "Flat clay", "ดินแผ่นแบน"),
      piece(ball(70, 100, 20, VB) + `<text x="98" y="108" font-size="22" fill="#2E7D32" font-weight="900">+</text>`, 80, 150, "Add clay", "เพิ่มดิน") + piece(knife(110, 210), 150, 270, "Scrape away", "ขูดออก"),
      piece(pancake(60, 100, 16, 13, "#FFD54F") + ball(60, 98, 6, "#E53935") + pancake(110, 100, 16, 13, "#FFD54F") + ball(110, 98, 6, "#E53935") + pancake(160, 100, 16, 13, "#FFD54F") + ball(160, 98, 6, "#E53935"), 110, 150, "Small flat shapes", "ชิ้นแบนเล็ก ๆ"),
      piece(`<path d="M60,190 Q60,120 50,90 M100,190 Q105,110 110,80 M150,190 Q160,120 180,95" stroke="#43A047" stroke-width="5" fill="none"/>` + ball(50, 88, 14, "#E91E63") + ball(110, 78, 14, "#AB47BC") + ball(180, 93, 14, "#FF7043"), 115, 230, "Water + flowers", "น้ำ + ดอกไม้"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- 7. High relief flowers (book p.72) ----------
  const FS = "#C89A6A";
  function relief(k) {
    const r = [];
    const [g, d] = lg(FS, true);
    r.push(`<defs>${d}</defs><rect x="335" y="60" width="240" height="270" rx="6" fill="url(#${g})" ${edge(FS)}/>`);
    if (k === 1) r.push(knife(470, 346, 0));
    if (k >= 2) {
      const fl = (x, y) => [0, 72, 144, 216, 288].map(a => pancake(x + Math.cos(a * Math.PI / 180) * 16, y + Math.sin(a * Math.PI / 180) * 16, 12, 9, Dk(FS, .18), a)).join("") + ball(x, y, 9, Dk(FS, .35));
      if (k >= 3) {
        r.push(saus(400, 160, 405, 300, 7, Dk(FS, .25)), saus(460, 140, 455, 300, 7, Dk(FS, .25)), saus(515, 170, 510, 300, 7, Dk(FS, .25)));
        r.push(pancake(425, 240, 16, 7, Dk(FS, .2), -30), pancake(485, 260, 16, 7, Dk(FS, .2), 30));
        r.push(fl(400, 145), fl(460, 120), fl(515, 155));
        r.push(`<g stroke="${Dk(FS, .4)}" stroke-width="1.5" opacity=".7">${[80, 100, 120, 300, 315].map(y => `<path d="M345,${y} l12,-6 M545,${y} l12,-6"/>`).join("")}</g>`, pencil(560, 90, 150));
      }
    }
    const left = [
      piece(ball(70, 100, 30, FS) + `<text x="108" y="108" font-size="24" fill="#EC407A" font-weight="900">→</text>` + `<rect x="140" y="70" width="70" height="70" rx="4" fill="${FS}" ${edge(FS)}/>`, 120, 175, "Flatten a thin sheet", "กดเป็นแผ่นบาง") + piece(knife(70, 250), 120, 300, "Trim a rectangle", "ตัดเป็นสี่เหลี่ยม"),
      piece([0, 72, 144, 216, 288].map(a => pancake(70 + Math.cos(a * Math.PI / 180) * 14, 95 + Math.sin(a * Math.PI / 180) * 14, 10, 8, Dk(FS, .18), a)).join("") + ball(70, 95, 7, Dk(FS, .35)), 70, 145, "Petals + centre", "กลีบ + เกสร") + piece(saus(140, 70, 140, 130, 7, Dk(FS, .25)) + saus(175, 70, 175, 130, 7, Dk(FS, .25)), 160, 160, "Stems", "ก้าน") + piece(pancake(80, 230, 18, 8, Dk(FS, .2), -30) + pancake(140, 230, 18, 8, Dk(FS, .2), 30), 110, 270, "Leaves", "ใบ"),
      label(120, 150, "Arrange the flowers.", "จัดวางดอกไม้") + label(120, 200, "Pencil: blend joints,", "ดินสอ: เกลี่ยรอยต่อ") + label(120, 240, "draw the background.", "วาดลายพื้นหลัง"),
    ][k - 1];
    return frame(left, r.join(""));
  }

  // ---------- the six basic shapes (lesson slide) ----------
  function shapes() {
    const c = "#FF8A65";
    return Art.svg(720, 250, `<rect width="720" height="250" rx="18" fill="#FFF8E1"/>
      ${ball(70, 100, 40, c)}${label(70, 180, "Ball", "ลูกกลม")}
      ${saus(150, 100, 250, 100, 30, c)}${label(200, 180, "Sausage", "ไส้กรอก")}
      ${pancake(330, 100, 50, 28, c)}${label(330, 180, "Pancake", "แผ่นแบน")}
      ${cone(440, 140, 70, 85, c)}${label(440, 180, "Cone", "กรวย")}
      ${oval(545, 100, 48, 32, c)}${label(545, 180, "Oval", "วงรี")}
      ${block(615, 85, 60, 45, 22, c)}${label(660, 180, "Block", "ก้อนเหลี่ยม")}`, "step-art");
  }
  function addReduce(which) {
    const c = "#4A84D6";
    if (which === "add") return Art.svg(560, 260, `<rect width="560" height="260" rx="18" fill="#E8F5E9"/>${oval(300, 160, 110, 60, c)}${ball(120, 90, 26, c)}${arrow(160, 100, 230)}<text x="455" y="70" font-size="60" font-weight="900" fill="#2E7D32" font-family="system-ui">+</text>`, "step-art");
    return Art.svg(560, 260, `<rect width="560" height="260" rx="18" fill="#FFEBEE"/>${oval(260, 160, 120, 60, c)}${knife(330, 100, 25)}<path d="M380,150 q20,10 40,0 q20,-10 40,0" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><text x="455" y="70" font-size="60" font-weight="900" fill="#C62828" font-family="system-ui">−</text>`, "step-art");
  }
  function tools() {
    return Art.svg(640, 230, `<rect width="640" height="230" rx="18" fill="#FFF8E1"/>${pencil(70, 110, -10)}${label(120, 190, "Pencil: pierce, etch", "ดินสอ: เจาะ ขีดลาย")}
      ${tooth(270, 140, 360, 70)}${label(315, 190, "Toothpick: join", "ไม้จิ้มฟัน: ยึดชิ้นงาน")}
      ${knife(430, 110, -10)}${label(500, 190, "Plastic knife: trim", "มีดพลาสติก: ตัดแต่ง")}`, "step-art");
  }
  // test pictures
  function headBody() { const c = "#9B59B6"; return Art.svg(360, 200, `<rect width="360" height="200" rx="14" fill="#FFF8E1"/>${ball(95, 100, 45, c)}${ball(95, 50, 15, "#2C3E8F")}${dot(80, 95)}${dot(110, 95)}${oval(255, 115, 38, 48, c)}${saus(240, 150, 236, 185, 22, c)}${saus(270, 150, 274, 185, 22, c)}${tooth(255, 70, 255, 40)}`, "step-art"); }

  const P = { elephant: [elephant, 6], hippo: [hippo, 4], doll: [doll, 4], bun: [bun, 4], tank: [tank, 4], vase: [vase, 4], relief: [relief, 3] };
  return {
    draw: (g, k) => P[g] ? P[g][0](k) : `<p>(missing ${g})</p>`,
    count: g => P[g] ? P[g][1] : 0,
    has: g => !!P[g],
    names: () => Object.keys(P),
    shapes, addReduce, headBody, tools,
  };
})();
