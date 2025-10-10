import express from "express";
import { getAISuggestions, generateProResume, downloadResume, listUserResumes } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ai-suggest", protect, getAISuggestions);
router.post("/generate-pro", protect, generateProResume);
router.get("/download/:resumeId", protect, downloadResume);
router.get("/list", protect, listUserResumes);

export default router;
