# 🎓 FindSelf Class (by AIS)

**คลาสรูมอัจฉริยะ ค้นหาตัวตน และปิดจุดอ่อนการเรียนรู้ด้วย AI Specific**

พัฒนาสำหรับ **JUMP THAILAND Hackathon 2026** — Track: Future of Education ร่วมกับ AIS

---

## 🌟 ภาพรวมโครงการ (Overview)

**FindSelf Class** เป็นแพลตฟอร์มการศึกษาที่มุ่งเน้นการแก้ปัญหาหลัก 2 ด้าน:
1. **ลดภาระงานของครู:** ด้วยระบบ AI ที่ช่วยวิเคราะห์จุดอ่อนของนักเรียนรายบุคคล และสร้าง "ชีทซ่อมแซมจุดอ่อน" (Remedial Sheet) อัตโนมัติด้วยการกดเพียงปุ่มเดียว
2. **แนะแนวค้นหาตัวตนนักเรียน:** มินิเกมค้นหาตัวตนที่จะประมวลผลความชอบและบุคลิกภาพ เพื่อแนะนำสายการเรียนและสายอาชีพในอนาคต พร้อมดึงฐานข้อมูลอาชีพของไทย

โครงการนี้บูรณาการเทคโนโลยีของ AIS ได้แก่ **AIS Number Verification API** เพื่อการยืนยันตัวตนที่ปลอดภัยผ่านซิมการ์ด และจำลองการใช้ **AIS 5G Edge Computing** สำหรับการรันโมเดลภาษาขนาดใหญ่ (OpenTyphoon) ภายในศูนย์ข้อมูลของไทยเพื่อความรวดเร็วและรักษาข้อมูลส่วนบุคคล (PDPA)

---

## 🚀 เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจคได้รับการอัปเกรดเป็น Modern Web Architecture เพื่อประสิทธิภาพที่สูงขึ้น:

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Glassmorphism UI
- **Typography:** Custom React Markdown Renderer (รองรับการแสดงผลสมการคณิตศาสตร์ LaTeX แบบ Native เหมือน ChatGPT)
- **Features:** Hot Module Replacement (HMR) รวดเร็วในการพัฒนา

### Backend
- **Framework:** FastAPI (Python)
- **AI Integration:** OpenTyphoon API (Typhoon v2.5) ใช้ผ่าน HTTPX สำหรับการเชื่อมต่อที่รวดเร็วและเสถียร
- **Server:** Uvicorn + Nodemon (รองรับ Auto-reload สำหรับ Development อย่างสมบูรณ์)

### Tools & Others
- **Package Manager:** npm
- **Concurrently:** สำหรับรัน Frontend และ Backend พร้อมกันในคำสั่งเดียว

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 👩‍🏫 มุมคุณครู (Teacher Portal)
- **Class Analytics Dashboard:** แดชบอร์ดสรุปภาพรวมห้องเรียน คะแนนเฉลี่ย และการแจ้งเตือนจุดอ่อน (Weakness Alerts)
- **One-Click Remedial Generator:** เพียงกดปุ่มเดียว AI จะสร้างชีทสรุปซ่อมแซม 1 หน้า + โจทย์ 3 ข้อ เฉพาะจุดที่นักเรียนทำผิด (พร้อมเรนเดอร์สมการคณิตศาสตร์ที่สวยงาม)
- **AI Auto-Grading (Demo):** ระบบจำลองการตรวจกระดาษคำตอบด้วย AI OCR

### 🎓 มุมนักเรียน (Student Portal)
- **Self-Discovery Quest:** มินิเกมตอบคำถาม 4 ข้อ เพื่อให้ AI วิเคราะห์บุคลิกภาพและจับคู่กับสายอาชีพอนาคต (1-Page Career Summary)
- **My Classroom:** พื้นที่รับชีทซ่อมแซมเฉพาะบุคคลที่ครูส่งให้
- **Free Learning Hub:** คลังชีทสรุปและไมโครคอร์สเสริมทักษะอนาคต

