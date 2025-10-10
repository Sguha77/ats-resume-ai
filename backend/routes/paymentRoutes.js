import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/paymentController.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);

export default router;
