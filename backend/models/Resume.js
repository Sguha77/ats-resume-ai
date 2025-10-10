import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalText: { type: String, required: true },
  improvedText: { type: String },
  template: { type: String, default: "template1" },
  pricePaid: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
