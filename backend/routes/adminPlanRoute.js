import express from "express";
import {
  adminListPlans,
  adminCreatePlan,
  adminUpdatePlan,
  adminTogglePlan,
} from "../controllers/adminPlanController.js";

import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);

router.get("/plans", isAdmin("admin", "super_admin"), adminListPlans);
router.post("/plans", isAdmin("admin", "super_admin"), adminCreatePlan);
router.put("/plans/:id", isAdmin("admin", "super_admin"), adminUpdatePlan);

// Super admin only
router.patch("/plans/:id/toggle", isAdmin("super_admin"), adminTogglePlan);

export default router;
