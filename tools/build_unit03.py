"""Builds content/unit03.json for Unit 3: Two Dimensions (2D) to Three Dimensions (3D).

Book: Think Big Visual Arts Grade 6 (IAD), printed pages 43 to 62.
Every text is a pair: ["English", "Thai"]. English is very short and simple (about Grade 3 level).
Pictures: "fig" = drawn in code (js/art.js), "img" = a Canva picture in img/unit3/ (used when the file exists).
Run:  python3 tools/build_unit03.py      (then python3 tools/check_unit.py 03)
"""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
IMG = os.path.join(ROOT, "img", "unit3")


def P(en, th):
    return [en, th]


def pic(fig=None, img=None, cap=None):
    d = {}
    if fig:
        d["fig"] = fig
    if img and os.path.exists(os.path.join(IMG, img)):
        d["img"] = "img/unit3/" + img
    if cap:
        d["cap"] = cap
    return d


ROUTINES = {
    "start": P("UNIT 3", "หน่วยที่ 3"),
    "look": P("LOOK AND COMPARE", "ดูและเปรียบเทียบ"),
    "point": P("POINT AND NAME", "ชี้และบอกชื่อ"),
    "book": P("BOOK PICTURE", "ภาพในหนังสือ"),
    "vote": P("FINGER VOTE", "ชูนิ้วเลือกคำตอบ"),
    "pencil": P("PENCIL PRACTICE", "ฝึกใช้ดินสอ"),
    "colour": P("COLOUR SHADING", "การลงสีแสงเงา"),
    "detective": P("PICTURE DETECTIVES", "นักสืบภาพ"),
    "extension": P("EXTENSION", "กิจกรรมเสริม"),
    "review": P("UNIT REVIEW", "ทบทวนบทเรียน"),
    "think": P("THINK", "คิด"),
}

# ---------------------------------------------------------------- WHAT YOU NEED
MATERIALS = {
    "intro": P("Get these things ready before the lesson.", "เตรียมของเหล่านี้ก่อนเริ่มเรียน"),
    "must": [
        {"fig": "matBook", "name": P("Arts book", "หนังสือศิลปะ"), "note": P("We draw in the book on p.55 to 58.", "เราจะวาดในหนังสือหน้า 55 ถึง 58")},
        {"fig": "matPencil", "name": P("Pencil (2B is best)", "ดินสอ (2B ดีที่สุด)"), "note": P("Soft pencil. Easy to make dark.", "ดินสอเนื้ออ่อน ทำให้เข้มได้ง่าย")},
        {"fig": "matEraser", "name": P("Eraser", "ยางลบ"), "note": P("Rub out lines you do not need.", "ลบเส้นที่ไม่ต้องการ")},
        {"fig": "matSharpener", "name": P("Sharpener", "กบเหลาดินสอ"), "note": P("A sharp pencil makes thin lines.", "ดินสอแหลมทำให้ได้เส้นบาง")},
    ],
    "recommend": {"fig": "matColourPencils", "name": P("Colour pencils", "สีไม้"),
                  "why": [P("In this unit we shade light, medium and dark, like the mango below.", "หน่วยนี้เราแรเงาอ่อน กลาง และเข้ม เหมือนมะม่วงในภาพ"),
                          P("Colour pencils make this easy: press softly for light, press harder for dark.", "สีไม้ทำได้ง่าย: กดเบาได้สีอ่อน กดแรงได้สีเข้ม"),
                          P("They work well on the paper in our book.", "ใช้กับกระดาษในหนังสือของเราได้ดี")],
                  "example": pic("paintStages", "mango-stages.jpg", P("Light, medium and dark with colour pencils", "อ่อน กลาง และเข้ม ด้วยสีไม้"))},
}

# ---------------------------------------------------------------- WORDS (book p.43)
# word, part of speech, Thai meaning from the book, short example sentence [en, th], emoji
VOCAB = [
    ["Convert", "(n.), (v.)", "ผู้ที่เปลี่ยนความเห็น ทำให้เปลี่ยนไปเป็น", P("Shading can convert a flat picture to 3D.", "การแรเงาเปลี่ยนภาพแบนให้เป็น 3 มิติได้"), "🔄"],
    ["Dimensional", "(adj.)", "เกี่ยวกับขนาดที่มี 3 มิติ (กว้าง สูง ลึก)", P("A box is three dimensional.", "กล่องเป็นสามมิติ"), "🧊"],
    ["Direction", "(n.)", "ทิศทาง แนวโน้ม", P("Look at the direction of the light.", "ดูทิศทางของแสง"), "🧭"],
    ["Extraordinary", "(adj.)", "พิเศษ ผิดธรรมดา", P("A purple sun is extraordinary.", "ดวงอาทิตย์สีม่วงแปลกไม่ธรรมดา"), "🌟"],
    ["Geography", "(n.)", "ภูมิศาสตร์", P("Thailand has rice fields and mountains.", "ประเทศไทยมีทุ่งนาและภูเขา"), "🗺️"],
    ["Harmonious", "(adj.)", "ซึ่งเข้ากันได้ ซึ่งกลมกลืนกัน", P("All shadows go one way. It looks harmonious.", "เงาทุกอันไปทางเดียว ภาพดูกลมกลืน"), "🎶"],
    ["Imagination", "(n.)", "จินตนาการ", P("Use your imagination!", "ใช้จินตนาการของเรา"), "💭"],
    ["Important", "(adj.)", "สำคัญ", P("Light is important.", "แสงสำคัญ"), "❗"],
    ["Innovation", "(n.)", "นวัตกรรม การสร้างสรรค์สิ่งใหม่ ๆ", P("A new idea is an innovation.", "ความคิดใหม่คือนวัตกรรม"), "💡"],
    ["Realistic", "(adj.)", "เกี่ยวกับความจริง ซึ่งปฏิบัติได้จริง ซึ่งสมเหตุสมผล", P("The apple looks realistic.", "แอปเปิลดูเหมือนจริง"), "🍎"],
    ["Reflect", "(v.)", "ส่องกลับ สะท้อนกลับ", P("A mirror reflects light.", "กระจกสะท้อนแสง"), "🪞"],
    ["Scenery", "(n.)", "ทิวทัศน์ ทัศนียภาพ", P("I draw the beach scenery.", "ฉันวาดทิวทัศน์ชายหาด"), "🏞️"],
    ["Shadow", "(n.), (v.)", "เงา ร่มเงา", P("The tree has a long shadow.", "ต้นไม้มีเงายาว"), "🌑"],
    ["Surface", "(n.), (v.)", "พื้นผิว ผิวภายนอก ปรากฏบนพื้นผิว เปิดเผย", P("The ball has a smooth surface.", "ลูกบอลมีพื้นผิวเรียบ"), "🟫"],
    ["Surreal", "(adj.)", "เหมือนฝัน เกี่ยวกับการนึกฝัน เหนือความจริง", P("A flying fish house is surreal.", "บ้านปลาที่บินได้เป็นภาพเหนือจริง"), "🌀"],
]

