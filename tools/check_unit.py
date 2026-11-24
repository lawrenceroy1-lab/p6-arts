"""Checks a unit data file before publishing.
Run:  python3 tools/check_unit.py 03
Checks: every text has English AND Thai, no em/en dashes, pictures exist, Draw along step counts match,
answers are in range, book page order, and no real-person names in new examples.
"""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
uid = sys.argv[1] if len(sys.argv) > 1 else "03"
d = json.load(open(os.path.join(ROOT, "content", f"unit{uid}.json"), encoding="utf-8"))
art = open(os.path.join(ROOT, "js", "art.js"), encoding="utf-8").read()
steps = open(os.path.join(ROOT, "js", "steps.js"), encoding="utf-8").read()
errors = []
raw = json.dumps(d, ensure_ascii=False)

if "—" in raw or "–" in raw:
    errors.append("Found an em dash or en dash.")

THAI = re.compile(r"[฀-๿]")


def walk(x, path):
    """Every [English, Thai] pair must have both parts."""
    if isinstance(x, list) and len(x) == 2 and all(isinstance(v, str) for v in x) and THAI.search(x[1] or "x"):
        if not x[0].strip():
            errors.append(f"{path}: English missing")
        return
    if isinstance(x, list) and len(x) == 2 and all(isinstance(v, str) and re.fullmatch(r"\w+(:\w+)?", v) for v in x):
        return  # a pair of picture names
    if isinstance(x, list) and len(x) == 2 and all(isinstance(v, str) for v in x) and re.search(r"[A-Za-z]{3,}", x[0]) and not THAI.search(x[1]) and not x[1].startswith(("img/", "fig:")) and x[1] not in ("2D", "3D"):
        errors.append(f"{path}: Thai missing for '{x[0][:40]}'")
    if isinstance(x, dict):
        for k, v in x.items():
            walk(v, f"{path}.{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            walk(v, f"{path}[{i}]")


walk(d, "unit")

FIGS = set(re.findall(r"^\s{4}(\w+): (?:\(\)|\w+) =>", art, re.M))
clay = open(os.path.join(ROOT, "js", "clay.js"), encoding="utf-8").read()
CLAY = {m[0]: int(m[1]) for m in re.findall(r"(\w+): \[\w+, (\d+)\]", clay)}


def fig_ok(name, where):
    n = name.split(":")[0]
    if n not in FIGS:
        errors.append(f"{where}: picture '{n}' is not in js/art.js")


for i, s in enumerate(d["slides"]):
    for p in s["pics"]:
        if "fig" in p:
            fig_ok(p["fig"], f"slide {i + 1}")
        if "img" in p and not os.path.exists(os.path.join(ROOT, p["img"])):
            errors.append(f"slide {i + 1}: missing {p['img']}")
    if s.get("vote"):
        v = s["vote"]
        if not 0 <= v["answer"] < len(v["options"]):
            errors.append(f"slide {i + 1}: vote answer out of range")
        if v.get("fig"):
            fig_ok(v["fig"], f"slide {i + 1} vote")

for g in d["guides"]:
    m = re.search(rf"^\s{{4}}{g['id']}: {{ n: (\d+)", steps, re.M)
    if g["id"] in CLAY:
        if CLAY[g["id"]] != len(g["steps"]):
            errors.append(f"guide {g['id']}: {len(g['steps'])} texts but {CLAY[g['id']]} clay pictures")
    elif g.get("imgs"):
        if len(g["imgs"]) != len(g["steps"]):
            errors.append(f"guide {g['id']}: pictures and steps do not match")
    elif not m:
        errors.append(f"guide {g['id']} has no pictures in js/steps.js")
    elif int(m.group(1)) != len(g["steps"]):
        errors.append(f"guide {g['id']}: {len(g['steps'])} texts but {m.group(1)} pictures")

pages = [a["page"] for a in d["activities"]]
if pages != sorted(pages):
    errors.append(f"activities not in book order: {pages}")
for a in d["activities"]:
    for it in a.get("items", []):
        fig_ok(it[0], f"activity {a['num']}")
    for pr in a.get("pairs", []):
        fig_ok(pr[0], f"activity {a['num']}"); fig_ok(pr[1], f"activity {a['num']}")
    for p in a.get("example", []):
        fig_ok(p["fig"], f"activity {a['num']} example")

tp = [q["page"] for q in d["test"]["questions"]]
if tp != sorted(tp):
    errors.append(f"test not in book order: {tp}")
for k, q in enumerate(d["test"]["questions"]):
    if not 0 <= q["answer"] < len(q["options"]):
        errors.append(f"test Q{k + 1}: answer out of range")
    for o in q["options"]:
        if isinstance(o, str) and o.startswith("fig:"):
            fig_ok(o[4:], f"test Q{k + 1}")
    if q.get("fig"):
        fig_ok(q["fig"], f"test Q{k + 1}")

for q in d["quiz"]:
    if q.get("fig"):
        fig_ok(q["fig"], "quiz")

if re.search(r"\b(Somchai|Somsak|Nong|Ploy|Wei|Ming)\b", raw):
    errors.append("Use only English names (Lily, James, Emma, Tom, Sophie) in new examples.")

if errors:
    print("❌ Problems found:")
    for e in errors:
        print("  -", e)
    sys.exit(1)
print(f"✅ Unit {uid} is OK: {len(d['slides'])} slides, {len(d['guides'])} guides, {len(d['activities'])} activities, {len(d['test']['questions'])} test questions.")
