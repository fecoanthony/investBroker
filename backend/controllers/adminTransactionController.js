import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import mongoose from "mongoose";

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate("userId", "email")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: transactions });
};

export const approveWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const tx = await Transaction.findById(req.params.id).session(session);

      if (!tx || tx.type !== "withdraw" || tx.status !== "pending") {
        throw new Error("Invalid transaction");
      }

      const wallet = await Wallet.findOne({ userId: tx.userId }).session(
        session
      );

      wallet.reservedCents -= Math.abs(tx.amountCents);
      await wallet.save({ session });

      tx.status = "completed";
      await tx.save({ session });
    });

    session.endSession();
    res.json({ success: true, message: "Withdrawal approved" });
  } catch (err) {
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};
