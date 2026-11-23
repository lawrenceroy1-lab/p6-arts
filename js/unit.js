// Unit page: loads content/unitXX.json and shows it for teaching on the projector.
// No logins and no scores: T. Roy teaches, students work on paper.

const UNIT_ID = new URLSearchParams(location.search).get("u") || "03";
const BUILD = 7;               // must match "build" in content/unitXX.json (made by tools/build_unitXX.py)
let D = null;
let tab = "need";
let cleanup = null;
let keyNav = null;           // left / right arrow keys for the current view

const TABS = [
  { id: "need", e: "🎒", en: "What you need", th: "สิ่งที่ต้องใช้", c: "#FFB300" },
  { id: "words", e: "🔤", en: "Words", th: "คำศัพท์", c: "#26A69A" },
  { id: "lessons", e: "📘", en: "Lessons", th: "บทเรียน", c: "#1E88E5" },
  { id: "draw", e: "✏️", en: "Draw: The beach", th: "วาดภาพ: ชายหาด", c: "#EC407A" },
  { id: "acts", e: "📝", en: "Book activities", th: "กิจกรรมในหนังสือ", c: "#EF6C00" },
  { id: "test", e: "✅", en: "Unit test", th: "แบบทดสอบ", c: "#2E7D32" },
  { id: "games", e: "🎮", en: "Class games", th: "เกมในห้อง", c: "#0D2B6B" },
];

// ---------- helpers ----------
const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const B = p => p ? `${esc(p[0])}<span class="th">${esc(p[1])}</span>` : "";      // English + Thai under it
const view = () => document.getElementById("view");
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plain = p => p ? p[0] : "";
function pic(p, cls) {
  if (!p) return "";
  const inner = p.img ? `<img src="${p.img}" alt="${esc(p.cap ? p.cap[0] : "")}" loading="lazy" decoding="async">` : Art.fig(p.fig);
  return `<figure class="pic ${cls || ""}">${inner}${p.cap ? `<figcaption>${B(p.cap)}</figcaption>` : ""}</figure>`;
}
function say(text) {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = "en-GB"; u.rate = .8; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { }
}
function sideList(title, names, cur) {
  return `<nav class="sidelist"><h3>${title}</h3>${names.map((n, k) => `<button class="${k === cur ? "on" : ""}" data-j="${k}"><span class="n">${k + 1}</span><span>${n}</span></button>`).join("")}</nav>`;
}
const withSide = (main, side) => `<div class="with-side"><div class="side-main">${main}</div>${side}</div>`;
function onJump(f) {
  view().querySelectorAll(".sidelist button").forEach(b => b.onclick = () => f(+b.dataset.j));
  const on = view().querySelector(".sidelist button.on");
  if (on && on.parentElement.scrollHeight > on.parentElement.clientHeight) on.parentElement.scrollTop = on.offsetTop - 80;
}
const on = (id, f) => { const e = document.getElementById(id); if (e) e.onclick = f; };
function navBtns(i, n, prevId, nextId, last) {
  return `<div class="nav"><button class="bigbtn grey" id="${prevId}" ${i === 0 ? "disabled" : ""}>⬅ Back<span class="th">ย้อนกลับ</span></button>
    <span class="dots">${i + 1} / ${n}</span>
    <button class="bigbtn" id="${nextId}" ${i === n - 1 && !last ? "disabled" : ""}>${i === n - 1 && last ? last : `Next ➡<span class="th">ถัดไป</span>`}</button></div>`;
}

// ---------- top buttons: Thai on/off, projector mode ----------
function topButtons() {
  const thOn = store.get("thai", true);
  document.body.classList.toggle("no-th", !thOn);
  document.getElementById("topBtns").innerHTML = `
    <button class="tbtn ${thOn ? "on" : ""}" id="thSw">🇹🇭 ไทย ${thOn ? "✓" : "✗"}</button>
    <button class="tbtn" id="bigSw">${document.body.classList.contains("big") ? "↩ Normal" : "📺 Projector"}</button>`;
  on("thSw", () => { store.set("thai", !store.get("thai", true)); topButtons(); });
  on("bigSw", () => {
    const big = !document.body.classList.contains("big");
    document.body.classList.toggle("big", big);
    try { big ? document.documentElement.requestFullscreen() : document.exitFullscreen(); } catch (e) { }
    topButtons();
  });
}
document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement) { document.body.classList.remove("big"); topButtons(); } });
document.addEventListener("keydown", e => {
  if (!keyNav || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key === "ArrowRight" || e.key === "PageDown") { keyNav(1); e.preventDefault(); }
  if (e.key === "ArrowLeft" || e.key === "PageUp") { keyNav(-1); e.preventDefault(); }
});