# ---------------------------------------------------------------- LESSON SLIDES (book p.44 to 54)
SLIDES = []


def slide(page, routine, title, lines, pics=(), vote=None, tip=None, layout=None):
    s = {"page": page, "routine": ROUTINES[routine], "title": title, "lines": list(lines), "pics": [p for p in pics]}
    if vote:
        s["vote"] = vote
    if tip:
        s["tip"] = tip
    if layout:
        s["layout"] = layout
    SLIDES.append(s)


slide(44, "start", P("From 2D to 3D", "จาก 2 มิติ สู่ 3 มิติ"),
      [P("Light and shadow", "แสงและเงา"), P("We learn to make flat pictures look real.", "เราจะเรียนทำภาพแบนให้ดูเหมือนจริง")],
      [pic("flatToCube")])
slide(44, "think", P("The big question", "คำถามสำคัญ"),
      [P("How can you draw a 2D picture in 3D?", "เราจะวาดภาพ 2 มิติ ให้เป็น 3 มิติ ได้อย่างไร"),
       P("We need two things:", "เราต้องใช้ 2 อย่าง"),
       P("1. Lines", "1. เส้น"), P("2. Light and shadow", "2. แสงและเงา")],
      [pic("cubeBeforeAfter")])
slide(45, "look", P("Flat shape or solid form?", "รูปร่างแบน หรือรูปทรงตัน"),
      [P("A circle is flat. A sphere is round like a ball.", "วงกลมแบน ทรงกลมกลมเหมือนลูกบอล"),
       P("A square is flat. A cube is like a box.", "สี่เหลี่ยมจัตุรัสแบน ลูกบาศก์เหมือนกล่อง")],
      [pic("shapesForms", cap=P("Circle → Sphere · Square → Cube", "วงกลม → ทรงกลม · สี่เหลี่ยมจัตุรัส → ลูกบาศก์"))])
slide(45, "look", P("What is depth?", "ความลึกคืออะไร"),
      [P("2D picture: width and length.", "ภาพ 2 มิติ: กว้างและยาว"),
       P("3D picture: width, length and depth.", "ภาพ 3 มิติ: กว้าง ยาว และลึก"),
       P("Depth goes from front to back.", "ความลึกคือระยะจากด้านหน้าถึงด้านหลัง")],
      [pic("dims", cap=P("W = width · L = length · D = depth", "W = กว้าง · L = ยาว · D = ลึก"))])
slide(45, "book", P("A line drawing becomes 3D", "ภาพลายเส้นกลายเป็น 3 มิติ"),
      [P("Look at the banana and the fruit in your book.", "ดูกล้วยและผลไม้ในหนังสือ"),
       P("New lines show the round shape.", "เส้นใหม่ช่วยแสดงความกลม")],
      [pic("t1b", "banana.jpg", P("Banana: flat → 3D", "กล้วย: แบน → 3 มิติ")),
       pic("sort6", "mangosteen.jpg", P("Mangosteen: flat → 3D", "มังคุด: แบน → 3 มิติ"))])
slide(45, "book", P("A square becomes a cube", "สี่เหลี่ยมกลายเป็นลูกบาศก์"),
      [P("Draw a square. Draw a second square behind it.", "วาดสี่เหลี่ยม แล้ววาดสี่เหลี่ยมอีกรูปไว้ข้างหลัง"),
       P("Join the corners. Now it is a cube!", "ลากเส้นเชื่อมมุม ตอนนี้เป็นลูกบาศก์แล้ว")],
      [pic("squareToCube")], tip=P("See the Draw along: Cube.", "ดูวาดตามทีละขั้น: ลูกบาศก์"))
slide(46, "look", P("Shading makes it 3D", "การแรเงาทำให้เป็น 3 มิติ"),
      [P("We can convert a line drawing to 3D with shading.", "เราเปลี่ยนภาพลายเส้นเป็น 3 มิติได้ด้วยการแรเงา"),
       P("After shading, it looks realistic.", "หลังแรเงา ภาพดูเหมือนจริง")],
      [pic("shade3d")])
slide(46, "point", P("Geometric forms", "รูปทรงเรขาคณิต"),
      [P("Point and name each form.", "ชี้และบอกชื่อรูปทรงแต่ละรูป"),
       P("Sphere · Cube · Cylinder · Pyramid · Cone", "ทรงกลม · ลูกบาศก์ · ทรงกระบอก · พีระมิด · กรวย")],
      [pic("forms")])
slide(47, "look", P("Flat is light. Solid is heavy!", "ของแบนเบา ของตันหนัก"),
      [P("A paper circle is flat and light.", "วงกลมกระดาษแบนและเบา"),
       P("A ball and a box are solid. They have thickness.", "ลูกบอลและกล่องเป็นก้อน มีความหนา")],
      [pic("shapesForms", "boy-2d-3d.jpg")])
slide(47, "look", P("Near and far", "ใกล้และไกล"),
      [P("Near things look big.", "ของที่อยู่ใกล้ดูใหญ่"),
       P("Far things look small.", "ของที่อยู่ไกลดูเล็ก"),
       P("This shows depth.", "นี่คือการแสดงความลึก")],
      [pic("nearFar")])
