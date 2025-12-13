// routes/transactionRoute.js
import express from "express";
import {
  createDeposit,
  requestWithdrawal,
  processWithdrawal,
  listUserTransactions,
  adminListTransactions,
  getTransactionById,
  createCryptoDeposit,
} from "../controllers/transactionController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute); // all transaction routes require auth

// User routes
router.post("/withdraw/request", requestWithdrawal);
router.get("/me", listUserTransactions);

// Create crypto deposit (user)
router.post("/create-crypto-deposit", createCryptoDeposit);

// Admin routes (specific) - must come before the param route
router.post("/deposit", isAdmin("admin"), createDeposit);
router.post("/withdraw/process", isAdmin("admin"), processWithdrawal);
router.get("/list-transactions", isAdmin("admin"), adminListTransactions);

// Finally: param route for a single transaction (most generic)
router.get("/:id", getTransactionById);

export default router;
