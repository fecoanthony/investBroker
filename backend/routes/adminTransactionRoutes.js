import express from "express";
import {
  getAllTransactions,
  approveWithdrawal,
} from "../controllers/adminTransactionController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get(
  "/",
  protectroute,
  isAdmin("admin", "super_admin"),
  getAllTransactions
);
router.post(
  "/approve-withdrawal/:id",
  protectroute,
  isAdmin,
  approveWithdrawal
);

export default router;
