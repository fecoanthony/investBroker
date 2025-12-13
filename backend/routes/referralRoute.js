// routes/referralRoute.js
import express from "express";
import { listReferralsForUser } from "../controllers/referralController.js";
import { protectroute } from "../middlewares/protectRoute.js";

const router = express.Router();
router.use(protectroute);

router.get("referral/me", listReferralsForUser);

export default router;
