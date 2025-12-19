import mongoose from "mongoose";
import Withdrawal from "../models/Withdrawal.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

/**
 * USER: Request withdrawal
 */
export const requestWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const { amountCents, destination } = req.body;

    if (!amountCents || amountCents <= 0 || !destination)
      return res.status(400).json({ message: "Invalid withdrawal request" });

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ userId, currency: "USD" }).session(
        session
      );
      if (!wallet || wallet.mainBalanceCents < amountCents)
        throw new Error("Insufficient balance");

      // move funds to reserved
      wallet.mainBalanceCents -= amountCents;
      wallet.reservedCents += amountCents;
      await wallet.save({ session });

      // create withdrawal record
      await Withdrawal.create(
        [
          {
            userId,
            amountCents,
            destination,
          },
        ],
        { session }
      );

      // transaction log
      await Transaction.create(
        [
          {
            userId,
            type: "withdraw",
            amountCents: -amountCents,
            currency: "USD",
            status: "pending",
            meta: { destination },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res.json({ success: true, message: "Withdrawal requested" });
  } catch (err) {
    session.endSession();
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ADMIN: Approve or reject withdrawal
 */
export const processWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // approve | reject

    await session.withTransaction(async () => {
      const wd = await Withdrawal.findById(id).session(session);
      if (!wd || wd.status !== "pending") throw new Error("Invalid withdrawal");

      const wallet = await Wallet.findOne({
        userId: wd.userId,
        currency: wd.currency,
      }).session(session);

      if (!wallet) throw new Error("Wallet not found");

      if (action === "approve") {
        wallet.reservedCents -= wd.amountCents;
        wd.status = "approved";
      } else {
        wallet.reservedCents -= wd.amountCents;
        wallet.mainBalanceCents += wd.amountCents;
        wd.status = "rejected";
        wd.reason = reason || "Rejected by admin";
      }

      await wallet.save({ session });
      await wd.save({ session });

      await Transaction.create(
        [
          {
            userId: wd.userId,
            type: "withdraw",
            amountCents: action === "approve" ? 0 : wd.amountCents,
            currency: wd.currency,
            status: wd.status,
            meta: { withdrawalId: wd._id },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res.json({ success: true, message: "Withdrawal processed" });
  } catch (err) {
    session.endSession();
    return res.status(400).json({ success: false, message: err.message });
  }
};