// ---------- load ----------
fetch(`content/unit${UNIT_ID}.json`, { cache: "no-cache" })
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(d => {
    // An old copy of this page (saved by the browser) with new content: load the newest page once.
    if (d.build !== BUILD) {
      let tried = false; try { tried = sessionStorage.getItem("reloaded") === String(d.build); sessionStorage.setItem("reloaded", String(d.build)); } catch (e) { }
      if (!tried) { location.replace(location.pathname + location.search.replace(/&?fresh=\d+/, "") + (location.search ? "&" : "?") + "fresh=" + Date.now() + location.hash); return; }
    }
    D = d;
    document.title = `Unit ${Number(d.unit)}: ${d.title[0]} | T. Roy`;
    document.getElementById("unitTitle").innerHTML = `<span class="uchip">Unit ${Number(d.unit)}</span><span>${B(d.title)}</span><span class="badge">📖 ${esc(d.pages)}</span>`;
    const h = new URLSearchParams(location.hash.slice(1));
    if (TABS.some(t => t.id === h.get("t"))) tab = h.get("t");
    topButtons(); renderTabs(); go(+h.get("i") || 0);
  })
  .catch(() => { document.getElementById("unitTitle").textContent = "This unit is coming soon 🙂"; });

function renderTabs() {
  document.getElementById("tabs").innerHTML = TABS.map(t => `<button class="tab ${t.id === tab ? "on" : ""}" style="--c:${t.c}" data-t="${t.id}"><span class="e">${t.e}</span>${t.en}<span class="th">${t.th}</span></button>`).join("");
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => { tab = b.dataset.t; renderTabs(); go(0); });
}
function setHash(i) { history.replaceState(null, "", `#t=${tab}${i ? `&i=${i}` : ""}`); }
function go(i) {
  if (cleanup) { cleanup(); cleanup = null; }
  keyNav = null;
  if (window.DrawPad) DrawPad.clear();
  ({ need: Need, words: Words, lessons: Lessons, draw: DrawAlong, acts: Activities, test: TestReview, games: Games })[tab](i || 0);
}
const header = (t, extra) => `<div class="panel-title"><h2>${t}</h2>${extra || ""}</div>`;

// =============== 🎒 WHAT YOU NEED ===============
function Need() {
  setHash(0);
  const m = D.materials, r = m.recommend;
  const card = x => `<div class="mat">${Art.fig(x.fig)}<h3>${B(x.name)}</h3>${x.note ? `<p>${B(x.note)}</p>` : ""}</div>`;
  view().innerHTML = `<div class="panel">${header(`🎒 What you need<span class="th">สิ่งที่ต้องใช้</span>`)}
    <p style="font-weight:800">${B(m.intro)}</p>
    <h3 class="section-h">✅ Everyone needs<span class="th">ทุกคนต้องมี</span></h3>
    <div class="mat-grid">${m.must.map(card).join("")}</div>
    <h3 class="section-h">🎨 Colours: we use<span class="th">สีที่เราใช้</span></h3>
    <div class="rec">
      <div class="mat best"><span class="star">⭐ Recommended · แนะนำ</span>${Art.fig(r.fig)}<h3>${B(r.name)}</h3></div>
      <div class="rec-why"><h3>Why?<span class="th">ทำไม</span></h3><ul>${r.why.map(w => `<li>${B(w)}</li>`).join("")}</ul></div>
    </div>
    ${pic(r.example)}
    <div class="btnrow"><button class="bigbtn green" id="toWords">Start: Words ➡<span class="th">เริ่ม: คำศัพท์</span></button></div></div>`;
  on("toWords", () => { tab = "words"; renderTabs(); go(0); });
}

