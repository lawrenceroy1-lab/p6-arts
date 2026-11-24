"""Builds content/unit04.json for Unit 4: Sculpting, Decorating, Adding, and Reducing.

Book: Think Big Visual Arts Grade 6 (IAD), printed pages 63 to 81.
Every text is a pair: ["English", "Thai"]. English is very short and simple.
Step pictures are drawn in js/clay.js. Finished models are Canva pictures in img/unit4/ (used when the file exists).
Run:  python3 tools/build_unit04.py      (then python3 tools/check_unit.py 04)
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from sitecfg import SITE_BUILD  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..")
IMG = os.path.join(ROOT, "img", "unit4")


def P(en, th):
    return [en, th]


def pic(fig=None, img=None, cap=None):
    d = {}
    if fig:
        d["fig"] = fig
    if img and os.path.exists(os.path.join(IMG, img)):
        d["img"] = "img/unit4/" + img
    if cap:
        d["cap"] = cap
    return d


ROUTINES = {
    "start": P("UNIT 4", "หน่วยที่ 4"),
    "look": P("LOOK AND LEARN", "ดูและเรียนรู้"),
    "point": P("POINT AND NAME", "ชี้และบอกชื่อ"),
    "vote": P("FINGER VOTE", "ชูนิ้วเลือกคำตอบ"),
    "think": P("THINK", "คิด"),
    "book": P("BOOK PICTURE", "ภาพในหนังสือ"),
    "review": P("UNIT REVIEW", "ทบทวนบทเรียน"),
    "draw": P("SCULPT ALONG", "ปั้นตาม"),
}

# ---------------------------------------------------------------- WHAT YOU NEED
MATERIALS = {
    "intro": P("Get these things ready before the lesson.", "เตรียมของเหล่านี้ก่อนเริ่มเรียน"),
    "must": [
        {"fig": "matPencil", "name": P("Pencil", "ดินสอ"), "note": P("To make eyes and draw lines.", "ใช้ทำตาและขีดเส้น")},
        {"fig": "matToothpicks", "name": P("Toothpicks", "ไม้จิ้มฟัน"), "note": P("To join a head to a body.", "ใช้ยึดหัวกับลำตัว")},
        {"fig": "matBoard", "name": P("Old plastic folder or book cover", "แฟ้มพลาสติกเก่า หรือปกหนังสือ"), "note": P("Work on it. The desk stays clean.", "ปั้นบนนี้ โต๊ะจะได้สะอาด")},
        {"fig": "matTissue", "name": P("Tissue or old cloth", "ทิชชู่ หรือผ้าเก่า"), "note": P("Clean your hands.", "เช็ดมือให้สะอาด")},
    ],
    "recTitle": P("🎨 Clay: we use", "ดินที่เราใช้"),
    "recommend": {"fig": "matClay", "name": P("Modelling clay (ดินน้ำมัน)", "ดินน้ำมัน"),
                  "why": [P("It stays soft. It never dries out.", "นิ่มตลอด ไม่แห้ง"),
                          P("Easy to roll, squeeze and stick together.", "ปั้น บีบ และติดกันได้ง่าย"),
                          P("You can use it again and again.", "ใช้ซ้ำได้หลายครั้ง")],
                  "example": pic("clayFinal:elephant", "elephant.jpg", P("Made with modelling clay", "ปั้นด้วยดินน้ำมัน"))},
    "extra": P("For the vase project only: one empty small bottle (like a yoghurt drink bottle).", "เฉพาะงานแจกัน: ขวดเล็กเปล่า 1 ใบ (เช่น ขวดนมเปรี้ยว)"),
}

# ---------------------------------------------------------------- WORDS (book p.63, the most important ones)
VOCAB = [
    ["Sculpture", "(n.)", "ประติมากรรม รูปสลัก รูปปั้น รูปหล่อ", P("We make a clay sculpture.", "เราปั้นรูปปั้นจากดิน"), "🗿"],
    ["Addition", "(n.)", "การเพิ่มเติม การต่อเติม สิ่งที่เพิ่ม", P("Addition: stick more clay on.", "การเพิ่ม: ติดดินเพิ่ม"), "➕"],
    ["Reduction", "(n.)", "การลดลง", P("Reduction: take clay away.", "การลด: เอาดินออก"), "➖"],
    ["Attach", "(v.)", "ทำให้ติดกัน ติด แนบ", P("Attach the ears to the head.", "ติดหูกับหัว"), "🧲"],
    ["Squeeze", "(n.), (v.)", "การบีบ รีด", P("Squeeze the ball into an oval.", "บีบลูกกลมให้เป็นวงรี"), "✊"],
    ["Scrape", "(n.), (v.)", "การขูด ขูด เช็ด ถู เบียด", P("Scrape the clay with a knife.", "ขูดดินด้วยมีด"), "🔪"],
    ["Pierce", "(v.)", "ปัก เสียบ เจาะ", P("Pierce the eyes with a pencil.", "เจาะตาด้วยดินสอ"), "✏️"],
    ["Flatten", "(v.)", "ทำให้แบน ทำให้เรียบ", P("Flatten a ball to make an ear.", "กดลูกกลมให้แบนเป็นหู"), "🫓"],
    ["Trim", "(n.), (v.), (adj.)", "การตัด ตัดแต่ง เล็ม พอเหมาะ", P("Trim the edges.", "ตัดแต่งขอบ"), "✂️"],
    ["Pose", "(n.), (v.)", "การวางท่าทาง วางท่า กำหนด", P("Turn the head to make a pose.", "หมุนหัวเพื่อจัดท่าทาง"), "🕺"],
]

# ---------------------------------------------------------------- LESSON SLIDES (book p.64 to 73)
SLIDES = []


def slide(page, routine, title, lines, pics=(), vote=None, tip=None):
    s = {"page": page, "routine": ROUTINES[routine], "title": title, "lines": list(lines), "pics": list(pics)}
    if vote:
        s["vote"] = vote
    if tip:
        s["tip"] = tip
    SLIDES.append(s)


slide(64, "start", P("Sculpting with clay", "การปั้นด้วยดิน"),
      [P("Today we make clay animals and more!", "วันนี้เราจะปั้นสัตว์และอื่น ๆ จากดิน")],
      [pic("clayFinal:elephant", "elephant.jpg")])
slide(65, "look", P("What is a sculpture?", "ประติมากรรมคืออะไร"),
      [P("A sculpture is 3D art. You can see it from all sides.", "ประติมากรรมคืองานศิลปะ 3 มิติ มองได้รอบด้าน")],
      [pic("clayFinal:hippo", "hippo.jpg"), pic("clayFinal:doll", "doll.jpg")])
slide(65, "look", P("Adding = stick clay ON", "การเพิ่ม = ติดดินเพิ่ม"),
      [P("Stick or attach more clay.", "ติดหรือแปะดินเพิ่ม")],
      [pic("clayAdd")])
slide(65, "look", P("Reducing = take clay OFF", "การลด = เอาดินออก"),
      [P("Scrape, cut, squeeze or pull clay away.", "ขูด ตัด บีบ หรือดึงดินออก")],
      [pic("clayReduce")])
slide(65, "vote", P("Stick an ear on a head. Adding or reducing?", "ติดหูบนหัว เป็นการเพิ่มหรือการลด"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("clayFinal:bun", "bun.jpg")],
      vote={"options": [P("A. Adding", "A. การเพิ่ม"), P("B. Reducing", "B. การลด")], "answer": 0,
            "why": P("We stick clay ON. That is adding.", "เราติดดินเพิ่ม นั่นคือการเพิ่ม")})
slide(66, "point", P("Six shapes we roll", "รูปทรง 6 แบบที่เราปั้น"),
      [P("Ball · Sausage · Pancake · Cone · Oval · Block", "ลูกกลม · ไส้กรอก · แผ่นแบน · กรวย · วงรี · ก้อนเหลี่ยม")],
      [pic("clayShapes")])
slide(66, "look", P("Our tools", "เครื่องมือของเรา"),
      [P("Hands first! Then a pencil, a toothpick and a plastic knife.", "ใช้มือก่อน แล้วใช้ดินสอ ไม้จิ้มฟัน และมีดพลาสติก")],
      [pic("clayTools")])
slide(64, "think", P("Think first!", "คิดก่อนปั้น"),
      [P("Picture it in your mind.", "นึกภาพในใจ"), P("Which shapes do you need?", "ต้องใช้รูปทรงอะไรบ้าง")],
      [pic("clayParts:elephant")])
slide(67, "vote", P("Which tool joins the head to the body?", "เครื่องมือใดใช้ยึดหัวกับลำตัว"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("clayHeadBody")],
      vote={"options": [P("A. Pencil", "A. ดินสอ"), P("B. Toothpick", "B. ไม้จิ้มฟัน")], "answer": 1,
            "why": P("A toothpick holds the heavy head.", "ไม้จิ้มฟันช่วยยึดหัวที่หนัก")})
slide(73, "book", P("Seven things we can make", "งานปั้น 7 อย่างที่เราทำได้"),
      [P("Look in your book on p.66 to 73.", "ดูในหนังสือหน้า 66 ถึง 73")],
      [pic("clayFinal:doll", "doll.jpg", P("Princess doll", "ตุ๊กตาเจ้าหญิง")), pic("clayFinal:bun", "bun.jpg", P("Cutie Bun", "หนูจุก")),
       pic("clayFinal:tank", "tank.jpg", P("Tank", "รถถัง")), pic("clayFinal:hippo", "hippo.jpg", P("Hippo", "ฮิปโป")),
       pic("clayFinal:elephant", "elephant.jpg", P("Elephant", "ช้าง")), pic("clayFinal:vase", "vase.jpg", P("Vase", "แจกัน")),
       pic("clayFinal:relief", "relief.jpg", P("Clay flowers", "ดอกไม้นูนสูง"))])
slide(79, "review", P("Make a horse's body bigger. Which way?", "ทำให้ลำตัวม้าใหญ่ขึ้น ทำอย่างไร"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("clayAdd")],
      vote={"options": [P("A. Cover it with more clay", "A. แปะดินเพิ่ม"), P("B. Scrape clay away", "B. ขูดดินออก")], "answer": 0,
            "why": P("Bigger = add more clay (covering).", "ใหญ่ขึ้น = เพิ่มดิน (การแปะ)")})
slide(66, "draw", P("Sculpting time!", "ถึงเวลาปั้นแล้ว"),
      [P("Choose a project. Follow the steps.", "เลือกงานปั้น แล้วทำตามทีละขั้น")],
      [pic("clayFinal:elephant", "elephant.jpg")])

# ---------------------------------------------------------------- SCULPT ALONG: all 7 book projects (pictures in js/clay.js)
CHECK = [P("Strong: it does not fall apart", "แข็งแรง: ไม่หลุดออกจากกัน"), P("Adding: parts are stuck on well", "การเพิ่ม: ติดชิ้นส่วนแน่น"), P("Neat: smooth and clean", "เรียบร้อย: เรียบและสะอาด")]
GUIDES = [
    {"id": "doll", "page": 66, "title": P("Princess doll", "ตุ๊กตาเจ้าหญิง"), "goal": pic("clayFinal:doll", "doll.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Make a cone. Spread the bottom out: the skirt.", "ปั้นเป็นกรวย กดขอบล่างให้บาน: กระโปรง"),
        P("Roll a ball: the head. Add a tiny nose. Pencil: eyes and mouth. Roll 2 thin sausages: arms.", "ปั้นลูกกลม: หัว ติดจมูกเล็ก ดินสอ: ตาและปาก ปั้นไส้กรอกเล็ก 2 เส้น: แขน"),
        P("Put the head on top of the cone.", "วางหัวบนยอดกรวย"),
        P("Stick the arms on the sides. Make a nice pose.", "ติดแขนที่ด้านข้าง จัดท่าให้สวย")]},
    {"id": "bun", "page": 67, "title": P("Cutie Bun", "หนูจุก"), "goal": pic("clayFinal:bun", "bun.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Roll a ball: the head. Add a nose and 2 ears. Other colour: a bun on top. Pencil: eyes and mouth.", "ปั้นลูกกลม: หัว ติดจมูกและหู 2 ข้าง ใช้ดินอีกสี: จุกบนหัว ดินสอ: ตาและปาก"),
        P("Make the body: an oval, 2 arms and 2 fat legs (Thai pants).", "ปั้นลำตัว: วงรี แขน 2 ข้าง ขาอ้วน 2 ข้าง (กางเกงไทย)"),
        P("Push a toothpick in. Put the head on the body.", "เสียบไม้จิ้มฟัน แล้ววางหัวบนลำตัว"),
        P("Turn the head. Choose a pose you like.", "หมุนหัว เลือกท่าที่ชอบ")]},
    {"id": "tank", "page": 68, "title": P("Tank", "รถถัง"), "goal": pic("clayFinal:tank", "tank.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Make a block (a box shape).", "ปั้นเป็นก้อนสี่เหลี่ยม"),
        P("Add a small block on top. Flatten 4 balls: wheels.", "ติดก้อนเล็กด้านบน กดลูกกลม 4 ลูกให้แบน: ล้อ"),
        P("Pencil: pierce windows. Etch lines on the body.", "ดินสอ: เจาะหน้าต่าง ขีดลายบนตัวรถ"),
        P("Add a sausage gun and small ball lights.", "ติดปืนรูปไส้กรอกและไฟลูกกลมเล็ก")]},
    {"id": "hippo", "page": 69, "title": P("Hippopotamus", "ฮิปโปโปเตมัส"), "goal": pic("clayFinal:hippo", "hippo.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Make 2 ovals: a big one (body) and a small one (head).", "ปั้นวงรี 2 ก้อน: ก้อนใหญ่ (ลำตัว) ก้อนเล็ก (หัว)"),
        P("Make small parts: 2 ears, 2 eyes, 2 white teeth.", "ปั้นชิ้นเล็ก: หู 2 ข้าง ตา 2 ข้าง ฟันขาว 2 ซี่"),
        P("Stick the parts on the head. Pencil: nose and mouth.", "ติดชิ้นส่วนบนหัว ดินสอ: จมูกและปาก"),
        P("Use a toothpick to join the head to the body.", "ใช้ไม้จิ้มฟันยึดหัวกับลำตัว")]},
    {"id": "elephant", "page": 70, "title": P("Elephant", "ช้าง"), "goal": pic("clayFinal:elephant", "elephant.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Roll a big ball. Squeeze it into an oval: the body.", "ปั้นลูกกลมใหญ่ บีบให้เป็นวงรี: ลำตัว"),
        P("Roll 4 thick sausages: the legs. Stick them under the body.", "ปั้นไส้กรอกอ้วน 4 ชิ้น: ขา ติดใต้ลำตัว"),
        P("Roll a ball: the head. Join it with a toothpick.", "ปั้นลูกกลม: หัว ยึดด้วยไม้จิ้มฟัน"),
        P("Roll a long sausage (trunk) and a thin one (tail).", "ปั้นไส้กรอกยาว (งวง) และเส้นเล็ก (หาง)"),
        P("Flatten 2 balls: the big ears.", "กดลูกกลม 2 ลูกให้แบน: หูใหญ่"),
        P("Add 2 white tusks. Pencil: eyes and lines on the trunk.", "ติดงาสีขาว 2 ข้าง ดินสอ: ตาและเส้นที่งวง")]},
    {"id": "vase", "page": 71, "title": P("Vase", "แจกัน"), "goal": pic("clayFinal:vase", "vase.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Cover an empty small bottle with flat clay.", "หุ้มขวดเล็กเปล่าด้วยดินแผ่นแบน"),
        P("Add clay and scrape clay to make a nice shape.", "เพิ่มดินและขูดดินให้เป็นรูปทรงสวย"),
        P("Decorate: stick on small flat shapes.", "ตกแต่ง: ติดชิ้นแบนเล็ก ๆ"),
        P("Add water and flowers.", "ใส่น้ำและดอกไม้")]},
    {"id": "relief", "page": 72, "title": P("Clay flowers (high relief)", "ดอกไม้นูนสูง"), "goal": pic("clayFinal:relief", "relief.jpg", P("We make this!", "เราจะปั้นแบบนี้")), "check": CHECK, "steps": [
        P("Flatten clay into a thin sheet. Trim it into a rectangle.", "กดดินเป็นแผ่นบาง ตัดเป็นสี่เหลี่ยม"),
        P("Make the parts: petals, centres, stems and leaves.", "ปั้นชิ้นส่วน: กลีบ เกสร ก้าน และใบ"),
        P("Arrange the flowers. Pencil: blend the joins and draw the background.", "จัดวางดอกไม้ ดินสอ: เกลี่ยรอยต่อและวาดลายพื้นหลัง")]},
]

# ---------------------------------------------------------------- BOOK ACTIVITIES (book p.74 to 77)
RUBRIC = {
    "title": P("Artwork Evaluation Form", "แบบประเมินผลงานศิลปะ"),
    "cols": [P("Very good (8 marks)", "ดีมาก (8 คะแนน)"), P("Good (6-7 marks)", "ดี (6-7 คะแนน)"), P("Fair (3-5 marks)", "พอใช้ (3-5 คะแนน)"), P("Need to be improved (2 marks)", "ควรปรับปรุง (2 คะแนน)")],
    "rows": [P("Creativity", "ความคิดสร้างสรรค์"), P("Willingness to work", "ความตั้งใจในการทำงาน"), P("Beauty of artwork", "ความสวยงามของผลงาน"),
             P("Using correct materials and equipment", "การใช้วัสดุอุปกรณ์ถูกต้อง"), P("Neatness of the work", "ความเรียบร้อยของผลงาน")],
    "levels": [["36 - 40", P("Very good", "ดีมาก"), "4"], ["25 - 35", P("Good", "ดี"), "3"], ["12 - 24", P("Fair", "พอใช้"), "2"], ["1 - 11", P("Need to be improved", "ควรปรับปรุง"), "1"]],
}
ACTIVITIES = [
    {"num": 1, "page": 74, "marks": 20, "kind": "match",
     "title": P("Match the sculptures with their parts", "จับคู่งานปั้นกับชิ้นส่วน"),
     "task": P("Look at each sculpture. Which parts made it? Draw a line in your book.", "ดูงานปั้นแต่ละชิ้น ทำจากชิ้นส่วนใด ลากเส้นในหนังสือ"),
     "steps": [P("Look at the shapes in each sculpture.", "ดูรูปทรงในงานปั้นแต่ละชิ้น"), P("Find the same shapes on the right.", "หารูปทรงเดียวกันทางขวา")],
     "pairs": [["clayFinal:tank", "clayParts:tank"], ["clayFinal:doll", "clayParts:doll"], ["clayFinal:hippo", "clayParts:hippo"], ["clayFinal:bun", "clayParts:bun"]],
     "order": [2, 3, 0, 1],
     "answer": P("Tank → blocks and wheels · Doll → cone, head, arms · Hippo → ovals and small parts · Cutie Bun → head, nose, ears and bun",
                 "รถถัง → ก้อนเหลี่ยมและล้อ · ตุ๊กตา → กรวย หัว แขน · ฮิปโป → วงรีและชิ้นเล็ก · หนูจุก → หัว จมูก หู และจุก"),
     "scoring": P("20 marks: 5 marks for each pair.", "20 คะแนน: คู่ละ 5 คะแนน")},
    {"num": 2, "page": 75, "marks": 10, "kind": "text",
     "title": P("I missed the boat", "ฉันตกเรือ"),
     "task": P("You are on an island. The boat comes back in 7 days. A shed has many things. Write 10 useful things.", "เราอยู่บนเกาะ เรือจะกลับมาอีก 7 วัน ในโรงเก็บของมีของหลายอย่าง เขียนของที่มีประโยชน์ 10 อย่าง"),
     "steps": [P("Read the story in your book (p.75).", "อ่านเรื่องในหนังสือ (หน้า 75)"), P("Think: what do you need to eat, sleep and stay safe?", "คิด: ต้องใช้อะไรเพื่อกิน นอน และปลอดภัย"), P("Write 10 things.", "เขียน 10 อย่าง")],
     "answer": P("Book example: pot, pan, bucket, plate, knife, lighter, mattress, mosquito repellent, sunscreen lotion, clothes.",
                 "ตัวอย่างในหนังสือ: หม้อ กระทะ ถัง จาน มีด ไฟแช็ก ที่นอน ยากันยุง ครีมกันแดด เสื้อผ้า"),
     "scoring": P("10 marks: 1 mark for each thing.", "10 คะแนน: อย่างละ 1 คะแนน")},
    {"num": 3, "page": 75, "marks": 20, "kind": "draw",
     "title": P("Plan your sculpture", "วางแผนงานปั้น"),
     "task": P("Choose one thing you want to sculpt. Draw and paint it. Then draw the parts you need.", "เลือกสิ่งที่อยากปั้น 1 อย่าง วาดและระบายสี แล้ววาดชิ้นส่วนที่ต้องใช้"),
     "steps": [P("What do you want to sculpt?", "อยากปั้นอะไร"), P("Draw it and colour it.", "วาดและระบายสี"), P("Which shapes and parts do you need?", "ต้องใช้รูปทรงและชิ้นส่วนอะไรบ้าง")],
     "example": [pic("clayParts:elephant", cap=P("Parts for an elephant", "ชิ้นส่วนของช้าง"))],
     "answer": P("Book example: a pot. Parts: a pot and a pot handle.", "ตัวอย่างในหนังสือ: หม้อ ชิ้นส่วน: ตัวหม้อและหูหม้อ"),
     "scoring": P("20 marks.", "20 คะแนน")},
    {"num": 4, "page": 76, "marks": 40, "kind": "draw", "guide": "elephant", "rubric": True,
     "title": P("Evaluation activity: sculpt your plan", "กิจกรรมประเมินผล: ปั้นตามแผน"),
     "task": P("Sculpt what you planned. Then answer the 4 questions in your book.", "ปั้นตามที่วางแผนไว้ แล้วตอบคำถาม 4 ข้อในหนังสือ"),
     "steps": [P("What tools did you use?", "ใช้เครื่องมืออะไรบ้าง"), P("Did you use adding or reducing?", "ใช้การเพิ่มหรือการลด"),
               P("What do you like best about your sculpture?", "ชอบอะไรในงานปั้นของเรามากที่สุด"), P("How can you make it better?", "จะทำให้ดีขึ้นได้อย่างไร")],
     "answer": P("Book example: 1. Play dough, toothpicks. 2. Adding technique. 3. It is strong. 4. Use nicer colours and decorate the pot.",
                 "ตัวอย่างในหนังสือ: 1. ดินน้ำมัน ไม้จิ้มฟัน 2. การเพิ่ม 3. แข็งแรง 4. ใช้สีสวยขึ้นและตกแต่งหม้อ"),
     "scoring": P("40 marks. The teacher uses the Artwork Evaluation Form (p.77).", "40 คะแนน ครูใช้แบบประเมินผลงานศิลปะ (หน้า 77)")},
]

# ---------------------------------------------------------------- UNIT TEST (book p.78 to 79), for class review
TEST = [
    {"page": 78, "q": P("What does \"sculpting by addition\" mean?", "\"การปั้นแบบเพิ่ม\" หมายถึงอะไร"),
     "options": [P("Making a sculpture beautiful", "ทำให้งานปั้นสวย"), P("Adding clay to make more details", "เพิ่มดินเพื่อทำรายละเอียดเพิ่ม"), P("Changing the form", "เปลี่ยนรูปทรง"), P("Taking clay away", "เอาดินออก")], "answer": 1,
     "why": P("Addition = add more clay.", "การเพิ่ม = เพิ่มดิน")},
    {"page": 78, "q": P("Which one is the reducing technique?", "ข้อใดเป็นเทคนิคการลด"),
     "options": [P("Scraping the body of the tiger", "ขูดลำตัวเสือ"), P("Attaching the eyes to a cat", "ติดตาให้แมว"), P("Attaching the head to a lion", "ติดหัวให้สิงโต"), P("Covering the body of the sea lion", "แปะดินบนลำตัวสิงโตทะเล")], "answer": 0,
     "why": P("Scraping takes clay away.", "การขูดคือการเอาดินออก")},
    {"page": 78, "q": P("Which one makes 3D art?", "ข้อใดใช้สร้างงานศิลปะ 3 มิติ"),
     "options": [P("Drawing", "การวาด"), P("Printing", "การพิมพ์ภาพ"), P("Painting", "การระบายสี"), P("Sculpting", "การปั้น")], "answer": 3,
     "why": P("A sculpture is 3D.", "งานปั้นเป็น 3 มิติ")},
    {"page": 78, "q": P("Which technique is in this picture?", "ภาพนี้ใช้เทคนิคใด"), "fig": "clayBottle",
     "options": [P("Adding technique", "เทคนิคการเพิ่ม"), P("Reducing technique", "เทคนิคการลด"), P("Symmetry", "ความสมมาตร"), P("Balancing", "ความสมดุล")], "answer": 0,
     "why": P("Clay is added to cover the bottle.", "เพิ่มดินหุ้มขวด")},
    {"page": 79, "q": P("Which technique does the picture show?", "ภาพแสดงเทคนิคใด"), "fig": "clayReduce",
     "options": [P("Attaching", "การติด"), P("Covering", "การแปะ"), P("Scraping", "การขูด"), P("Squeezing", "การบีบ")], "answer": 2,
     "why": P("The knife scrapes clay away.", "มีดขูดดินออก")},
    {"page": 79, "q": P("Which tool joins the head and the body?", "ใช้อะไรยึดหัวกับลำตัว"), "fig": "clayHeadBody",
     "options": [P("Knife", "มีด"), P("Fork", "ส้อม"), P("Toothpick", "ไม้จิ้มฟัน"), P("Chopstick", "ตะเกียบ")], "answer": 2,
     "why": P("A toothpick holds the head on.", "ไม้จิ้มฟันยึดหัวไว้")},
    {"page": 79, "q": P("How do we make a horse's body larger?", "ทำให้ลำตัวม้าใหญ่ขึ้นด้วยเทคนิคใด"),
     "options": [P("Covering", "การแปะ"), P("Scraping", "การขูด"), P("Pressing", "การกด"), P("Squeezing", "การบีบ")], "answer": 0,
     "why": P("Covering adds more clay.", "การแปะคือการเพิ่มดิน")},
    {"page": 79, "q": P("What shape do we start with to sculpt a car?", "ปั้นรถยนต์ควรเริ่มจากรูปทรงใด"),
     "options": [P("Sphere", "ทรงกลม"), P("Oval form", "ทรงรี"), P("Cube", "ลูกบาศก์"), P("Prism", "ปริซึม")], "answer": 3,
     "why": P("A car is long like a box: a prism.", "รถยาวเหมือนกล่อง: ปริซึม")},
    {"page": 79, "q": P("Which part of the tank was NOT made by adding or reducing?", "ส่วนใดของรถถังไม่ได้ทำด้วยการเพิ่มหรือการลด"), "fig": "clayFinal:tank",
     "options": [P("The wheels", "ล้อ"), P("The windows", "หน้าต่าง"), P("The body of the tank", "ตัวรถถัง"), P("The gun", "ปืน")], "answer": 1,
     "why": P("The windows were pierced with a pencil.", "หน้าต่างเจาะด้วยดินสอ")},
    {"page": 79, "q": P("Which sculpture is NOT for decoration?", "งานปั้นใดไม่ได้ใช้เพื่อการตกแต่ง"),
     "options": [P("Fruit", "ผลไม้"), P("Animal", "สัตว์"), P("Doll", "ตุ๊กตา"), P("Pencil case", "กล่องดินสอ")], "answer": 3,
     "why": P("A pencil case is for use, not decoration.", "กล่องดินสอใช้งาน ไม่ใช่ของตกแต่ง")},
]

# ---------------------------------------------------------------- GAMES
QUIZ = [
    {"q": P("Stick clay ON is...", "ติดดินเพิ่มคือ..."), "options": [P("adding", "การเพิ่ม"), P("reducing", "การลด"), P("painting", "การระบายสี"), P("drawing", "การวาด")]},
    {"q": P("Take clay OFF is...", "เอาดินออกคือ..."), "options": [P("reducing", "การลด"), P("adding", "การเพิ่ม"), P("printing", "การพิมพ์"), P("posing", "การจัดท่า")]},
    {"q": P("Which tool joins a head to a body?", "อะไรใช้ยึดหัวกับลำตัว"), "fig": "clayHeadBody", "options": [P("Toothpick", "ไม้จิ้มฟัน"), P("Eraser", "ยางลบ"), P("Ruler", "ไม้บรรทัด"), P("Brush", "พู่กัน")]},
    {"q": P("Which tool makes the eyes?", "อะไรใช้ทำตา"), "options": [P("Pencil", "ดินสอ"), P("Spoon", "ช้อน"), P("Paper", "กระดาษ"), P("Water", "น้ำ")]},
    {"q": P("A flat round piece is a...", "ชิ้นกลมแบนเรียกว่า..."), "options": [P("pancake", "แผ่นแบน"), P("cone", "กรวย"), P("block", "ก้อนเหลี่ยม"), P("sausage", "ไส้กรอก")]},
    {"q": P("The elephant's legs are...", "ขาช้างเป็นรูป..."), "fig": "clayFinal:elephant", "options": [P("sausages", "ไส้กรอก"), P("pancakes", "แผ่นแบน"), P("cones", "กรวย"), P("blocks", "ก้อนเหลี่ยม")]},
    {"q": P("The doll's skirt is a...", "กระโปรงตุ๊กตาเป็นรูป..."), "fig": "clayFinal:doll", "options": [P("cone", "กรวย"), P("ball", "ลูกกลม"), P("block", "ก้อนเหลี่ยม"), P("sausage", "ไส้กรอก")]},
    {"q": P("The tank starts as a...", "รถถังเริ่มจาก..."), "fig": "clayFinal:tank", "options": [P("block", "ก้อนเหลี่ยม"), P("ball", "ลูกกลม"), P("cone", "กรวย"), P("pancake", "แผ่นแบน")]},
    {"q": P("A sculpture is...", "ประติมากรรมคือ..."), "options": [P("3D art", "ศิลปะ 3 มิติ"), P("a flat picture", "ภาพแบน"), P("a song", "เพลง"), P("a story", "นิทาน")]},
    {"q": P("Scraping is...", "การขูดคือ..."), "fig": "clayReduce", "options": [P("reducing", "การลด"), P("adding", "การเพิ่ม"), P("posing", "การจัดท่า"), P("covering", "การแปะ")]},
]
MATCH = [
    [P("Adding", "การเพิ่ม"), P("stick clay on", "ติดดินเพิ่ม")],
    [P("Reducing", "การลด"), P("take clay off", "เอาดินออก")],
    [P("Toothpick", "ไม้จิ้มฟัน"), P("joins parts", "ยึดชิ้นส่วน")],
    [P("Pencil", "ดินสอ"), P("eyes and lines", "ตาและเส้น")],
    [P("Flatten", "ทำให้แบน"), P("press it flat", "กดให้แบน")],
    [P("Squeeze", "บีบ"), P("press with fingers", "กดด้วยนิ้ว")],
    [P("Pose", "ท่าทาง"), P("the way it stands", "ท่าที่ยืน")],
    [P("Sculpture", "ประติมากรรม"), P("3D art", "ศิลปะ 3 มิติ")],
]

unit = {
    "unit": "04",
    "title": P("Sculpting, Decorating, Adding, and Reducing", "การปั้น การตกแต่ง การเพิ่มและการลด"),
    "pages": "p.63 to 81",
    "build": SITE_BUILD,
    "drawTab": {"e": "🗿", "en": "Sculpt: step by step", "th": "ปั้นทีละขั้น"},
    "materials": MATERIALS,
    "vocabPage": 63,
    "vocab": VOCAB,
    "slides": SLIDES,
    "guides": GUIDES,
    "activities": ACTIVITIES,
    "rubric": RUBRIC,
    "test": {"pages": "p.78 to 79", "questions": TEST},
    "quiz": QUIZ,
    "match": MATCH,
}

with open(os.path.join(ROOT, "content", "unit04.json"), "w", encoding="utf-8") as f:
    json.dump(unit, f, ensure_ascii=False, indent=1)
imgs = sum(1 for g in GUIDES if "img" in g["goal"])
print(f"Wrote content/unit04.json: {len(SLIDES)} slides, {len(GUIDES)} projects, {len(ACTIVITIES)} activities, {len(TEST)} test questions, {imgs} Canva pictures.")
