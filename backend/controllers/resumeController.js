// backend/controllers/resumeController.js
import Resume from "../models/Resume.js";
import { generateResumePDF, generateResumeDocx } from "../utils/pdfGenerator.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

let openai = null;

// 🧩 Initialize OpenAI only if API key is provided
(async () => {
  try {
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = (await import("openai")).default;
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log("✅ OpenAI enabled");
    } else {
      console.warn("⚠️ Running without OpenAI API key — using mock AI responses.");
    }
  } catch (err) {
    console.error("OpenAI initialization failed:", err);
  }
})();

// 🧩 1. Suggest resume improvements (AI or mock)
export const getAISuggestions = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText)
      return res.status(400).json({ message: "Resume text required" });

    let improvedText = "";

    if (openai) {
      // Real OpenAI call
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert resume reviewer and career advisor." },
          { role: "user", content: `Please analyze and improve this resume:\n\n${resumeText}` }
        ],
        max_tokens: 800
      });
      improvedText = aiResponse.choices[0].message.content.trim();
    } else {
      // Mock AI Response (offline)
      improvedText = `
🧠 Mock AI Suggestions:
- Make your professional summary more concise and impactful.
- Add quantifiable achievements (e.g., "Increased sales by 20%").
- Use consistent formatting for all section headers.
- Highlight relevant skills aligned to your target job.
`;
    }

    const resume = await Resume.create({
      user: req.user?._id || null,
      originalText: resumeText,
      improvedText,
    });

    res.json({ improvedText, resumeId: resume._id });
  } catch (err) {
    console.error("AI Suggest Error:", err);
    res.status(500).json({ message: "Failed to generate AI suggestions" });
  }
};

// 🧩 2. Generate downloadable resume (mock templates supported)
export const generateProResume = async (req, res) => {
  try {
    const { resumeId, template } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    // Ensure temp folder exists
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

    const fileName = `resume_${resumeId}_${Date.now()}`;
    const pdfPath = path.join("./temp", `${fileName}.pdf`);
    const docxPath = path.join("./temp", `${fileName}.docx`);

    await generateResumePDF(resume.improvedText, pdfPath, template);
    await generateResumeDocx(resume.improvedText, docxPath, template);

    res.json({
      message: "Resume generated successfully",
      downloadLinks: {
        pdf: `/api/resume/download/${resume._id}?type=pdf`,
        docx: `/api/resume/download/${resume._id}?type=docx`,
      }
    });
  } catch (err) {
    console.error("Generate Resume Error:", err);
    res.status(500).json({ message: "Error generating pro resume" });
  }
};

// 🧩 3. List all user resumes
export const listUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user?._id || null }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error("List Resume Error:", err);
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

// 🧩 4. Download resume as file
export const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { type } = req.query;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const fileName = `resume_${resumeId}.${type}`;
    const filePath = path.join("./temp", fileName);

    if (!fs.existsSync(filePath)) {
      if (type === "pdf") await generateResumePDF(resume.improvedText, filePath);
      else await generateResumeDocx(resume.improvedText, filePath);
    }

    res.download(filePath);
  } catch (err) {
    console.error("Download Resume Error:", err);
    res.status(500).json({ message: "Error downloading resume" });
  }
};