### 🤖 AI ครูผู้ช่วย (Live Chat)
- แชทบอทถาม-ตอบที่รันด้วย **Typhoon v2.5** สำหรับตอบคำถามบทเรียนและให้คำปรึกษาตลอด 24 ชั่วโมง พร้อมจัดหน้ากระดาษแบบ ChatGPT ที่อ่านง่ายและสบายตา

---

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

```text
AIS/
├── package.json              # กำหนดคำสั่ง npm (dev, build, start)
├── backend/
│   ├── main.py               # FastAPI Server หลัก (รันที่ port 8000)
│   ├── typhoon_service.py    # ตัวจัดการเชื่อมต่อกับ OpenTyphoon API
│   └── requirements.txt      # รายชื่อ Dependencies ของ Python
└── frontend/                 # React Application (รัน dev ที่ port 5173)
    ├── index.html            # หน้า HTML หลัก (โหลดฟอนต์ Prompt, Noto Sans Thai)
    ├── vite.config.ts        # ตั้งค่า Vite และ Proxy (/api -> port 8000)
    ├── tailwind.config.js    # กำหนด Theme และ Colors (AIS Green)
    └── src/
        ├── main.tsx          # React Entry Point
        ├── index.css         # Global Styles (Tailwind)
        ├── api/
        │   └── client.ts     # ตัวจัดการ API Requests (Fetch)
        └── components/       # UI Components
            ├── MarkdownRenderer.tsx # ตัวประมวลผลข้อความและสมการ AI
            └── ...           
```

---

## 🛠️ วิธีการติดตั้งและใช้งาน (Setup & Run)

### สิ่งที่ต้องมี (Prerequisites)
1. **Node.js** (v18 ขึ้นไป)
2. **Python** (3.9 ขึ้นไป)

### 1. ติดตั้ง Dependencies

**ติดตั้ง Backend (Python):**
```bash
cd backend
pip install -r requirements.txt
```

**ติดตั้ง Frontend และ Root Dependencies (Node.js):**
```bash
npm install
npm run install:all
```

### 2. การรันเซิร์ฟเวอร์ (Development)

รันคำสั่งเดียวที่โฟลเดอร์ราก (`d:\AIS`) โปรแกรมจะเปิดทั้ง Frontend (Vite) และ Backend (FastAPI + Nodemon) ขึ้นมาพร้อมกัน:

```bash
npm run dev
```

- **Frontend เข้าใช้งานได้ที่:** `http://localhost:5173`
- **Backend API รันอยู่ที่:** `http://localhost:8000`

### 3. การ Build สำหรับ Production

หากต้องการ Build Frontend เป็น Static Files เพื่อนำไป Deploy จริง:

```bash
npm run build
```
ไฟล์จะถูกสร้างใน `frontend/dist/` จากนั้นรัน Backend เพื่อเสิร์ฟไฟล์:
```bash
npm start
```
ระบบจะเปิดที่ `http://localhost:8000`

---

## 🤝 การเชื่อมต่อเทคโนโลยีของ AIS

- **AIS Number Verification:** ป้องกันปัญหาเด็กจำรหัสผ่านไม่ได้ ด้วยการยืนยันตัวตนอัตโนมัติผ่านเครือข่ายมือถือ (จำลองการทำงานใน Demo)
- **AIS Edge Computing & Typhoon API:** สาธิตการเชื่อมต่อ AI LLM (OpenTyphoon) ระดับประเทศที่สามารถประมวลผลภาษาไทยได้อย่างยอดเยี่ยม ตอบสนองรวดเร็วผ่านโครงข่าย 5G หน่วงต่ำ โดยข้อมูลไม่รั่วไหลออกเซิร์ฟเวอร์ต่างประเทศ (PDPA Compliance)