slide(48, "look", P("The side facing the light", "ด้านที่หันเข้าหาแสง"),
      [P("The side facing the light is bright.", "ด้านที่หันเข้าหาแสงสว่าง"),
       P("Sides with little light are dark.", "ด้านที่ได้แสงน้อยมืด")],
      [pic("lightSides"), pic("sphere:left", "oranges-candle.jpg", P("Far from the light = darker", "ไกลแสง = มืดกว่า"))],
      tip=P("Look at the oranges. Which one is near the candle? It is the brightest.", "ดูส้ม ลูกไหนอยู่ใกล้เทียน ลูกนั้นสว่างที่สุด"))
slide(48, "vote", P("Light from the right. Which side is bright?", "แสงมาจากทางขวา ด้านไหนสว่าง"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("voteRightQ")],
      vote={"options": [P("A. Left", "A. ซ้าย"), P("B. Right", "B. ขวา")], "answer": 1, "fig": "voteRightA",
            "why": P("The light is on the right, so the right side is bright.", "แสงอยู่ทางขวา ด้านขวาจึงสว่าง")})
slide(48, "point", P("Light can come from many sides", "แสงมาได้จากหลายทิศทาง"),
      [P("Point to the brightest spot.", "ชี้จุดที่สว่างที่สุด")],
      [pic("sphere:top", cap=P("Top", "บน")), pic("sphere:left", cap=P("Left", "ซ้าย")), pic("sphere:right", cap=P("Right", "ขวา")),
       pic("sphere:below", cap=P("Below", "ล่าง")), pic("sphere:behind", cap=P("Behind", "หลัง")), pic("sphere:front", cap=P("Front", "หน้า"))],
      layout="grid6")
slide(49, "pencil", P("Technique 1: Line shading", "เทคนิคที่ 1: แรเงาด้วยเส้น"),
      [P("Use three levels: light, medium, heavy.", "ใช้ 3 ระดับ: อ่อน กลาง เข้ม"),
       P("Lines close together look dark.", "เส้นยิ่งชิดกัน ยิ่งดูเข้ม")],
      [pic("hatch3", cap=P("Light · Medium · Heavy", "อ่อน · กลาง · เข้ม"))])
slide(49, "colour", P("Technique 2: Painting light and shadow", "เทคนิคที่ 2: ระบายสีแสงและเงา"),
      [P("1. Sketch  2. Base colour  3. Blend  4. Shadow", "1. ร่างภาพ  2. ลงสีพื้น  3. ไล่สี  4. เพิ่มเงา"),
       P("Use a light colour on the side facing the light.", "ด้านรับแสงใช้สีอ่อน")],
      [pic("paintStages", "mango-stages.jpg")])
slide(50, "colour", P("Techniques 3 and 4: Light and heavy colours", "เทคนิคที่ 3 และ 4: สีอ่อนและสีเข้ม"),
      [P("1 = light colour · 2 = medium · 3 = heavy colour", "1 = สีอ่อน · 2 = สีกลาง · 3 = สีเข้ม"),
       P("Light top. Medium front. Dark side.", "ด้านบนอ่อน ด้านหน้ากลาง ด้านข้างเข้ม")],
      [pic("valueBlock"), pic("boxValues")])
slide(51, "pencil", P("Technique 5: One black pencil", "เทคนิคที่ 5: ดินสอดำแท่งเดียว"),
      [P("Press lightly first.", "ลงน้ำหนักเบา ๆ ก่อน"),
       P("Then build up the dark side.", "แล้วค่อยเพิ่มความเข้มด้านมืด")],
      [pic("pencilScale"), pic("sort4", "puppy-pencil.jpg")])
slide(52, "look", P("A shadow on the ground", "เงาที่ทอดลงบนพื้น"),
      [P("Light cannot go through the ball.", "แสงผ่านลูกบอลไม่ได้"),
       P("So there is a cast shadow on the ground.", "จึงเกิดเงาตกทอดบนพื้น"),
       P("Light from the left. Shadow to the right.", "แสงมาจากซ้าย เงาทอดไปทางขวา")],
      [pic("castShadow")])
slide(52, "vote", P("Light from the left. Where is the shadow?", "แสงมาจากทางซ้าย เงาอยู่ตรงไหน"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("voteShadowQ")],
      vote={"options": [P("A. Left", "A. ซ้าย"), P("B. Right", "B. ขวา")], "answer": 1, "fig": "voteShadowA",
            "why": P("The shadow goes away from the light.", "เงาไปทางตรงข้ามกับแสง")})
slide(52, "look", P("No shadow or a shadow?", "ไม่มีเงา หรือมีเงา"),
      [P("Without a shadow, the ball seems to float.", "ถ้าไม่มีเงา ลูกบอลดูเหมือนลอยอยู่"),
       P("The cast shadow makes it realistic.", "เงาตกทอดทำให้ดูเหมือนจริง")],
      [pic("noShadow", cap=P("No shadow", "ไม่มีเงา")), pic("castShadow", cap=P("Cast shadow", "มีเงาตกทอด")),
       pic("veg", "veg-still-life.jpg", P("Vegetables with shadows", "ผักที่มีเงา"))])
slide(53, "detective", P("The beach in the book", "ชายหาดในหนังสือ"),
      [P("Scenery shows places: rice fields, forest, sea.", "ภาพทิวทัศน์แสดงสถานที่ เช่น ทุ่งนา ป่า ทะเล"),
       P("What is near? What is far?", "อะไรอยู่ใกล้ อะไรอยู่ไกล")],
      [pic("scenery", "beach.jpg")])
slide(53, "detective", P("One light direction", "แสงมาจากทิศเดียวกัน"),
      [P("One sun. All shadows go the same way.", "ดวงอาทิตย์ดวงเดียว เงาทุกอันไปทางเดียวกัน"),
       P("This is harmonious.", "แบบนี้เรียกว่ากลมกลืน")],
      [pic("scenery", cap=P("✅ Harmonious", "✅ กลมกลืน")), pic("sceneryWrong", cap=P("❌ Shadows go different ways", "❌ เงาไปคนละทาง"))])
