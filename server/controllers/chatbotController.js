// =============================================
// server/controllers/chatbotController.js
// =============================================
// Uses Node built-in https — no extra packages

const https   = require("https");
const Faculty = require("../models/Faculty");

// ── Raw HTTPS POST to any endpoint ──────────
const httpsPost = (url, body, extraHeaders = {}) =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        ...extraHeaders,
      },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, data: raw });
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.write(data);
    req.end();
  });

// ── Call Groq API ────────────────────────────
const callGroq = async (apiKey, prompt) => {
  const body = {
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
  };

  const { status, data } = await httpsPost(
    "https://api.groq.com/openai/v1/chat/completions",
    body,
    { Authorization: `Bearer ${apiKey}` }
  );

  if (status === 200) {
    const text = data?.choices?.[0]?.message?.content;
    if (text) return { text };
  }

  const errMsg = data?.error?.message || JSON.stringify(data).substring(0, 200);
  throw new Error(`[${status}] ${errMsg}`);
};

// ── GET /api/chatbot/test ────────────────────
const test = async (req, res) => {
  const results = {};

  results.apiKey = process.env.GROQ_API_KEY
    ? `Found ✅ (starts with: ${process.env.GROQ_API_KEY.slice(0, 10)}...)`
    : "MISSING ❌ — add GROQ_API_KEY to server/.env";

  try {
    const count = await Faculty.countDocuments();
    const names = await Faculty.find().select("name").limit(5);
    results.database = `Connected ✅ — ${count} faculty: ${names.map((f) => f.name).join(", ")}`;
  } catch (err) {
    results.database = `Failed ❌ — ${err.message}`;
  }

  try {
    const { text } = await callGroq(
      process.env.GROQ_API_KEY,
      "Say hello in one word"
    );
    results.groq = `Working ✅ model: llama-3.1-8b-instant | reply: ${text.trim().substring(0, 60)}`;
  } catch (err) {
    results.groq = `Failed ❌ — ${err.message}`;
  }

  return res.json({ message: "ChitkaraBot Diagnostic", results });
};

// ── POST /api/chatbot/chat ───────────────────
const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        type: "general",
        message: "⚠️ GROQ_API_KEY missing from server .env file.",
      });
    }

    const allFaculty = await Faculty.find({ isAvailable: true }).select(
      "name department designation expertise bio officeAddress visitingHours email _id"
    );

    const facultyContext =
      allFaculty.length > 0
        ? allFaculty
            .map(
              (f) =>
                `ID: ${f._id} | Name: ${f.name} | Dept: ${f.department} | ` +
                `Role: ${f.designation} | Expertise: ${(f.expertise || []).join(", ") || "General"} | ` +
                `Visiting Hours: ${f.visitingHours || "N/A"} | Email: ${f.email}`
            )
            .join("\n")
        : "No faculty available.";

    const prompt = `
You are ChitkaraBot, an AI assistant for ChitkaraConnect — a faculty-student portal at Chitkara University.

AVAILABLE FACULTY:
${facultyContext}

INSTRUCTIONS:
- Recommend the right faculty for the student's problem
- For portal questions, explain features (meetings, messages, directory, campus map)
- Be friendly, concise (2-3 sentences)
- Use ONLY faculty IDs exactly as listed
- Reply ONLY with valid JSON, no markdown, no backticks

Faculty recommendation format:
{"type":"faculty_recommendation","message":"your message","recommendedFaculty":[{"id":"EXACT_ID","name":"Name","reason":"why"}]}

General answer format:
{"type":"general","message":"your answer"}

Student's message: ${message}
`;

    const { text: rawText } = await callGroq(process.env.GROQ_API_KEY, prompt);

    let parsed;
    try {
      const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { type: "general", message: rawText };
    }

    if (
      parsed.type === "faculty_recommendation" &&
      Array.isArray(parsed.recommendedFaculty)
    ) {
      parsed.recommendedFaculty = parsed.recommendedFaculty.map((rec) => ({
        ...rec,
        faculty: allFaculty.find((f) => f._id.toString() === rec.id) || null,
      }));
    }

    return res.json(parsed);
  } catch (error) {
    console.error("CHATBOT ERROR:", error.message);
    return res.status(500).json({
      type: "general",
      message: `⚠️ ${error.message}`,
    });
  }
};

module.exports = { chat, test };