// routes/investmentRoute.js
import express from "express";
import {
  createInvestment,
  listUserInvestments,
  cancelInvestment,
} from "../controllers/investmentController.js";
import { protectroute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/create-investment", protectroute, createInvestment);
router.get("/list-investment", protectroute, listUserInvestments);
router.post("/cancel-investment/:id/cancel", protectroute, cancelInvestment);

export default router;
