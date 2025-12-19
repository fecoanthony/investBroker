import express from "express";
import {
  getAllTransactions,
  approveWithdrawal,
} from "../controllers/adminTransactionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllTransactions);
router.post("/approve-withdrawal/:id", protect, adminOnly, approveWithdrawal);

export default router;
