import Investment from "../models/Investment.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Plan from "../models/Plan.js";

export const processInvestmentPayouts = async () => {
  const now = new Date();

  const investments = await Investment.find({
    state: "active",
    nextPayoutAt: { $lte: now },
  });

  for (const inv of investments) {
    const plan = await Plan.findById(inv.planId);
    if (!plan) continue;

    const session = await Investment.startSession();
    try {
      await session.withTransaction(async () => {
        const wallet = await Wallet.findOne({
          userId: inv.userId,
          currency: "USD",
        }).session(session);

        if (!wallet) throw new Error("Wallet not found");

        // Calculate payout
        const payoutCents = Math.round((inv.amountCents * plan.rate) / 100);

        // Credit interest balance
        wallet.interestBalanceCents += payoutCents;
        await wallet.save({ session });

        // Record transaction
        await Transaction.create(
          [
            {
              userId: inv.userId,
              type: "interest",
              amountCents: payoutCents,
              currency: "USD",
              status: "completed",
              meta: { investmentId: inv._id },
            },
          ],
          { session }
        );

        // Update investment
        inv.paymentsCompleted += 1;
        inv.nextPayoutAt = new Date(
          inv.nextPayoutAt.getTime() + plan.payoutFrequencySeconds * 1000
        );

        // Check completion
        if (inv.paymentsCompleted >= plan.periodCount) {
          inv.state = "completed";

          // Return capital if applicable
          if (plan.capitalBack) {
            wallet.reservedCents -= inv.amountCents;
            wallet.mainBalanceCents += inv.amountCents;
            await wallet.save({ session });

            await Transaction.create(
              [
                {
                  userId: inv.userId,
                  type: "adjustment",
                  amountCents: inv.amountCents,
                  currency: "USD",
                  status: "completed",
                  meta: { reason: "capital_return", investmentId: inv._id },
                },
              ],
              { session }
            );
          }
        }

        await inv.save({ session });
      });
    } catch (err) {
      console.error("Payout error:", err);
    } finally {
      session.endSession();
    }
  }
};
