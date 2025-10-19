import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ---------- REGISTER ----------
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      email,
      password,
      isVerified: false,
      verificationToken,
    });

    // send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    res.json({ token: generateToken(user._id), email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- VERIFY EMAIL ----------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- PROFILE ----------
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({ email: user.email, id: user._id });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- HELPER: Send Email ----------
async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS, // your Gmail App Password
    },
  });

  const verifyURL = `${process.env.FRONTEND_URL || "http://localhost:5500"}/verify.html?token=${token}`;

  const mailOptions = {
    from: `"ATS Resume AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - ATS Resume AI",
    html: `
      <h2>Welcome to ATS Resume AI</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyURL}" target="_blank"
         style="background:#667eea;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
         Verify Email
      </a>
      <p>This link will expire soon.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
