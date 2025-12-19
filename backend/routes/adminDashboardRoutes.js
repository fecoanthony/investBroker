import express from "express";
import { getAdminDashboardSummary } from "../controllers/adminDashboardController.js";
import { protectroute, isAdmin } from "../middleware/protectRoute.js";

const router = express.Router();

router.get(
  "/dashboard/summary",
  protectroute,
  isAdmin("super_admin"),
  getAdminDashboardSummary
);

export default router;