// =============== 🔤 WORDS ===============
function Words() {
  setHash(0);
  view().innerHTML = `<div class="panel">${header(`🔤 Words<span class="th">คำศัพท์</span>`, `<span class="badge">📖 p.${D.vocabPage}</span>`)}
    <p class="small">The most important words. All words are in your book on p.${D.vocabPage}. · คำศัพท์ทั้งหมดอยู่ในหนังสือหน้า ${D.vocabPage}</p>
    <p class="small">Tap 🔊 to hear the word. · แตะ 🔊 เพื่อฟังเสียง</p>
    <div class="word-grid">${D.vocab.map((v, k) => `<div class="word"><button class="say" data-k="${k}" title="Listen">🔊</button>
      <div class="em">${v[4]}</div><h3>${esc(v[0])} <span class="pos">${esc(v[1])}</span></h3>
      <div class="thm">${esc(v[2])}</div><div class="ex">${B(v[3])}</div></div>`).join("")}</div>
    <div class="btnrow"><button class="bigbtn green" id="toLessons">Next: Lessons ➡<span class="th">ต่อไป: บทเรียน</span></button></div></div>`;
  view().querySelectorAll(".say").forEach(b => b.onclick = () => { const v = D.vocab[+b.dataset.k]; say(`${v[0]}. ${v[3][0]}`); });
  on("toLessons", () => { tab = "lessons"; renderTabs(); go(0); });
}

// =============== 📘 LESSONS (slides) ===============
function Lessons(start) {
  const S = D.slides;
  let i = Math.min(start, S.length - 1), shown = false;
  const cls = s => ({ "FINGER VOTE": "r-vote", "UNIT REVIEW": "r-vote", "PENCIL PRACTICE": "r-pencil", "COLOUR SHADING": "r-colour", "PICTURE DETECTIVES": "r-detective", "EXTENSION": "r-extension", "UNIT 3": "r-start", "DRAW ALONG": "r-draw" })[s.routine[0]] || "";
  function draw() {
    setHash(i);
    const s = S[i], v = s.vote;
    const pics = v && shown && (v.img || v.fig) ? [{ img: v.img, fig: v.fig }] : s.pics;
    const pcls = s.layout === "grid6" ? "grid6" : `n${Math.min(pics.length, 3)}`;
    view().innerHTML = withSide(`<div class="slide ${cls(s)}">
      <div class="slide-top"><span class="routine">${B(s.routine)}</span><span class="badge">📖 p.${s.page}</span></div>
      <div class="slide-body"><h2>${B(s.title)}</h2>
        <ul class="lines">${s.lines.map(l => `<li>${B(l)}</li>`).join("")}</ul>
        <div class="pics ${pcls}">${pics.map(p => pic(p)).join("")}</div>
        ${v ? `<div class="vote-opts">${v.options.map((o, k) => `<button class="vote-opt c${k} ${shown ? (k === v.answer ? "right" : "dim") : ""}">${B(o)}</button>`).join("")}</div>
          <div class="btnrow"><button class="bigbtn ${shown ? "grey" : "green"}" id="ans">${shown ? `🙈 Hide answer<span class="th">ซ่อนคำตอบ</span>` : `👀 Show answer<span class="th">ดูคำตอบ</span>`}</button></div>
          ${shown ? `<div class="answer-box">✅ <span class="final">${B(v.options[v.answer])}</span><div>${B(v.why)}</div></div>` : ""}` : ""}
        ${s.tip ? `<div class="tip">💡 ${B(s.tip)}</div>` : ""}
      </div></div>
      ${navBtns(i, S.length, "lp", "ln", `Book activities ➡<span class="th">กิจกรรมในหนังสือ</span>`)}`,
      sideList(`📘 Slides<span class="th">สไลด์</span>`, S.map(x => esc(plain(x.title))), i));
    on("ans", () => { shown = !shown; draw(); });
    on("lp", () => move(-1));
    on("ln", () => { if (i === S.length - 1) { tab = "acts"; renderTabs(); go(0); } else move(1); });
    if (s.routine[0] === "DRAW ALONG") { view().querySelector(".slide-body").insertAdjacentHTML("beforeend", `<div class="btnrow"><button class="bigbtn pink" id="toDraw">✏️ Start drawing<span class="th">เริ่มวาด</span></button></div>`); on("toDraw", () => { tab = "draw"; renderTabs(); go(0); }); }
    onJump(k => { i = k; shown = false; draw(); });
  }
  function move(d) { const n = i + d; if (n < 0 || n >= S.length) return; i = n; shown = false; if (window.DrawPad) DrawPad.clear(); draw(); window.scrollTo({ top: document.getElementById("tabs").offsetTop - 6, behavior: "smooth" }); }
  keyNav = move;
  draw();
}