slide(54, "extension", P("Real light or imaginary light?", "แสงแบบจริง หรือแสงจากจินตนาการ"),
      [P("Use your imagination!", "ใช้จินตนาการของเรา"),
       P("Surreal art is like a dream.", "ศิลปะเหนือจริงเหมือนความฝัน"),
       P("What if the light were green?", "ถ้าแสงเป็นสีเขียวล่ะ")],
      [pic("veg", "veg-still-life.jpg", P("Real light", "แสงแบบจริง")), pic("surreal", "surreal-fruit.jpg", P("Imaginary light", "แสงจากจินตนาการ"))])
slide(54, "vote", P("Which picture is surreal?", "ภาพไหนเหนือจริง"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("t9c", cap=P("A", "A")), pic("glassFruit", cap=P("B", "B"))],
      vote={"options": [P("A", "A"), P("B", "B")], "answer": 1,
            "why": P("B has rainbow light. It is like a dream.", "ภาพ B มีแสงสีรุ้ง เหมือนความฝัน")})
slide(44, "review", P("What helps a picture look real?", "อะไรช่วยให้ภาพดูเหมือนจริง"),
      [P("A = 1 finger · B = 2 fingers", "A = ชู 1 นิ้ว · B = ชู 2 นิ้ว")],
      [pic("castShadow")],
      vote={"options": [P("A. Light and shadow", "A. แสงและเงา"), P("B. Draw it bigger", "B. วาดให้ใหญ่ขึ้น")], "answer": 0,
            "why": P("Light, shadow and a cast shadow make it look real.", "แสง เงา และเงาตกทอด ทำให้ภาพดูเหมือนจริง")})

# ---------------------------------------------------------------- DRAW ALONG (pictures in js/steps.js)
GUIDES = [
    {"id": "cube", "page": 45, "title": P("Cube from a square", "ลูกบาศก์จากสี่เหลี่ยม"), "steps": [
        P("Draw a square.", "วาดรูปสี่เหลี่ยมจัตุรัส"),
        P("Draw the same square a little up and to the right.", "วาดสี่เหลี่ยมขนาดเท่ากัน เลื่อนขึ้นและไปทางขวานิดหน่อย"),
        P("Join the 4 corners with lines.", "ลากเส้นเชื่อมมุมทั้ง 4 มุม"),
        P("Rub out the lines at the back.", "ลบเส้นที่อยู่ด้านหลัง"),
        P("Find the light. Top = light, front = medium, side = dark.", "ดูแสง ด้านบน = อ่อน ด้านหน้า = กลาง ด้านข้าง = เข้ม"),
        P("Add a cast shadow away from the light.", "เติมเงาตกทอดไปทางตรงข้ามกับแสง")]},
    {"id": "ball", "page": 48, "title": P("A shaded ball", "ลูกบอลแรเงา"), "steps": [
        P("Draw a circle.", "วาดวงกลม"),
        P("Draw a small sun. Mark the bright spot near the sun.", "วาดดวงอาทิตย์เล็ก ๆ แล้วทำเครื่องหมายจุดสว่างใกล้ดวงอาทิตย์"),
        P("Colour lightly. Keep the bright spot white.", "ลงสีเบา ๆ เว้นจุดสว่างไว้เป็นสีขาว"),
        P("Make the far side darker: medium, then heavy.", "ทำด้านที่ไกลแสงให้เข้มขึ้น: กลาง แล้วเข้ม"),
        P("Add a cast shadow on the ground.", "เติมเงาตกทอดบนพื้น")]},
    {"id": "cup", "page": 46, "title": P("A cup (cylinder)", "แก้วน้ำ (ทรงกระบอก)"), "steps": [
        P("Draw an oval for the top.", "วาดวงรีเป็นปากแก้ว"),
        P("Draw two straight lines down.", "ลากเส้นตรง 2 เส้นลงมา"),
        P("Draw a curve at the bottom. Add a handle.", "วาดเส้นโค้งที่ก้นแก้ว แล้วเติมหูจับ"),
        P("Light side = light colour. Far side = dark colour.", "ด้านรับแสง = สีอ่อน ด้านไกลแสง = สีเข้ม"),
        P("Add a cast shadow.", "เติมเงาตกทอด")]},
    {"id": "lines", "page": 49, "title": P("Line shading practice", "ฝึกแรเงาด้วยเส้น"), "steps": [
        P("Box 1: a few lines far apart. Light.", "กล่อง 1: เส้นน้อย ห่างกัน อ่อน"),
        P("Box 2: more lines, closer. Medium.", "กล่อง 2: เส้นมากขึ้น ชิดขึ้น กลาง"),
        P("Box 3: many lines, very close. Heavy.", "กล่อง 3: เส้นมาก ชิดกันมาก เข้ม"),
        P("Now use all three on a ball!", "ใช้ทั้ง 3 ระดับกับลูกบอล")]},
    {"id": "apple", "page": 49, "title": P("An apple with colour pencils", "แอปเปิลด้วยสีไม้"), "steps": [
        P("Sketch the apple, the stem and the leaf.", "ร่างแอปเปิล ก้าน และใบ"),
        P("Base colour: colour it all light red.", "ลงสีพื้น: ระบายสีแดงอ่อนทั้งลูก"),
        P("Blend: darker red away from the light. Keep a white spot.", "ไล่สี: แดงเข้มขึ้นด้านที่ไกลแสง เว้นจุดขาวไว้"),
        P("Add the cast shadow.", "เติมเงาตกทอด")]},
    {"id": "heart", "page": 56, "title": P("A 3D heart", "หัวใจ 3 มิติ"), "steps": [
        P("Draw a big heart.", "วาดหัวใจใหญ่ ๆ"),
        P("Draw the sun. Mark the bright spot.", "วาดดวงอาทิตย์ ทำเครื่องหมายจุดสว่าง"),
        P("Colour it light pink.", "ระบายสีชมพูอ่อน"),
        P("Make the edges far from the light darker.", "ทำขอบที่ไกลแสงให้เข้มขึ้น"),
        P("Add a white bright spot and a shadow.", "เติมจุดสว่างสีขาวและเงา")]},
    {"id": "beach", "page": 53, "title": P("The beach scene", "ภาพทิวทัศน์ชายหาด"), "steps": [
        P("Sea and shore: draw the horizon and a curved shore.", "ทะเลและชายฝั่ง: วาดเส้นขอบฟ้าและชายฝั่งโค้ง"),
        P("Big shapes first: big palm, girl, small palms far away.", "วาดรูปใหญ่ก่อน: ต้นมะพร้าวใหญ่ เด็กผู้หญิง ต้นเล็กอยู่ไกล"),
        P("Add coconuts, a face and a little crab.", "เติมมะพร้าว ใบหน้า และปูตัวเล็ก"),
        P("Base colours: sea, sand, tree and girl.", "ลงสีพื้น: ทะเล ทราย ต้นไม้ และเด็กผู้หญิง"),
        P("Light and shadow: light left, dark right, shadows on the sand.", "แสงและเงา: ซ้ายสว่าง ขวามืด เงาทอดบนทราย")]},
    {"id": "circle", "page": 57, "title": P("Activity 4: the circle becomes 3D", "กิจกรรมที่ 4: วงกลมกลายเป็น 3 มิติ"), "steps": [
        P("Look at the circle in your book (p.57).", "ดูวงกลมในหนังสือ (หน้า 57)"),
        P("Choose where the light comes from. Draw a small sun.", "เลือกว่าแสงมาจากทางไหน วาดดวงอาทิตย์เล็ก ๆ"),
        P("What can it be? An orange, a ball, a planet...", "จะเป็นอะไรดี ส้ม ลูกบอล ดาวเคราะห์..."),
        P("Shade it: light, medium and heavy.", "แรเงา: อ่อน กลาง และเข้ม"),
        P("Add a cast shadow. Write a title.", "เติมเงาตกทอด แล้วเขียนชื่อภาพ")]},
]

