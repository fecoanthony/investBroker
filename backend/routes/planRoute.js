// routes/planRoute.js
import express from "express";
import {
  createPlan,
  listPlans,
  getPlan,
  updatePlan,
} from "../controllers/planController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/list-plan", listPlans);
router.get("/get-single-plan/:id", getPlan);

// admin
router.post(
  "/create-plan",
  protectroute,
  isAdmin("admin", "super_admin"),
  createPlan
);
router.put(
  "/update-plan/:id",
  protectroute,
  isAdmin("admin", "super_admin"),
  updatePlan
);

export default router;
