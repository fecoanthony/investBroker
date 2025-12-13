// controllers/walletController.js
import mongoose from "mongoose";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

/**
 * getWallet - returns the authenticated user's wallet(s)
 * Query: currency optional
 */
export const getWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const currency = req.query.currency || undefined;
    const filter = { userId };
    if (currency) filter.currency = currency;
    const wallets = await Wallet.find(filter).lean();
    return res.json({ success: true, data: wallets });
  } catch (err) {
    console.error("getWallet error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * adminCreditWallet - ADMIN only
 * Body: { userId, amountCents, currency, reason }
 */
export const adminCreditWallet = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      userId,
      amountCents,
      currency = "USD",
      reason = "manual credit",
    } = req.body;
    if (!userId || !amountCents)
      return res.status(400).json({ message: "Invalid payload" });

    await session.withTransaction(async () => {
      // credit wallet
      await Wallet.findOneAndUpdate(
        { userId, currency },
        { $inc: { mainBalanceCents: amountCents } },
        { upsert: true, new: true, session }
      );

      // record transaction
      await Transaction.create(
        [
          {
            userId,
            type: "adjustment",
            amountCents,
            currency,
            status: "completed",
            meta: { reason },
          },
        ],
        { session }
      );
    });

    session.endSession();
    return res.json({ success: true, message: "Wallet credited" });
  } catch (err) {
    console.error("adminCreditWallet error:", err);
    session.endSession();
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
