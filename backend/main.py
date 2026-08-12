from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import sys

sys.path.append(os.path.dirname(__file__))
from ollama_service import ollama_service

app = FastAPI(
    title="FindSelf Class API",
    description="Backend API for FindSelf Class - JUMP THAILAND Hackathon 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AISVerifyRequest(BaseModel):
    phone_number: str

class SelfDiscoveryRequest(BaseModel):
    interests: str
    student_name: str = "นักเรียน"

class RemedialRequest(BaseModel):
    topic: str = "คณิตศาสตร์ ม.3 - การถอดรากที่สอง (Square Root)"
    weakness_summary: str = "เด็ก 20% ยังติดขัดเรื่องการแยกตัวประกอบและการถอดรากที่สอง"

class ChatRequest(BaseModel):
    message: str

@app.get("/api/health")
async def get_health():
    return {
        "status": "online",
        "app": "FindSelf Class",
        "ais_edge_computing": True,
        "ollama_online": await ollama_service.is_ollama_online(),
        "model": "llama3.2"
    }

@app.post("/api/auth/ais-verify")
async def ais_number_verification(req: AISVerifyRequest):
    phone = req.phone_number.strip()
    if not phone or len(phone) < 9:
        raise HTTPException(status_code=400, detail="กรุณาระบุเบอร์โทรศัพท์ AIS ให้ถูกต้อง")
    
    return {
        "status": "authenticated",
        "verification_method": "AIS Number Verification API (SIM-based Network Security)",
        "phone_number": phone,
        "user_info": {
            "name": "อาจารย์ สมชาย ใจดี" if "081" in phone or "089" in phone else "นักเรียน กิตติศักดิ์ พัฒนากุล",
            "role": "teacher" if "081" in phone or "089" in phone else "student",
            "school": "โรงเรียนสาธิตอนาคตวิทยา (AIS Smart Network)",
            "verified_at": "2026-08-11 Network Identity Verified"
        }
    }

@app.post("/api/chat/ollama")
async def chat_with_ollama_endpoint(req: ChatRequest):
    """Async live chat with Ollama Llama 3.2 via official ollama Python client"""
    msg = req.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="กรุณากรอกข้อความเพื่อสนทนากับ AI")
    
    result = await ollama_service.chat_with_ollama(msg)
    return result

@app.get("/api/teacher/analytics")
async def get_teacher_analytics():
    return {
        "classroom_name": "ม.3/1 - วิชาคณิตศาสตร์ & วิทยาศาสตร์",
        "total_students": 40,
        "average_score": 76.5,
        "weakness_alerts": [
            {
                "id": 1,
                "topic": "การถอดรากที่สอง (Square Root)",
                "affected_students_pct": 20,
                "affected_students_count": 8,
                "severity": "high",
                "recommended_remedial": "ชีทสรุปสรุปสมบัติรากที่สอง + 3 โจทย์ฝึกลดจุดผิด"
            },
            {
                "id": 2,
                "topic": "สมการกำลังสองตัวแปรเดียว",
                "affected_students_pct": 12.5,
                "affected_students_count": 5,
                "severity": "medium",
                "recommended_remedial": "ทบทวนการแยกตัวประกอบพหุนาม"
            }
        ]
    }

@app.post("/api/teacher/generate-remedial")
async def generate_remedial(req: RemedialRequest):
    result = await ollama_service.generate_remedial_sheet(req.topic, req.weakness_summary)
    return result

@app.post("/api/student/self-discovery")
async def student_self_discovery(req: SelfDiscoveryRequest):
    if not req.interests or len(req.interests.strip()) < 3:
        raise HTTPException(status_code=400, detail="กรุณาระบุความสนใจหรือสิ่งที่ชอบอย่างน้อย 3 ตัวอักษร")
    
    result = await ollama_service.generate_career_guidance(req.interests)
    return {
        "student_name": req.student_name,
        "interests_input": req.interests,
        "ai_result": result
    }

@app.get("/api/student/free-hub")
async def get_free_learning_hub():
    return [
        {
            "id": 1,
            "title": "คอร์สสั้น: Python for Data Science 101",
            "category": "Technology & AI",
            "duration": "15 นาที",
            "icon": "🐍"
        },
        {
            "id": 2,
            "title": "สรุปสูตรพิชิตสแควร์รูทและเลขยกกำลัง",
            "category": "Mathematics",
            "duration": "1 หน้า PDF",
            "icon": "📐"
        },
        {
            "id": 3,
            "title": "UX/UI Design Thinking สำหรับนักเรียน",
            "category": "Design & Product",
            "duration": "20 นาที",
            "icon": "🎨"
        }
    ]

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(FRONTEND_DIR):
    css_dir = os.path.join(FRONTEND_DIR, "css")
    js_dir = os.path.join(FRONTEND_DIR, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="css")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js")
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    def serve_frontend_index():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "FindSelf Class API Running."}

if __name__ == "__main__":
    import uvicorn
    import webbrowser
    import threading

    def open_browser():
        import time
        time.sleep(1.5)
        webbrowser.open("http://localhost:8000")

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
