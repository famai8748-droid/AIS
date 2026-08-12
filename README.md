# 🎓 FindSelf Class (by AIS)

**คลาสรูมอัจฉริยะ ค้นหาตัวตน และปิดจุดอ่อนการเรียนรู้ด้วย AI Specific**

พัฒนาสำหรับ **JUMP THAILAND Hackathon 2026** — Track: Future of Education ร่วมกับ AIS

---

## 🌟 ภาพรวมโครงการ (Overview)

**FindSelf Class** เป็นแพลตฟอร์มการศึกษาที่มุ่งเน้นการแก้ปัญหาหลัก 2 ด้าน:
1. **ลดภาระงานของครู:** ด้วยระบบ AI ที่ช่วยวิเคราะห์จุดอ่อนของนักเรียนรายบุคคล และสร้าง "ชีทซ่อมแซมจุดอ่อน" (Remedial Sheet) อัตโนมัติด้วยการกดเพียงปุ่มเดียว
2. **แนะแนวค้นหาตัวตนนักเรียน:** มินิเกมค้นหาตัวตนที่จะประมวลผลความชอบและบุคลิกภาพ เพื่อแนะนำสายการเรียนและสายอาชีพในอนาคต พร้อมดึงฐานข้อมูลอาชีพของไทย

โครงการนี้บูรณาการเทคโนโลยีของ AIS ได้แก่ **AIS Number Verification API** เพื่อการยืนยันตัวตนที่ปลอดภัยผ่านซิมการ์ด และจำลองการใช้ **AIS 5G Edge Computing** สำหรับการรันโมเดล AI ภายในประเทศเพื่อรักษาข้อมูลส่วนบุคคล (PDPA)

---

## 🚀 เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจคได้รับการอัปเกรดเป็น Modern Web Architecture เพื่อประสิทธิภาพที่สูงขึ้น:

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Local Build) + Custom Glassmorphism UI
- **Routing & State:** React Hooks, Component-based Architecture
- **Features:** Hot Module Replacement (HMR) รวดเร็วในการพัฒนา

### Backend
- **Framework:** FastAPI (Python)
- **AI Integration:** Ollama (รัน Llama 3.2 Locally แบบ Edge AI)
- **Server:** Uvicorn (รองรับ `--reload` สำหรับ Development)

### Tools & Others
- **Package Manager:** npm
- **Concurrently:** สำหรับรัน Frontend และ Backend พร้อทกันในคำสั่งเดียว

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 👩‍🏫 มุมคุณครู (Teacher Portal)
- **Class Analytics Dashboard:** แดชบอร์ดสรุปภาพรวมห้องเรียน คะแนนเฉลี่ย และการแจ้งเตือนจุดอ่อน (Weakness Alerts)
- **One-Click Remedial Generator:** เพียงกดปุ่มเดียว AI จะสร้างชีทสรุปซ่อมแซม 1 หน้า + โจทย์ 3 ข้อ เฉพาะจุดที่นักเรียนทำผิด
- **AI Auto-Grading (Demo):** ระบบจำลองการตรวจกระดาษคำตอบด้วย AI OCR

### 🎓 มุมนักเรียน (Student Portal)
- **Self-Discovery Quest:** มินิเกมตอบคำถาม 4 ข้อ เพื่อให้ AI วิเคราะห์บุคลิกภาพและจับคู่กับสายอาชีพอนาคต (1-Page Career Summary)
- **My Classroom:** พื้นที่รับชีทซ่อมแซมเฉพาะบุคคลที่ครูส่งให้
- **Free Learning Hub:** คลังชีทสรุปและไมโครคอร์สเสริมทักษะอนาคต

### 🤖 AI ครูผู้ช่วย (Live Chat)
- แชทบอทถาม-ตอบที่รันด้วย Ollama Llama 3.2 สำหรับตอบคำถามบทเรียนและให้คำปรึกษาตลอด 24 ชั่วโมง

---

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

```text
AIS/
├── package.json              # กำหนดคำสั่ง npm (dev, build, start)
├── backend/
│   ├── main.py               # FastAPI Server หลัก (รันที่ port 8000)
│   └── ollama_service.py     # ตัวจัดการเชื่อมต่อกับ Ollama
└── frontend/                 # React Application (รัน dev ที่ port 5173)
    ├── index.html
    ├── vite.config.ts        # ตั้งค่า Vite และ Proxy (/api -> port 8000)
    ├── tailwind.config.js    # กำหนด Theme และ Colors (AIS Green)
    └── src/
        ├── main.tsx          # React Entry Point
        ├── App.tsx           # Root Component ควบคุม Layout & State
        ├── index.css         # Global Styles (Tailwind + CSS เดิม)
        ├── api/
        │   └── client.ts     # ตัวจัดการ API Requests (Fetch)
        ├── components/       # UI Components แยกส่วน (Header, Hero, Portals)
        └── types/            # TypeScript Interfaces
```

---

## 🛠️ วิธีการติดตั้งและใช้งาน (Setup & Run)

### สิ่งที่ต้องมี (Prerequisites)
1. **Node.js** (v18 ขึ้นไป)
2. **Python** (3.9 ขึ้นไป)
3. **Ollama** (พร้อม pull model `llama3.2` หรือรุ่นที่ใช้)

### 1. ติดตั้ง Dependencies

**ติดตั้ง Backend (Python):**
```bash
pip install fastapi uvicorn pydantic requests
```

**ติดตั้ง Frontend และ Root Dependencies (Node.js):**
```bash
npm install
npm run install:all
```

### 2. การรันเซิร์ฟเวอร์ (Development)

รันคำสั่งเดียวที่โฟลเดอร์ราก (`d:\AIS`) โปรแกรมจะเปิดทั้ง Frontend (Vite) และ Backend (FastAPI) ขึ้นมาพร้อมกัน:

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
- **AIS 5G & Edge Computing:** นำเสนอคอนเซปต์การตั้ง AI Server ภายในโรงเรียนผ่านโครงข่าย 5G หน่วงต่ำ เพื่อปกป้องข้อมูลนักเรียนไม่ให้รั่วไหลออกสู่อินเทอร์เน็ตภายนอก (PDPA Compliance)
