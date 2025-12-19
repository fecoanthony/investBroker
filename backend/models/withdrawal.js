import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amountCents: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    destination: {
      type: String,
      required: true, // bank, crypto address, etc
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

WithdrawalSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Withdrawal", WithdrawalSchema);
