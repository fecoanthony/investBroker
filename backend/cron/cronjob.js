import cron from "node-cron";
import { processInvestmentPayouts } from "../jobs/processInvestmentPayouts.js";

// Runs every minute (safe for development)
cron.schedule("* * * * *", async () => {
  try {
    await processInvestmentPayouts();
    console.log("Investment payout job executed");
  } catch (err) {
    console.error("Investment payout cron error:", err);
  }
});
