import express from "express";
import { isAdmin, protectroute } from "../middlewares/protectRoute.js";
import {
  approveCryptoDeposit,
  getPendingCryptoDeposits,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get(
  "/admin/crypto/pending",
  protectroute,
  isAdmin("admin", "super_admin"),
  getPendingCryptoDeposits
);

router.patch(
  "/admin/crypto/approve/:txId",
  protectroute,
  isAdmin("admin", "super_admin"),
  approveCryptoDeposit
);

export default router;
