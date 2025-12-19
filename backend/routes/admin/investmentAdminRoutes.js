import express from "express";
import {
  adminListInvestments,
  toggleInvestmentState,
  forceCancelInvestment,
} from "../../controllers/admin/investmentAdminController.js";
import { protectroute, isAdmin } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);
router.use(isAdmin("admin", "super_admin"));

router.get("/investments", adminListInvestments);
router.patch("/investments/toggle", toggleInvestmentState);
router.delete("/investments/:investmentId/force-cancel", forceCancelInvestment);

export default router;