# ---------------------------------------------------------------- BOOK ACTIVITIES (book p.55 to 58)
RUBRIC = {
    "title": P("Artwork Evaluation Form", "แบบประเมินผลงานศิลปะ"),
    "cols": [P("Very good (6 marks)", "ดีมาก (6 คะแนน)"), P("Good (4-5 marks)", "ดี (4-5 คะแนน)"), P("Fair (2-3 marks)", "พอใช้ (2-3 คะแนน)"), P("Need to be improved (1 mark)", "ควรปรับปรุง (1 คะแนน)")],
    "rows": [P("Creativity", "ความคิดสร้างสรรค์"), P("Willingness to work", "ความตั้งใจในการทำงาน"), P("Beauty of artwork", "ความสวยงามของผลงาน"),
             P("Using correct materials and equipment", "การใช้วัสดุอุปกรณ์ถูกต้อง"), P("Neatness of the work", "ความเรียบร้อยของผลงาน")],
    "levels": [["21 - 25", P("Very good", "ดีมาก"), "4"], ["15 - 20", P("Good", "ดี"), "3"], ["8 - 14", P("Fair", "พอใช้"), "2"], ["1 - 7", P("Need to be improved", "ควรปรับปรุง"), "1"]],
}
ACTIVITIES = [
    {"num": 1, "page": 55, "marks": 20, "kind": "sort",
     "title": P("2D or 3D? Sort the pictures", "2 มิติ หรือ 3 มิติ แยกภาพ"),
     "task": P("Look at the 8 pictures. Write the numbers in the 2D group or the 3D group.", "ดูภาพทั้ง 8 ภาพ เขียนหมายเลขในกลุ่ม 2 มิติ หรือกลุ่ม 3 มิติ"),
     "steps": [P("Only lines or one flat colour? → 2D", "มีแค่เส้นหรือสีเรียบสีเดียว → 2 มิติ"),
               P("Light parts, dark parts and depth? → 3D", "มีส่วนสว่าง ส่วนมืด และความลึก → 3 มิติ")],
     "items": [["sort1", "2D", P("Octagon", "รูปแปดเหลี่ยม")], ["sort2", "3D", P("Apple", "แอปเปิล")], ["sort3", "2D", P("Umbrella", "ร่ม")], ["sort4", "3D", P("Puppy", "ลูกสุนัข")],
               ["sort5", "3D", P("Teapot", "กาน้ำชา")], ["sort6", "2D", P("Circle", "วงกลม")], ["sort7", "3D", P("Pyramid", "พีระมิด")], ["sort8", "2D", P("Sun", "ดวงอาทิตย์")]],
     "imgs": {"sort2": "apple.jpg", "sort5": "teapot.jpg"},
     "answer": P("2D: 1, 3, 6, 8 · 3D: 2, 4, 5, 7", "2 มิติ: 1, 3, 6, 8 · 3 มิติ: 2, 4, 5, 7"),
     "scoring": P("20 marks: 10 for the 2D group, 10 for the 3D group.", "20 คะแนน: กลุ่ม 2 มิติ 10 คะแนน กลุ่ม 3 มิติ 10 คะแนน")},
    {"num": 2, "page": 56, "marks": 20, "kind": "draw", "guide": "cube",
     "title": P("Draw a 2D picture and a 3D picture", "วาดภาพ 2 มิติ และภาพ 3 มิติ"),
     "task": P("Look around you. Draw one flat thing (2D) and one solid thing (3D). Write a title for each.", "มองรอบ ๆ ตัว วาดของแบน 1 อย่าง (2 มิติ) และของที่เป็นก้อน 1 อย่าง (3 มิติ) เขียนชื่อภาพแต่ละภาพ"),
     "steps": [P("2D: a flat thing, like a sheet of paper.", "2 มิติ: ของแบน เช่น กระดาษหนึ่งแผ่น"),
               P("3D: a solid thing, like a pencil or a box.", "3 มิติ: ของที่เป็นก้อน เช่น ดินสอ หรือกล่อง"),
               P("Shade the 3D picture: light, medium, dark.", "แรเงาภาพ 3 มิติ: อ่อน กลาง เข้ม"),
               P("Write the titles.", "เขียนชื่อภาพ")],
     "example": [pic("t1d", cap=P("2D: a sheet of paper", "2 มิติ: กระดาษหนึ่งแผ่น")), pic("matPencil", cap=P("3D: a pencil", "3 มิติ: ดินสอ"))],
     "answer": P("Book example: 2D = a single sheet of paper. 3D = a pencil.", "ตัวอย่างในหนังสือ: 2 มิติ = กระดาษหนึ่งแผ่น 3 มิติ = ดินสอ"),
     "scoring": P("20 marks: 10 for each picture.", "20 คะแนน: ภาพละ 10 คะแนน")},
    {"num": 3, "page": 56, "marks": 20, "kind": "draw", "guide": "ball",
     "title": P("Colour the line drawings to make them 3D", "ระบายสีภาพลายเส้นให้เป็น 3 มิติ"),
     "task": P("Colour the two pictures in your book. Make them look 3D.", "ระบายสีภาพ 2 ภาพในหนังสือ ให้ดูเป็น 3 มิติ"),
     "steps": [P("Draw a small sun. Where is the light?", "วาดดวงอาทิตย์เล็ก ๆ แสงอยู่ทางไหน"),
               P("Side facing the light: light colour.", "ด้านที่หันเข้าหาแสง: สีอ่อน"),
               P("Other sides: darker colour.", "ด้านอื่น: สีเข้มขึ้น"),
               P("Add a cast shadow.", "เติมเงาตกทอด")],
     "answer": P("Answers will vary. Light side is light, far side is dark, and there is a cast shadow.", "คำตอบแตกต่างกันได้ ด้านรับแสงสีอ่อน ด้านไกลแสงสีเข้ม และมีเงาตกทอด"),
     "scoring": P("20 marks: 10 for each picture.", "20 คะแนน: ภาพละ 10 คะแนน")},
    {"num": 4, "page": 57, "marks": 30, "kind": "draw", "guide": "circle", "rubric": True,
     "title": P("Evaluation activity: add a 3D object", "กิจกรรมประเมินผล: เติมวัตถุ 3 มิติ"),
     "task": P("Look at the circle in your book. Turn it into a 3D object from your imagination. Use light and shadow. Write a title.", "ดูวงกลมในหนังสือ เปลี่ยนให้เป็นวัตถุ 3 มิติจากจินตนาการ ใช้แสงและเงา แล้วเขียนชื่อภาพ"),
     "steps": [P("Choose the light. Draw a small sun.", "เลือกทิศทางแสง วาดดวงอาทิตย์เล็ก ๆ"),
               P("What can the circle be? Think!", "วงกลมจะเป็นอะไรได้บ้าง ลองคิด"),
               P("Shade: light, medium, heavy.", "แรเงา: อ่อน กลาง เข้ม"),
               P("Add a cast shadow and a title.", "เติมเงาตกทอดและชื่อภาพ")],
     "example": [pic("idea4a", cap=P("An orange", "ส้ม")), pic("idea4b", cap=P("A planet", "ดาวเคราะห์")), pic("idea4c", cap=P("The moon", "ดวงจันทร์"))],
     "answer": P("Answers will vary. The teacher uses the Artwork Evaluation Form (p.58).", "คำตอบแตกต่างกันได้ ครูใช้แบบประเมินผลงานศิลปะ (หน้า 58)"),
     "scoring": P("30 marks. The teacher uses the Artwork Evaluation Form (p.58).", "30 คะแนน ครูใช้แบบประเมินผลงานศิลปะ (หน้า 58)")},
]