// =============== ✏️ TODAY'S DRAWING (the beach) + help for book activities ===============
const stepPic = (guide, k) => guide.imgs ? `<img class="step-img" src="${guide.imgs[k - 1]}" alt="Step ${k}" loading="lazy">` : Steps.draw(guide.id, k);
function DrawAlong(start) {
  const G = D.guides, P = D.project;
  let g = Math.min(start, G.length - 1), k = 1;
  function draw() {
    setHash(g);
    const guide = G[g], n = guide.steps.length, last = k === n;
    view().innerHTML = `<div class="panel">${header(g === 0 ? `✏️ ${B(P.title)}` : `✏️ ${B(guide.title)}`, `<span class="badge">📖 p.${guide.page}</span>`)}
      ${g === 0 && k === 1 ? `<div class="goal">${pic(P.goal)}</div>` : ""}
      <div class="step-card">
        <span class="stepno">Step ${k} of ${n} · ขั้นที่ ${k}${guide.names ? ` · ${esc(guide.names[k - 1][0])}` : ""}</span>
        ${guide.names ? `<div class="small" style="font-weight:800;color:var(--th)">${esc(guide.names[k - 1][1])}</div>` : ""}
        <div class="steptext">${B(guide.steps[k - 1])}</div>
        ${stepPic(guide, k)}
      </div>
      <div class="step-strip">${guide.steps.map((_, j) => `<button class="${j + 1 === k ? "on" : ""}" data-k="${j + 1}">${stepPic(guide, j + 1)}<div class="sn">${j + 1}</div></button>`).join("")}</div>
      ${g === 0 && last ? `<div class="check"><h3>👫 Partner check<span class="th">ให้เพื่อนตรวจ</span></h3><ol>${P.check.map(c => `<li>☐ ${B(c)}</li>`).join("")}</ol></div>` : ""}
      ${navBtns(k - 1, n, "dp", "dn")}
      <div class="guide-pick small-pick">${G.map((x, j) => `<button class="chip ${j === g ? "on" : ""}" data-g="${j}">${B(x.title)}</button>`).join("")}</div></div>`;
    view().querySelectorAll("[data-g]").forEach(b => b.onclick = () => { g = +b.dataset.g; k = 1; draw(); });
    view().querySelectorAll("[data-k]").forEach(b => b.onclick = () => { k = +b.dataset.k; draw(); });
    on("dp", () => move(-1));
    on("dn", () => move(1));
  }
  function move(d) { const n = G[g].steps.length; if (k + d < 1 || k + d > n) return; k += d; if (window.DrawPad) DrawPad.clear(); draw(); }
  keyNav = move;
  draw();
}

