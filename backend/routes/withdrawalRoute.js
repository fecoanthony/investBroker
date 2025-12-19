import express from "express";
import {
  requestWithdrawal,
  processWithdrawal,
} from "../controllers/withdrawalController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/request-withdrawal", protectroute, requestWithdrawal);
router.post(
  "/admin/:id/process",
  protectroute,
  isAdmin("admin", "super_admin"),
  processWithdrawal
);

export default router;