# ---------------------------------------------------------------- UNIT TEST (book p.59 to 61), for class review
TEST = [
    {"page": 59, "q": P("Which choice shows a 3D sketch?", "ข้อใดเป็นภาพร่าง 3 มิติ"), "options": ["fig:t1a", "fig:t1b", "fig:t1c", "fig:t1d"], "answer": 1,
     "why": P("It has shading, so it looks round.", "มีการแรเงา จึงดูกลม")},
    {"page": 59, "q": P("Which choice describes a 3D drawing?", "ข้อใดบอกลักษณะของภาพวาด 3 มิติ"),
     "options": [P("A cave with depth", "ถ้ำที่มีความลึก"), P("A 4×6\" photo", "รูปถ่ายขนาด 4×6 นิ้ว"), P("A sheet of drawing paper", "กระดาษวาดเขียนหนึ่งแผ่น"), P("A piece of locally woven cloth", "ผ้าทอพื้นเมืองหนึ่งผืน")], "answer": 0,
     "why": P("3D shows depth. A cave is deep.", "3 มิติแสดงความลึก ถ้ำมีความลึก")},
    {"page": 59, "q": P("Which choice shows a 3D picture with pencil shading?", "ข้อใดเป็นภาพ 3 มิติที่แรเงาด้วยดินสอ"), "options": ["fig:t3a", "fig:t3b", "fig:t3c", "fig:t3d"], "answer": 2,
     "why": P("It is shaded with a grey pencil only.", "แรเงาด้วยดินสอสีเทาอย่างเดียว")},
    {"page": 60, "q": P("Why do we use a cast shadow?", "เราใช้เงาตกทอดเพื่ออะไร"),
     "options": [P("To make the picture bigger", "ทำให้ภาพใหญ่ขึ้น"), P("To make the picture brighter", "ทำให้ภาพสว่างขึ้น"), P("To show the picture from one angle", "ทำให้เห็นภาพจากมุมเดียว"), P("To make the picture more realistic", "ทำให้ภาพดูเหมือนจริงมากขึ้น")], "answer": 3,
     "why": P("A cast shadow makes it look real.", "เงาตกทอดทำให้ภาพดูเหมือนจริง")},
    {"page": 60, "q": P("Which is the best description of this picture?", "ข้อใดอธิบายภาพนี้ได้ดีที่สุด"), "fig": "t5", "img": "beach.jpg",
     "options": [P("It is a 2D line drawing.", "เป็นภาพลายเส้น 2 มิติ"), P("It is a scenery picture with light and shadow.", "เป็นภาพทิวทัศน์ที่มีแสงและเงา"), P("It uses form to show depth.", "ใช้รูปทรงแสดงความลึก"), P("It is an example of cast shadows.", "เป็นตัวอย่างการวาดเงาตกทอด")], "answer": 1,
     "why": P("It is a beach scenery with light and shadow.", "เป็นภาพทิวทัศน์ชายหาดที่มีแสงและเงา")},
    {"page": 60, "q": P("Which side does the light shine from?", "แสงส่องมาจากด้านไหน"), "fig": "t6",
     "options": [P("➡ (from the left)", "➡ (มาจากทางซ้าย)"), P("⬅ (from the right)", "⬅ (มาจากทางขวา)"), P("⬇ (from the top)", "⬇ (มาจากด้านบน)"), P("⬆ (from below)", "⬆ (มาจากด้านล่าง)")], "answer": 0,
     "why": P("The left side is bright. The shadow is on the right.", "ด้านซ้ายสว่าง เงาอยู่ทางขวา")},
    {"page": 61, "q": P("You want one side in shadow. What do you do?", "อยากให้ด้านหนึ่งอยู่ในเงา ควรทำอย่างไร"),
     "options": [P("Paint with white colour.", "ระบายด้วยสีขาว"), P("Paint with light colour.", "ระบายด้วยสีอ่อน"), P("Paint with dark colour.", "ระบายด้วยสีเข้ม"), P("Paint with many colours.", "ระบายด้วยหลายสี")], "answer": 2,
     "why": P("Shadow sides are dark.", "ด้านที่อยู่ในเงามืดกว่า")},
    {"page": 61, "q": P("Which is the best description of this picture?", "ข้อใดอธิบายภาพนี้ได้ดีที่สุด"), "fig": "t8",
     "options": [P("Surreal, extraordinary light", "แสงแปลกไม่ธรรมดาแบบเหนือจริง"), P("Different light and shadow", "แสงและเงาที่ต่างกัน"), P("Form without light and shadow", "รูปทรงที่ไม่มีแสงและเงา"), P("Cast shadow", "เงาตกทอด")], "answer": 2,
     "why": P("Every side is the same colour. No light, no shadow.", "ทุกด้านสีเดียวกัน ไม่มีแสง ไม่มีเงา")},
    {"page": 61, "q": P("Which picture is the most surreal?", "ภาพใดเหนือจริงที่สุด"), "options": ["fig:t9a", "fig:t9b", "fig:t9c", "fig:t9d"], "answer": 3,
     "why": P("The light is like a dream.", "แสงเหมือนความฝัน")},
    {"page": 61, "q": P("How can you get better at drawing 3D?", "จะวาดภาพ 3 มิติให้เก่งขึ้นได้อย่างไร"),
     "options": [P("Practise lines, then shading and shadows.", "ฝึกวาดเส้น แล้วฝึกแรเงาและเงา"), P("Think about composition and balance on every side.", "คิดเรื่องการจัดองค์ประกอบและความสมดุลทุกด้าน"),
                 P("Only use a pencil until you are an expert.", "ใช้ดินสออย่างเดียวจนกว่าจะเก่ง"), P("Practise using many colours.", "ฝึกใช้หลายสี")], "answer": 0,
     "why": P("Lines first, then light and shadow.", "วาดเส้นก่อน แล้วค่อยแรเงาแสงและเงา")},
]