// =============== 📝 BOOK ACTIVITIES ===============
function Activities(start) {
  const A = D.activities;
  let i = Math.min(start, A.length - 1), shown = false, picks = {};
  function draw() {
    setHash(i);
    const a = A[i];
    let body = "";
    if (a.kind === "sort") {
      body = `<div class="sort-pool">${a.items.map((it, k) => {
        const p = picks[k];
        const st = shown ? (p ? (p === it[1] ? "ok" : "no-ok") : "") : "";
        const src = a.imgs && a.imgs[it[0]] ? `<img src="${a.imgs[it[0]]}" alt="" loading="lazy">` : Art.fig(it[0]);
        return `<div class="sort-item ${st}"><span class="no">${k + 1}</span>${src}
          <div class="tag2">${["2D", "3D"].map(t => `<button data-k="${k}" data-t="${t}" class="${p === t ? "on" : ""}">${t}</button>`).join("")}</div></div>`;
      }).join("")}</div><p class="small">Tap 2D or 3D under each picture. · แตะ 2D หรือ 3D ใต้ภาพแต่ละภาพ</p>`;
    }
    if (a.example) body += `<h3 style="margin-top:14px">💡 Ideas<span class="th">ตัวอย่างไอเดีย</span></h3><div class="pics n${Math.min(a.example.length, 3)}">${a.example.map(p => pic(p)).join("")}</div>`;
    const rub = a.rubric ? `<div class="rub-wrap"><table class="rub"><tr><th>${B(D.rubric.title)}</th>${D.rubric.cols.map(c => `<th>${B(c)}</th>`).join("")}</tr>
      ${D.rubric.rows.map((r, k) => `<tr><td>${k + 1}. ${B(r)}</td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>
      <table class="rub" style="margin-top:8px"><tr><th>Score<span class="th">คะแนน</span></th><th>Quality<span class="th">คุณภาพ</span></th><th>Result<span class="th">ผล</span></th></tr>
      ${D.rubric.levels.map(l => `<tr><td>${l[0]}</td><td>${B(l[1])}</td><td>${l[2]}</td></tr>`).join("")}</table></div>` : "";
    view().innerHTML = withSide(`<div class="q-card">
      <div class="q-head"><span>Activity ${a.num} · กิจกรรมที่ ${a.num}</span><span class="badge">📖 p.${a.page} · ${a.marks} marks</span></div>
      <div class="q-body">
        <div class="q-text">${B(a.title)}</div>
        <p style="font-weight:800">${B(a.task)}</p>
        <ol class="steps">${a.steps.map(s => `<li>${B(s)}</li>`).join("")}</ol>
        ${body}
        ${a.guide ? `<div class="btnrow"><button class="bigbtn pink" id="toGuide">✏️ Draw along: step by step<span class="th">วาดตามทีละขั้น</span></button></div>` : ""}
        <div class="score-card"><h3>📋 Scoring criteria<span class="th">เกณฑ์การให้คะแนน</span></h3><p style="font-weight:800;margin:0">${B(a.scoring)}</p>${rub}</div>
        <div class="btnrow"><button class="bigbtn ${shown ? "grey" : "green"}" id="ans">${shown ? `🙈 Hide answer<span class="th">ซ่อนคำตอบ</span>` : `👀 Show answer<span class="th">ดูคำตอบ</span>`}</button></div>
        ${shown ? `<div class="answer-box">✅ ${B(a.answer)}</div>` : ""}
      </div></div>
      ${navBtns(i, A.length, "ap", "an", `Unit test ➡<span class="th">แบบทดสอบ</span>`)}`,
      sideList(`📝 Activities<span class="th">กิจกรรม</span>`, A.map(x => `${esc(plain(x.title))} (p.${x.page})`), i));
    view().querySelectorAll(".tag2 button").forEach(b => b.onclick = () => { picks[+b.dataset.k] = b.dataset.t; draw(); });
    on("ans", () => { shown = !shown; draw(); });
    on("toGuide", () => { tab = "draw"; renderTabs(); go(D.guides.findIndex(g => g.id === a.guide)); });
    on("ap", () => move(-1));
    on("an", () => { if (i === A.length - 1) { tab = "test"; renderTabs(); go(0); } else move(1); });
    onJump(k => { i = k; shown = false; picks = {}; draw(); });
  }
  function move(d) { const n = i + d; if (n < 0 || n >= A.length) return; i = n; shown = false; picks = {}; draw(); }
  keyNav = move;
  draw();
}

// =============== ✅ UNIT TEST (class review, nothing is saved) ===============
function TestReview(start) {
  const Q = D.test.questions;
  let i = Math.min(start, Q.length - 1), shown = false;
  const L = ["a", "b", "c", "d"];
  const opt = o => typeof o === "string" && o.startsWith("fig:") ? Art.fig(o.slice(4)) : B(o);
  function draw() {
    setHash(i);
    const q = Q[i];
    const isPic = q.options.some(o => typeof o === "string");
    view().innerHTML = withSide(`<div class="q-card">
      <div class="q-head"><span>Question ${i + 1} · ข้อ ${i + 1}</span><span class="badge">📖 p.${q.page}</span></div>
      <div class="q-body">
        <div class="q-text">${B(q.q)}</div>
        ${q.img ? `<div class="q-fig"><img src="${q.img}" alt="" loading="lazy"></div>` : q.fig ? `<div class="q-fig">${Art.fig(q.fig)}</div>` : ""}
        <p class="small">Finger vote: a = 1 · b = 2 · c = 3 · d = 4 · ชูนิ้วเลือกคำตอบ</p>
        <div class="opts">${q.options.map((o, k) => `<div class="opt ${isPic ? "pic" : ""} c${k} ${shown ? (k === q.answer ? "right" : "dim") : ""}"><span class="let">${L[k]}</span><span style="flex:1">${opt(o)}</span></div>`).join("")}</div>
        <div class="btnrow"><button class="bigbtn ${shown ? "grey" : "green"}" id="ans">${shown ? `🙈 Hide answer<span class="th">ซ่อนคำตอบ</span>` : `👀 Show answer<span class="th">ดูคำตอบ</span>`}</button></div>
        ${shown ? `<div class="answer-box">✅ Answer: <span class="final">${L[q.answer]}</span><div>${B(q.why)}</div></div>` : ""}
      </div></div>
      ${navBtns(i, Q.length, "tp", "tn", `Class games ➡<span class="th">เกมในห้อง</span>`)}`,
      sideList(`✅ Unit test<span class="th">แบบทดสอบ</span>`, Q.map((x, k) => `${esc(plain(x.q))}`), i));
    on("ans", () => { shown = !shown; draw(); });
    on("tp", () => move(-1));
    on("tn", () => { if (i === Q.length - 1) { tab = "games"; renderTabs(); go(0); } else move(1); });
    onJump(k => { i = k; shown = false; draw(); });
  }
  function move(d) { const n = i + d; if (n < 0 || n >= Q.length) return; i = n; shown = false; if (window.DrawPad) DrawPad.clear(); draw(); }
  keyNav = move;
  draw();
}

// =============== 🎮 CLASS GAMES (projector) ===============
let game = "flash";
function Games() {
  setHash(0);
  const G = [
    { id: "flash", e: "🃏", en: "Flashcards", th: "บัตรคำ" },
    { id: "match", e: "🧩", en: "Match game", th: "เกมจับคู่" },
    { id: "quiz", e: "⚡", en: "Speed quiz", th: "ตอบเร็ว" },
    { id: "battle", e: "🏆", en: "Team battle", th: "แข่งเป็นทีม" },
  ];
  view().innerHTML = `<div class="game-pick">${G.map(g => `<button class="tab ${g.id === game ? "on" : ""}" style="--c:#0D2B6B" data-g="${g.id}"><span class="e">${g.e}</span>${g.en}<span class="th">${g.th}</span></button>`).join("")}</div><div id="gameBox"></div>`;
  view().querySelectorAll("[data-g]").forEach(b => b.onclick = () => { game = b.dataset.g; go(0); });
  ({ flash: Flash, match: Match, quiz: Quiz, battle: Battle })[game](document.getElementById("gameBox"));
}

function Flash(box) {
  const V = D.vocab;
  let i = 0, flipped = false;
  function draw() {
    const v = V[i];
    box.innerHTML = `<div class="panel">${withSide(`
      <div class="flash-area"><div class="flash ${flipped ? "flipped" : ""}" id="card">
        <div class="face front"><div class="em">${v[4]}</div>${esc(v[0])}<div class="small">${esc(v[1])}</div></div>
        <div class="face back"><div style="color:var(--th)">${esc(v[2])}</div><div style="font-size:.7em;margin-top:10px">${B(v[3])}</div></div>
      </div></div>
      <p class="dots">Tap the card to flip it · แตะบัตรเพื่อพลิก</p>
      <div class="btnrow"><button class="bigbtn" id="fs">🔊 Listen<span class="th">ฟังเสียง</span></button></div>
      ${navBtns(i, V.length, "fp", "fn")}`, sideList(`🃏 Cards<span class="th">บัตรคำ</span>`, V.map(x => esc(x[0])), i))}</div>`;
    on("card", () => { flipped = !flipped; document.getElementById("card").classList.toggle("flipped", flipped); });
    on("fs", () => say(v[0]));
    on("fp", () => move(-1)); on("fn", () => move(1));
    box.querySelectorAll(".sidelist button").forEach(b => b.onclick = () => { i = +b.dataset.j; flipped = false; draw(); });
  }
  function move(d) { const n = i + d; if (n < 0 || n >= V.length) return; i = n; flipped = false; draw(); }
  keyNav = move;
  draw();
}

function Match(box) {
  let timer = null;
  cleanup = () => clearInterval(timer);
  function start() {
    const pairs = shuffle(D.match).slice(0, 6);
    const tiles = shuffle(pairs.flatMap((p, k) => [{ k, s: p[0] }, { k, s: p[1] }]));
    let sel = null, left = pairs.length, t0 = Date.now(), pen = 0;
    box.innerHTML = `<div class="panel"><div class="timer" id="mt">0.0 s</div>
      <p class="dots">Tap two cards that go together. · แตะบัตร 2 ใบที่เข้าคู่กัน</p>
      <div class="match-grid">${tiles.map((t, i) => `<button class="tile" data-i="${i}">${B(t.s)}</button>`).join("")}</div></div>`;
    const mt = document.getElementById("mt");
    timer = setInterval(() => { mt.textContent = (((Date.now() - t0) / 1000) + pen).toFixed(1) + " s"; }, 100);
    box.querySelectorAll(".tile").forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (sel === null) { sel = i; b.classList.add("sel"); return; }
      if (sel === i) { b.classList.remove("sel"); sel = null; return; }
      const a = box.querySelector(`.tile[data-i="${sel}"]`);
      if (tiles[sel].k === tiles[i].k) {
        a.classList.add("gone"); b.classList.add("gone"); left--;
        if (!left) { clearInterval(timer); const t = (((Date.now() - t0) / 1000) + pen).toFixed(1); box.innerHTML = `<div class="panel"><div class="bigscore">⏱️ ${t} s</div><p class="feedback good">🎉 Well done!<span class="th">เก่งมาก</span></p><div class="btnrow"><button class="bigbtn green" id="ma">Play again<span class="th">เล่นอีกครั้ง</span></button></div></div>`; on("ma", start); }
      } else { pen++; a.classList.add("bad"); b.classList.add("bad"); setTimeout(() => { a.classList.remove("bad", "sel"); b.classList.remove("bad"); }, 400); }
      a.classList.remove("sel"); sel = null;
    });
  }
  box.innerHTML = `<div class="panel"><p style="text-align:center;font-weight:800">Match each pair as fast as you can!<span class="th">จับคู่ให้เร็วที่สุด</span></p><div class="btnrow"><button class="bigbtn green" id="ms">Start ▶<span class="th">เริ่ม</span></button></div></div>`;
  on("ms", start);
}

function Quiz(box) {
  const LIMIT = 20, SH = ["▲", "◆", "●", "■"];
  let timer = null, qs, i, right;
  cleanup = () => clearInterval(timer);
  function start() { qs = shuffle(D.quiz).slice(0, 10).map(q => ({ ...q, opts: shuffle(q.options.map((o, k) => ({ o, ok: k === 0 }))) })); i = 0; right = 0; ask(); }
  function ask() {
    const q = qs[i], t0 = Date.now();
    let done = false;
    box.innerHTML = `<div class="panel"><div class="quiz-top"><span>${i + 1} / ${qs.length}</span><span id="qt">${LIMIT}</span></div>
      <div class="timebar"><div id="tb" style="width:100%"></div></div>
      <div class="quiz-q">${B(q.q)}${q.fig ? Art.fig(q.fig) : ""}</div>
      <div class="opts">${q.opts.map((o, k) => `<button class="opt c${k}" data-k="${k}"><span class="let">${SH[k]}</span><span>${B(o.o)}</span></button>`).join("")}</div><div id="fb"></div></div>`;
    timer = setInterval(() => {
      const el = (Date.now() - t0) / 1000;
      document.getElementById("tb").style.width = Math.max(0, 100 - el / LIMIT * 100) + "%";
      document.getElementById("qt").textContent = Math.max(0, Math.ceil(LIMIT - el));
      if (el >= LIMIT && !done) answer(-1);
    }, 100);
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => { if (!done) answer(+b.dataset.k); });
    function answer(k) {
      done = true; clearInterval(timer);
      const ok = k >= 0 && q.opts[k].ok;
      if (ok) right++;
      box.querySelectorAll(".opt").forEach((b, j) => { b.classList.add(q.opts[j].ok ? "right" : "dim"); b.disabled = true; });
      document.getElementById("fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}">${ok ? "✅ Correct!<span class=\"th\">ถูกต้อง</span>" : k < 0 ? "⏰ Time's up!<span class=\"th\">หมดเวลา</span>" : "❌ Not quite.<span class=\"th\">ยังไม่ถูก</span>"}</div>
        <div class="btnrow"><button class="bigbtn" id="qn">${i < qs.length - 1 ? `Next ➡<span class="th">ถัดไป</span>` : `Score 🏁<span class="th">ดูคะแนน</span>`}</button></div>`;
      on("qn", () => { i++; i < qs.length ? ask() : end(); });
    }
  }
  function end() { box.innerHTML = `<div class="panel"><div class="bigscore">${right} / ${qs.length}</div><p class="feedback good">🎉 Great work, class!<span class="th">ทั้งห้องเก่งมาก</span></p><div class="btnrow"><button class="bigbtn green" id="qa">Play again<span class="th">เล่นอีกครั้ง</span></button></div></div>`; on("qa", start); }
  box.innerHTML = `<div class="panel"><p style="text-align:center;font-weight:800">10 questions · 20 seconds each. The whole class answers together!<span class="th">10 ข้อ ข้อละ 20 วินาที ตอบพร้อมกันทั้งห้อง</span></p><div class="btnrow"><button class="bigbtn green" id="qs">Start ▶<span class="th">เริ่ม</span></button></div></div>`;
  on("qs", start);
}

