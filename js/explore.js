// Explore: interactive light and shadow tools for the projector. Each tool returns a cleanup function (or nothing).
const Explore = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const L = Art.light, Dk = Art.dark;

  // ---------- 1. Move the light: drag the sun, the ball and the box change ----------
  function light(box) {
    let sx = 120, sy = 70;
    box.innerHTML = `<svg class="ex-svg" id="lt" viewBox="0 0 640 380"></svg>
      <div class="ex-btns"><button class="chip" data-p="left">☀️ Left<span class="th">ซ้าย</span></button><button class="chip" data-p="top">☀️ Top<span class="th">บน</span></button><button class="chip" data-p="right">☀️ Right<span class="th">ขวา</span></button></div>`;
    const svg = box.querySelector("#lt");
    function draw() {
      const bx = 230, by = 250, r = 80;                       // ball
      const ang = Math.atan2(sy - by, sx - bx);
      const ux = Math.cos(ang), uy = Math.sin(ang);
      const lowSun = Math.max(.25, Math.min(1, (330 - sy) / 260));   // higher sun = shorter shadow
      const len = 60 + (1 - lowSun) * 220;
      // box faces: brightness from where the sun is
      const cx = 430, cy = 210, s = 110, dx = 50, dy = -40;
      const fFront = .1 + (-uy) * .15 + (ux < 0 ? .2 : -.1), fTop = .2 + (-uy) * .5, fSide = ux > 0 ? .35 * ux : -.55 * -ux * .9 - .1;
      const c = (v, col) => v >= 0 ? L(col, Math.min(.85, v)) : Dk(col, Math.min(.7, -v));
      svg.innerHTML = `
        <defs><radialGradient id="eb" cx="${.5 + ux * .3}" cy="${.5 + uy * .3}" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${L("#E53935", .2)}"/><stop offset=".8" stop-color="${Dk("#E53935", .35)}"/><stop offset="1" stop-color="${Dk("#E53935", .55)}"/></radialGradient>
        <radialGradient id="es"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
        <rect width="640" height="380" fill="#FFFDF7"/><rect y="330" width="640" height="50" fill="#EFEBE9"/>
        <ellipse cx="${bx - ux * len * .6}" cy="333" rx="${r * .9 + len * .35}" ry="16" fill="url(#es)"/>
        <circle cx="${bx}" cy="${by}" r="${r}" fill="url(#eb)"/>
        <polygon points="${cx},${cy + s} ${cx + s + dx},${cy + s + dy} ${cx + s + dx - ux * len},${cy + s + 12} ${cx - ux * len},${cy + s + 22}" fill="#000" opacity=".2"/>
        <polygon points="${cx},${cy} ${cx + s},${cy} ${cx + s},${cy + s} ${cx},${cy + s}" fill="${c(fFront, "#1E88E5")}" stroke="#2b2b2b" stroke-width="2.5"/>
        <polygon points="${cx},${cy} ${cx + dx},${cy + dy} ${cx + s + dx},${cy + dy} ${cx + s},${cy}" fill="${c(fTop, "#1E88E5")}" stroke="#2b2b2b" stroke-width="2.5"/>
        <polygon points="${cx + s},${cy} ${cx + s + dx},${cy + dy} ${cx + s + dx},${cy + s + dy} ${cx + s},${cy + s}" fill="${c(fSide, "#1E88E5")}" stroke="#2b2b2b" stroke-width="2.5"/>
        <g id="sun" style="cursor:grab">${Art.sun(sx, sy, 26)}<circle cx="${sx}" cy="${sy}" r="44" fill="transparent"/></g>`;
    }
    function pt(e) { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 640, (e.clientY - r.top) / r.height * 380]; }
    let drag = false;
    svg.addEventListener("pointerdown", e => { const [x, y] = pt(e); if (Math.hypot(x - sx, y - sy) < 60) { drag = true; svg.setPointerCapture(e.pointerId); } });
    svg.addEventListener("pointermove", e => { if (!drag) return; const [x, y] = pt(e); sx = Math.max(30, Math.min(610, x)); sy = Math.max(30, Math.min(150, y)); draw(); });
    ["pointerup", "pointercancel"].forEach(t => svg.addEventListener(t, () => { drag = false; }));
    box.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { ({ left: () => { sx = 40; sy = 110; }, top: () => { sx = 330; sy = 35; }, right: () => { sx = 610; sy = 110; } })[b.dataset.p](); draw(); });
    draw();
  }

  // ---------- 2. 2D to 3D: a slider adds depth and shading ----------
  function depth(box) {
    box.innerHTML = `<svg class="ex-svg" id="dp" viewBox="0 0 640 320"></svg>
      <div class="ex-slider"><span>2D</span><input type="range" min="0" max="100" value="0" id="dpr"><span>3D</span></div>
      <div class="ex-btns" id="dpl"></div>`;
    const svg = box.querySelector("#dp"), rng = box.querySelector("#dpr");
    function draw() {
      const t = rng.value / 100;
      const x = 80, y = 110, s = 150, dx = 70 * t, dy = -56 * t;
      const sh = v => Art.mix("#ffffff", v, t);
      svg.innerHTML = `<defs><radialGradient id="dg" cx=".35" cy=".32" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="${sh("#FFB74D")}"/><stop offset="1" stop-color="${sh("#E65100")}"/></radialGradient></defs>
        <rect width="640" height="320" fill="#FFFDF7"/>
        ${t > .05 ? `<polygon points="${x + s},${y + s} ${x + s + dx},${y + s + dy} ${x + s + dx + 120 * t},${y + s + dy + 30} ${x + s + 110 * t},${y + s + 20}" fill="#000" opacity="${.2 * t}"/>` : ""}
        <polygon points="${x},${y} ${x + dx},${y + dy} ${x + s + dx},${y + dy} ${x + s},${y}" fill="${sh("#BBDEFB")}" stroke="#2b2b2b" stroke-width="2.5" opacity="${t > .02 ? 1 : 0}"/>
        <polygon points="${x + s},${y} ${x + s + dx},${y + dy} ${x + s + dx},${y + s + dy} ${x + s},${y + s}" fill="${sh("#0D47A1")}" stroke="#2b2b2b" stroke-width="2.5" opacity="${t > .02 ? 1 : 0}"/>
        <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${sh("#42A5F5")}" stroke="#2b2b2b" stroke-width="3"/>
        ${t > .05 ? `<ellipse cx="${480 + 60 * t}" cy="${270}" rx="${90 * t}" ry="${14 * t}" fill="#000" opacity="${.25 * t}"/>` : ""}
        <circle cx="480" cy="185" r="80" fill="url(#dg)" stroke="#2b2b2b" stroke-width="3"/>`;
      box.querySelector("#dpl").innerHTML = t < .2 ? `<b>Flat: width and length<span class="th">แบน: กว้างและยาว</span></b>` : t < .8 ? `<b>Adding depth and shading...<span class="th">กำลังเพิ่มความลึกและการแรเงา...</span></b>` : `<b>3D: width, length and depth!<span class="th">3 มิติ: กว้าง ยาว และลึก</span></b>`;
    }
    rng.oninput = draw;
    draw();
  }

  // ---------- 3. Light, medium, heavy ----------
  function shade(box) {
    let lvl = 0;
    box.innerHTML = `<div class="ex-btns">${[["Light", "อ่อน"], ["Medium", "กลาง"], ["Heavy", "เข้ม"]].map((x, k) => `<button class="chip" data-l="${k}">${x[0]}<span class="th">${x[1]}</span></button>`).join("")}</div><div id="shv"></div>`;
    function draw() {
      const gap = [14, 7, 3.5][lvl], w = [1.4, 1.6, 1.8][lvl];
      box.querySelectorAll("[data-l]").forEach(b => b.classList.toggle("on", +b.dataset.l === lvl));
      box.querySelector("#shv").innerHTML = Art.svg(640, 260, `${Art.hatchBox(30, 30, 200, 200, gap, w)}<rect x="270" y="30" width="200" height="200" rx="8" fill="${Art.mix("#ffffff", "#212121", [.2, .5, .82][lvl])}" stroke="#2b2b2b" stroke-width="2.5"/>${Art.hatchBall(560, 130, 65, { shadow: false })}`, "ex-svg")
        + `<p style="text-align:center;font-weight:800">${["Few lines, far apart. Press softly.", "More lines, closer.", "Many lines, very close. Press harder."][lvl]}<span class="th">${["เส้นน้อย ห่างกัน กดเบา ๆ", "เส้นมากขึ้น ชิดขึ้น", "เส้นมาก ชิดกันมาก กดแรงขึ้น"][lvl]}</span></p>`;
    }
    box.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { lvl = +b.dataset.l; draw(); });
    draw();
  }

  return { light, depth, shade };
})();