# ---------------------------------------------------------------- EXPLORE (interactive tools for the projector)
EXPLORE = {
    "tools": [
        {"id": "light", "name": P("Move the light", "เลื่อนแสง"), "tip": P("Drag the sun. Watch the bright side and the shadow move.", "ลากดวงอาทิตย์ ดูด้านสว่างและเงาเปลี่ยนไป")},
        {"id": "depth", "name": P("2D to 3D", "จาก 2 มิติ เป็น 3 มิติ"), "tip": P("Move the slider. The flat shape becomes 3D.", "เลื่อนแถบ รูปแบนกลายเป็น 3 มิติ")},
        {"id": "shade", "name": P("Light, medium, heavy", "อ่อน กลาง เข้ม"), "tip": P("Tap a level. See the lines get closer.", "แตะระดับ ดูเส้นชิดกันมากขึ้น")},
    ],
    "facts": [P("2D = width and length. 3D = width, length and depth.", "2 มิติ = กว้างและยาว 3 มิติ = กว้าง ยาว และลึก"),
              P("The side facing the light is bright.", "ด้านที่หันเข้าหาแสงสว่าง"),
              P("The shadow goes away from the light.", "เงาไปทางตรงข้ามกับแสง"),
              P("Shade in three levels: light, medium, heavy.", "แรเงา 3 ระดับ: อ่อน กลาง เข้ม")],
    "mistakes": [P("The side near the light is dark. ❌", "ด้านใกล้แสงมืด ❌"),
                 P("The shadow is on the same side as the light. ❌", "เงาอยู่ด้านเดียวกับแสง ❌"),
                 P("Shadows go different ways in one picture. ❌", "เงาไปคนละทางในภาพเดียวกัน ❌"),
                 P("No cast shadow, so it floats. ❌", "ไม่มีเงาตกทอด วัตถุจึงดูลอย ❌")],
}

