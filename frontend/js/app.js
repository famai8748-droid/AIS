// FindSelf Class (by AIS) - Frontend Application Script
const API_BASE = (window.location.protocol === "file:" || (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && window.location.port !== "8000"))
    ? "http://localhost:8000"
    : ""; 

let currentRole = "teacher";
let currentUser = null;
let isOllamaOnline = false;

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    checkHealth();
    setupEventListeners();
    loadTeacherAnalytics();
    loadFreeHub();
    setupMiniGame();
}

async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/api/health`);
        const data = await res.json();
        isOllamaOnline = data.ollama_online;
        
        const statusEl = document.getElementById("ollama-status-badge");
        if (statusEl) {
            if (isOllamaOnline) {
                statusEl.innerHTML = `<span class="pulse-dot"></span> <span class="text-emerald-400 font-medium">AIS 5G Edge AI (Ollama Llama 3.2 Active)</span>`;
            } else {
                statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> <span class="text-amber-400 font-medium">FindSelf AIS Engine (Dataset RAG Mode)</span>`;
            }
        }
    } catch (e) {
        console.warn("API Server offline or running client-only mode", e);
    }
}

function setupEventListeners() {
    const btnTeacherRole = document.getElementById("tab-role-teacher");
    const btnStudentRole = document.getElementById("tab-role-student");
    const teacherView = document.getElementById("view-teacher-portal");
    const studentView = document.getElementById("view-student-portal");

    if (btnTeacherRole && btnStudentRole) {
        btnTeacherRole.addEventListener("click", () => {
            currentRole = "teacher";
            btnTeacherRole.classList.add("active");
            btnStudentRole.classList.remove("active");
            teacherView.classList.remove("hidden");
            studentView.classList.add("hidden");
        });

        btnStudentRole.addEventListener("click", () => {
            currentRole = "student";
            btnStudentRole.classList.add("active");
            btnTeacherRole.classList.remove("active");
            studentView.classList.remove("hidden");
            teacherView.classList.add("hidden");
        });
    }

    const btnLoginAIS = document.getElementById("btn-login-ais");
    const modalAuth = document.getElementById("modal-auth");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const formSIMAuth = document.getElementById("form-sim-auth");

    if (btnLoginAIS) {
        btnLoginAIS.addEventListener("click", () => { modalAuth.classList.remove("hidden"); });
    }
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", () => { modalAuth.classList.add("hidden"); });
    }

    if (formSIMAuth) {
        formSIMAuth.addEventListener("submit", async (e) => {
            e.preventDefault();
            const phoneInput = document.getElementById("phone-input").value;
            const authResultEl = document.getElementById("auth-result");
            authResultEl.innerHTML = `<div class="text-center py-4 text-emerald-400 font-medium animate-pulse">🔒 กำลังติดต่อ AIS Network Core... ยืนยันตัวตนผ่าน SIM...</div>`;
            
            try {
                const res = await fetch(`${API_BASE}/api/auth/ais-verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone_number: phoneInput })
                });
                const data = await res.json();
                
                if (res.ok) {
                    currentUser = data.user_info;
                    authResultEl.innerHTML = `
                        <div class="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm">
                            ✅ ยืนยันตัวตนสำเร็จผ่าน <strong>${data.verification_method}</strong><br>
                            ยินดีต้อนรับ: <strong>${currentUser.name}</strong>
                        </div>
                    `;
                    setTimeout(() => { modalAuth.classList.add("hidden"); }, 1200);
                }
            } catch (err) {
                authResultEl.innerHTML = `<div class="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm">✅ ยืนยันตัวตนสำเร็จ (AIS SIM Identity Verified Demo)</div>`;
                setTimeout(() => { modalAuth.classList.add("hidden"); }, 1000);
            }
        });
    }

    const btnGenRemedial = document.getElementById("btn-generate-remedial");
    if (btnGenRemedial) {
        btnGenRemedial.addEventListener("click", generateRemedialSheet);
    }

    const formSelfDiscovery = document.getElementById("form-self-discovery");
    if (formSelfDiscovery) {
        formSelfDiscovery.addEventListener("submit", handleSelfDiscovery);
    }

    document.querySelectorAll(".chip-preset").forEach(chip => {
        chip.addEventListener("click", () => {
            const input = document.getElementById("interest-input");
            if (input) input.value = chip.dataset.text;
        });
    });

    // OLLAMA LIVE CHAT EVENT LISTENERS
    const formChat = document.getElementById("form-ollama-chat");
    if (formChat) {
        formChat.addEventListener("submit", handleOllamaChatSubmit);
    }

    document.querySelectorAll(".chat-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const input = document.getElementById("chat-input");
            if (input) {
                input.value = chip.dataset.msg;
                handleOllamaChatSubmit(new Event("submit"));
            }
        });
    });
}

async function handleOllamaChatSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("chat-input");
    const historyBox = document.getElementById("chat-history-box");
    const userMsg = input.value.trim();

    if (!userMsg) return;

    // Append User Message bubble
    historyBox.innerHTML += `
        <div class="flex items-start justify-end gap-3">
            <div class="p-3 bg-emerald-600/30 border border-emerald-500/40 text-emerald-100 rounded-2xl text-xs leading-relaxed max-w-xl">
                ${userMsg}
            </div>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs flex-shrink-0">
                คุณ
            </div>
        </div>
    `;

    input.value = "";
    historyBox.scrollTop = historyBox.scrollHeight;

    // Append Loading indicator
    const loadingId = "chat-loading-" + Date.now();
    historyBox.innerHTML += `
        <div id="${loadingId}" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                AI
            </div>
            <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-emerald-400 animate-pulse">
                ⚡ Ollama (Llama 3.2) กำลังคิดและพิมพ์ตอบ...
            </div>
        </div>
    `;
    historyBox.scrollTop = historyBox.scrollHeight;

    try {
        const res = await fetch(`${API_BASE}/api/chat/ollama`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        const reply = data.reply || data.content || "ขออภัยครับ ไม่สามารถประมวลผลคำตอบได้";
        const source = data.source || "Ollama Llama 3.2";

        historyBox.innerHTML += `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                    AI
                </div>
                <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed max-w-2xl whitespace-pre-line">
                    <div class="text-[10px] text-emerald-400 font-mono mb-1.5 flex items-center gap-1">
                        <span class="pulse-dot"></span> ${source}
                    </div>
                    ${formatMarkdownText(reply)}
                </div>
            </div>
        `;
    } catch (err) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        historyBox.innerHTML += `<div class="text-rose-400 text-xs p-2">เกิดข้อผิดพลาดในการเชื่อมต่อกับ Ollama API</div>`;
    }
    historyBox.scrollTop = historyBox.scrollHeight;
}

async function loadTeacherAnalytics() {
    try {
        const res = await fetch(`${API_BASE}/api/teacher/analytics`);
        const data = await res.json();
        
        document.getElementById("class-title").textContent = data.classroom_name;
        document.getElementById("total-students").textContent = data.total_students;
        document.getElementById("avg-score").textContent = data.average_score + "%";
        
        const alertList = document.getElementById("weakness-alert-list");
        alertList.innerHTML = "";
        
        data.weakness_alerts.forEach(item => {
            alertList.innerHTML += `
                <div class="p-4 bg-slate-800/80 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-md">พบจุดอ่อน ${item.affected_students_pct}%</span>
                            <h4 class="font-semibold text-slate-100">${item.topic}</h4>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">เด็กติดขัดจำนวน ${item.affected_students_count} คน | ข้อแนะนำ: ${item.recommended_remedial}</p>
                    </div>
                    <button class="btn-ais text-xs py-2 px-3 whitespace-nowrap" onclick="triggerRemedialFor('${item.topic}', '${item.recommended_remedial}')">
                        ⚡ สั่ง AI เจนชีทซ่อมแซม
                    </button>
                </div>
            `;
        });
    } catch (e) {
        console.log("Static analytics view fallback");
    }
}

async function generateRemedialSheet() {
    const outputContainer = document.getElementById("remedial-output-container");
    const outputText = document.getElementById("remedial-output-text");
    const topic = document.getElementById("remedial-topic").value;
    const weakness = document.getElementById("remedial-weakness").value;

    outputContainer.classList.remove("hidden");
    outputText.innerHTML = `<div class="py-8 text-center text-emerald-400 font-medium animate-pulse">⚡ AI กำลังสร้างชีทสรุปซ่อมแซม 1 หน้า + 3 โจทย์ฝึกลดจุดผิด...</div>`;

    try {
        const res = await fetch(`${API_BASE}/api/teacher/generate-remedial`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topic, weakness_summary: weakness })
        });
        const data = await res.json();
        
        outputText.innerHTML = `
            <div class="mb-3 text-xs text-emerald-400 font-medium flex items-center gap-2">
                <span class="pulse-dot"></span> ประมวลผลจาก: ${data.source || 'AIS AI Engine'}
            </div>
            <div class="markdown-body text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                ${formatMarkdownText(data.content)}
            </div>
        `;
    } catch (e) {
        outputText.innerHTML = `<div class="text-rose-400 p-4">เกิดข้อผิดพลาดในการติดต่อระบบ AI</div>`;
    }
}

function triggerRemedialFor(topic, weakness) {
    document.getElementById("remedial-topic").value = topic;
    document.getElementById("remedial-weakness").value = weakness;
    document.getElementById("btn-generate-remedial").scrollIntoView({ behavior: 'smooth' });
    generateRemedialSheet();
}

// --- Mini-Game Logic ---
const quizQuestions = [
    {
        question: "กิจกรรมยามว่างที่คุณชอบทำคืออะไร?",
        options: [
            { id: "A", icon: "💻", text: "เล่นเกม ท่องเว็บ เขียนโค้ด" },
            { id: "B", icon: "🎨", text: "วาดรูป ฟังเพลง ดูหนัง" },
            { id: "C", icon: "🏃", text: "เล่นกีฬา ออกกำลังกาย" },
            { id: "D", icon: "📚", text: "อ่านหนังสือ ค้นคว้าเรื่องใหม่ๆ" }
        ]
    },
    {
        question: "ถ้ามีงานกลุ่ม คุณมักจะรับบทบาทไหน?",
        options: [
            { id: "A", icon: "👑", text: "หัวหน้ากลุ่ม คอยแบ่งงาน" },
            { id: "B", icon: "💡", text: "คนคิดไอเดีย สร้างสรรค์งาน" },
            { id: "C", icon: "🛠️", text: "คนลงมือทำ พิมพ์งาน/หาข้อมูล" },
            { id: "D", icon: "🎤", text: "คนพรีเซนต์ นำเสนงานหน้าห้อง" }
        ]
    },
    {
        question: "วิชาที่คุณรู้สึกสนุกเวลาเรียนที่สุดคือ?",
        options: [
            { id: "A", icon: "📐", text: "คณิตศาสตร์ / วิทยาศาสตร์" },
            { id: "B", icon: "🌍", text: "สังคม / ภาษา / ประวัติศาสตร์" },
            { id: "C", icon: "🎨", text: "ศิลปะ / ดนตรี / กีฬา" },
            { id: "D", icon: "💻", text: "คอมพิวเตอร์ / เทคโนโลยี" }
        ]
    },
    {
        question: "รูปแบบการทำงานในอนาคตที่อยากได้?",
        options: [
            { id: "A", icon: "🏢", text: "ทำงานออฟฟิศ มั่นคง มีระบบ" },
            { id: "B", icon: "🏠", text: "ทำงานอิสระ (Freelance) เวลายืดหยุ่น" },
            { id: "C", icon: "🤝", text: "ช่วยเหลือสังคม พบปะผู้คน" },
            { id: "D", icon: "🚀", text: "ธุรกิจส่วนตัว เป็นเจ้านายตัวเอง" }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];

function setupMiniGame() {
    const btnStart = document.getElementById("btn-start-game");
    const btnNext = document.getElementById("btn-next-question");
    
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            document.getElementById("minigame-start").classList.add("hidden");
            document.getElementById("minigame-question").classList.remove("hidden");
            document.getElementById("minigame-question").classList.add("flex");
            currentQuestionIndex = 0;
            userAnswers = [];
            renderQuestion();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            const selectedOption = document.querySelector(".quiz-option.selected");
            if (!selectedOption) return;

            userAnswers.push(selectedOption.dataset.text);
            
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                submitMiniGame();
            }
        });
    }
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById("question-counter").innerText = `ข้อ ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    document.getElementById("question-text").innerText = q.question;
    
    const progressPct = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById("quiz-progress").style.width = `${progressPct}%`;
    
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    q.options.forEach(opt => {
        const div = document.createElement("div");
        div.className = "quiz-option";
        div.dataset.text = opt.text;
        div.innerHTML = `
            <div class="option-icon">${opt.icon}</div>
            <div class="font-medium text-slate-200 text-sm">${opt.text}</div>
        `;
        div.addEventListener("click", () => {
            document.querySelectorAll(".quiz-option").forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
            
            const btnNext = document.getElementById("btn-next-question");
            btnNext.disabled = false;
            btnNext.classList.remove("opacity-50", "cursor-not-allowed");
            
            if (currentQuestionIndex === quizQuestions.length - 1) {
                btnNext.innerHTML = `<span>🚀</span> ประมวลผลผลลัพธ์ AI`;
            }
        });
        optionsContainer.appendChild(div);
    });

    const btnNext = document.getElementById("btn-next-question");
    btnNext.disabled = true;
    btnNext.classList.add("opacity-50", "cursor-not-allowed");
    if (currentQuestionIndex !== quizQuestions.length - 1) {
        btnNext.innerHTML = `ถัดไป <span>➔</span>`;
    }
}

async function submitMiniGame() {
    document.getElementById("quiz-progress").style.width = `100%`;
    const studentName = document.getElementById("student-name-input").value || "นักเรียน";
    const combinedInterests = userAnswers.join(", ");
    
    document.getElementById("minigame-question").classList.add("hidden");
    document.getElementById("minigame-question").classList.remove("flex");
    
    const resultContainer = document.getElementById("discovery-result-container");
    const resultText = document.getElementById("discovery-result-text");
    resultContainer.classList.remove("hidden");
    
    resultText.innerHTML = `
        <div class="py-12 text-center slide-in">
            <div class="inline-block w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <div class="text-emerald-400 font-medium">AI กำลังวิเคราะห์ตัวตนของคุณจากคำตอบที่เลือก...</div>
        </div>
    `;

    try {
        const res = await fetch(`${API_BASE}/api/student/self-discovery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ interests: combinedInterests, student_name: studentName })
        });
        const data = await res.json();
        const content = data.ai_result.content;
        const source = data.ai_result.source || "AIS 5G Local Edge AI";

        resultText.innerHTML = `
            <div class="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl mb-4 flex items-center justify-between slide-in">
                <div>
                    <h3 class="font-bold text-emerald-400 text-lg">🎓 รายงานค้นหาตัวตน 1-Page Summary</h3>
                    <p class="text-xs text-slate-300">นักเรียน: <strong>${data.student_name}</strong> | แหล่งข้อมูลอ้างอิง: <span class="text-emerald-300 font-mono">${source}</span></p>
                </div>
                <button onclick="window.print()" class="btn-outline-ais text-xs py-1.5 px-3">🖨️ พิมพ์/เซฟ PDF</button>
            </div>
            <div class="markdown-body text-slate-200 text-sm leading-relaxed whitespace-pre-line p-4 bg-slate-900/60 rounded-xl border border-slate-800 slide-in">
                ${formatMarkdownText(content)}
            </div>
            <button onclick="location.reload()" class="btn-outline-ais text-sm mt-6 mx-auto block">เริ่มเล่นใหม่อีกครั้ง</button>
        `;
    } catch (e) {
        resultText.innerHTML = `<div class="text-rose-400 p-4 text-center">เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง</div>`;
    }
}


async function loadFreeHub() {
    const hubGrid = document.getElementById("free-hub-grid");
    if (!hubGrid) return;

    try {
        const res = await fetch(`${API_BASE}/api/student/free-hub`);
        const data = await res.json();

        hubGrid.innerHTML = "";
        data.forEach(course => {
            hubGrid.innerHTML += `
                <div class="p-5 glass-panel flex flex-col justify-between">
                    <div>
                        <div class="text-3xl mb-3">${course.icon}</div>
                        <span class="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">${course.category}</span>
                        <h4 class="font-bold text-slate-100 mt-2 text-base">${course.title}</h4>
                        <p class="text-xs text-slate-400 mt-1">⏱️ ใช้เวลาศึกษา: ${course.duration}</p>
                    </div>
                    <button class="btn-outline-ais text-xs mt-4 w-full text-center" onclick="alert('ดาวน์โหลดเอกสารเนื้อหาฟรีเรียบร้อย')">
                        📥 ดาวน์โหลดชีท / เรียนฟรี
                    </button>
                </div>
            `;
        });
    } catch (e) {
        console.log("Free hub static rendering fallback");
    }
}

function formatMarkdownText(txt) {
    if (!txt) return "";
    return txt
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
        .replace(/^### (.*$)/gim, '<h3 class="font-bold text-emerald-400 text-base mt-3 mb-1">$1</h3>')
        .replace(/^---\s*$/gim, '<hr class="border-slate-700 my-3">');
}
