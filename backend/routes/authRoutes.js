import express from "express";
import { register, login, getProfile, verifyEmail } from "../controllers/authController.js"; // ✅ added verifyEmail
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

// 🧩 Email verification route (user clicks link)
router.get("/verify/:token", verifyEmail); // ✅ new route

export default router;