# ---------------------------------------------------------------- GAMES (projector)
QUIZ = [  # options[0] is right; the page mixes them
    {"q": P("A 2D picture has width and...", "ภาพ 2 มิติมีความกว้างและ..."), "options": [P("length", "ความยาว"), P("depth", "ความลึก"), P("shadow", "เงา"), P("thickness", "ความหนา")]},
    {"q": P("A 3D picture also shows...", "ภาพ 3 มิติแสดง...ด้วย"), "options": [P("depth", "ความลึก"), P("only lines", "เส้นเท่านั้น"), P("no light", "ไม่มีแสง"), P("one flat colour", "สีเรียบสีเดียว")]},
    {"q": P("2D or 3D?", "2 มิติ หรือ 3 มิติ"), "fig": "sort2", "options": [P("3D", "3 มิติ"), P("2D", "2 มิติ")]},
    {"q": P("2D or 3D?", "2 มิติ หรือ 3 มิติ"), "fig": "sort6", "options": [P("2D", "2 มิติ"), P("3D", "3 มิติ")]},
    {"q": P("2D or 3D?", "2 มิติ หรือ 3 มิติ"), "fig": "sort7", "options": [P("3D", "3 มิติ"), P("2D", "2 มิติ")]},
    {"q": P("What makes a line drawing 3D?", "อะไรทำให้ภาพลายเส้นเป็น 3 มิติ"), "options": [P("Shading", "การแรเงา"), P("An eraser", "ยางลบ"), P("A title", "ชื่อภาพ"), P("A ruler", "ไม้บรรทัด")]},
    {"q": P("The side facing the light is...", "ด้านที่หันเข้าหาแสง..."), "options": [P("bright", "สว่าง"), P("dark", "มืด"), P("black", "สีดำ"), P("invisible", "มองไม่เห็น")]},
    {"q": P("Where does the light come from?", "แสงมาจากทางไหน"), "fig": "t6", "options": [P("The left", "ทางซ้าย"), P("The right", "ทางขวา"), P("Below", "ด้านล่าง"), P("Behind", "ด้านหลัง")]},
    {"q": P("Heavy shading: the lines are...", "แรเงาเข้ม: เส้น..."), "options": [P("close together", "ชิดกัน"), P("far apart", "ห่างกัน"), P("curly", "หยิก"), P("red", "สีแดง")]},
    {"q": P("A shadow on the ground is a...", "เงาบนพื้นเรียกว่า..."), "options": [P("cast shadow", "เงาตกทอด"), P("highlight", "จุดสว่าง"), P("outline", "เส้นรอบนอก"), P("colour wheel", "วงล้อสี")]},
    {"q": P("Light from the left. The shadow goes...", "แสงมาจากซ้าย เงาไป..."), "options": [P("to the right", "ทางขวา"), P("to the left", "ทางซ้าย"), P("up", "ขึ้นบน"), P("nowhere", "ไม่มีที่ไหน")]},
    {"q": P("Near things look...", "ของที่อยู่ใกล้ดู..."), "options": [P("big", "ใหญ่"), P("small", "เล็ก"), P("high", "สูง"), P("pale", "ซีด")]},
    {"q": P("In scenery, all shadows go...", "ในภาพทิวทัศน์ เงาทุกอันไป..."), "options": [P("the same way", "ทางเดียวกัน"), P("different ways", "คนละทาง"), P("up", "ขึ้นบน"), P("in circles", "เป็นวงกลม")]},
    {"q": P("A dream-like picture is...", "ภาพที่เหมือนความฝัน..."), "options": [P("surreal", "เหนือจริง"), P("realistic", "เหมือนจริง"), P("flat", "แบน"), P("geometric", "เรขาคณิต")]},
    {"q": P("Which form is round like a ball?", "รูปทรงใดกลมเหมือนลูกบอล"), "options": [P("Sphere", "ทรงกลม"), P("Cube", "ลูกบาศก์"), P("Cone", "กรวย"), P("Pyramid", "พีระมิด")]},
]
MATCH = [
    [P("2D", "2 มิติ"), P("width and length", "กว้างและยาว")],
    [P("3D", "3 มิติ"), P("width, length, depth", "กว้าง ยาว ลึก")],
    [P("Shading", "การแรเงา"), P("light and dark", "สว่างและมืด")],
    [P("Cast shadow", "เงาตกทอด"), P("dark shape on the ground", "รูปมืดบนพื้น")],
    [P("Surreal", "เหนือจริง"), P("like a dream", "เหมือนความฝัน")],
    [P("Scenery", "ทิวทัศน์"), P("rice field, forest, sea", "ทุ่งนา ป่า ทะเล")],
    [P("Heavy", "เข้ม"), P("lines close together", "เส้นชิดกัน")],
    [P("Light", "อ่อน"), P("few lines far apart", "เส้นน้อยห่างกัน")],
    [P("Sphere", "ทรงกลม"), P("round like a ball", "กลมเหมือนลูกบอล")],
    [P("Harmonious", "กลมกลืน"), P("shadows go one way", "เงาไปทางเดียว")],
]

unit = {
    "unit": "03",
    "title": P("Two Dimensions (2D) to Three Dimensions (3D)", "จาก 2 มิติ สู่ 3 มิติ"),
    "pages": "p.43 to 62",
    "indicator": P("Create visual art works with two dimensions to three dimensions by applying the principles of light and shadow and weight. (AR1.1 Gr 6/3)",
                   "สร้างงานทัศนศิลป์จาก 2 มิติ เป็น 3 มิติ โดยใช้หลักการของแสงเงาและน้ำหนัก (ศ 1.1 ป.6/3)"),
    "materials": MATERIALS,
    "vocabPage": 43,
    "vocab": VOCAB,
    "slides": SLIDES,
    "guides": GUIDES,
    "explore": EXPLORE,
    "activities": ACTIVITIES,
    "rubric": RUBRIC,
    "test": {"pages": "p.59 to 61", "questions": TEST},
    "quiz": QUIZ,
    "match": MATCH,
}

# Canva pictures: use them only when the file exists
for a in ACTIVITIES:
    if "imgs" in a:
        a["imgs"] = {k: "img/unit3/" + v for k, v in a["imgs"].items() if os.path.exists(os.path.join(IMG, v))}
for q in TEST:
    if "img" in q:
        if os.path.exists(os.path.join(IMG, q["img"])):
            q["img"] = "img/unit3/" + q["img"]
        else:
            del q["img"]

with open(os.path.join(ROOT, "content", "unit03.json"), "w", encoding="utf-8") as f:
    json.dump(unit, f, ensure_ascii=False, indent=1)
imgs = sum(1 for s in SLIDES for p in s["pics"] if "img" in p)
print(f"Wrote content/unit03.json: {len(SLIDES)} slides, {len(GUIDES)} draw-along guides, {len(ACTIVITIES)} activities, {len(TEST)} test questions, {imgs} Canva pictures in slides.")
