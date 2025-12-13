// routes/walletRoute.js
import express from "express";
import {
  getWallet,
  adminCreditWallet,
} from "../controllers/walletController.js";
import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();
router.use(protectroute);

router.get("/get-wallet", getWallet);
router.post("/admin/credit-wallet", isAdmin("admin"), adminCreditWallet);

export default router;
