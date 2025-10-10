// backend/controllers/paymentController.js
import dotenv from "dotenv";
import Resume from "../models/Resume.js";

dotenv.config();

let stripe = null;

// 🧾 Initialize Stripe only if key exists
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = (await import("stripe")).default;
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("✅ Stripe enabled");
} else {
  console.warn("⚠️ Running without Stripe — payment features disabled.");
}

// 🧾 1. Create Checkout Session (mocked if Stripe disabled)
export const createCheckoutSession = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    // Mock mode (no Stripe key)
    if (!stripe) {
      console.log("⚙️ Mock payment for resume:", resumeId);
      await Resume.findByIdAndUpdate(resumeId, { pricePaid: 0 });
      return res.json({
        message: "⚙️ Stripe disabled — mock payment successful.",
        mockUrl: `${process.env.CLIENT_URL}/payment-success?resumeId=${resumeId}`,
      });
    }

    // Real mode (Stripe active)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "AI Improved Resume" },
            unit_amount: 499, // $4.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?resumeId=${resumeId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      metadata: { resumeId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// 🧾 2. Stripe Webhook (mocked if disabled)
export const stripeWebhook = async (req, res) => {
  try {
    if (!stripe) {
      console.log("⚙️ Mock Stripe webhook triggered — skipping verification.");
      return res.json({ received: true, mode: "mock" });
    }

    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const resumeId = session.metadata.resumeId;
      await Resume.findByIdAndUpdate(resumeId, { pricePaid: 4.99 });
      console.log("✅ Payment completed for resume:", resumeId);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe Webhook Error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