function Battle(box) {
  const NAMES = [["Red Team", "ทีมแดง"], ["Blue Team", "ทีมน้ำเงิน"], ["Yellow Team", "ทีมเหลือง"], ["Green Team", "ทีมเขียว"]];
  const pool = D.quiz.map(q => ({ q: q.q, a: q.options[0], fig: q.fig }));
  let n = 2, scores, qs, i, shown;
  function setup() {
    box.innerHTML = `<div class="panel" style="text-align:center"><p style="font-weight:800">Teams answer. Click the team that got it right.<span class="th">แต่ละทีมตอบ ครูคลิกทีมที่ตอบถูก</span></p>
      <p><b>How many teams?</b><span class="th">กี่ทีม</span></p>
      <div class="btnrow">${[2, 3, 4].map(k => `<button class="chip ${k === n ? "on" : ""}" data-n="${k}">${k}</button>`).join("")}</div>
      <div class="btnrow"><button class="bigbtn green" id="bs">Start ▶<span class="th">เริ่ม</span></button></div></div>`;
    box.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { n = +b.dataset.n; setup(); });
    on("bs", () => { scores = new Array(n).fill(0); qs = shuffle(pool).slice(0, 10); i = 0; shown = false; draw(); });
  }
  const board = click => `<div class="scoreboard">${scores.map((s, k) => `<div class="team t${k}">${B(NAMES[k])}<div class="pts">${s}</div>${click ? `<button data-k="${k}">✅ Got it!</button>` : ""}</div>`).join("")}</div>`;
  function draw() {
    const q = qs[i];
    box.innerHTML = `<div class="panel"><div class="quiz-top"><span>🏆 ${i + 1} / ${qs.length}</span></div>
      <div class="quiz-q">${B(q.q)}${q.fig ? Art.fig(q.fig) : ""}</div>
      ${shown ? `<div class="answer-box" style="text-align:center">✅ ${B(q.a)}</div>` : ""}
      ${board(shown)}
      <div class="btnrow">${shown ? `<button class="bigbtn grey" id="bn">Nobody ➡<span class="th">ไม่มีทีมไหนถูก</span></button>` : `<button class="bigbtn orange" id="br">👀 Show answer<span class="th">ดูคำตอบ</span></button>`}
      <button class="bigbtn dark" id="be">End 🏁<span class="th">จบเกม</span></button></div></div>`;
    const next = () => { i++; shown = false; i < qs.length ? draw() : end(); };
    on("br", () => { shown = true; draw(); }); on("bn", next); on("be", end);
    box.querySelectorAll(".team button").forEach(b => b.onclick = () => { scores[+b.dataset.k]++; next(); });
  }
  function end() {
    const top = Math.max(...scores), w = NAMES.slice(0, n).filter((_, k) => scores[k] === top);
    box.innerHTML = `<div class="panel"><div class="winner">🎉🏆🎉<br>${w.length > 1 ? "It's a tie!<br>" + w.map(x => x[0]).join(" & ") : w[0][0] + " wins!"}</div>${board(false)}<div class="btnrow"><button class="bigbtn green" id="ba">New game<span class="th">เกมใหม่</span></button></div></div>`;
    on("ba", setup);
  }
  setup();
}
