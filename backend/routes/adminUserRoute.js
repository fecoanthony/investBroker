import express from "express";
import {
  adminListUsers,
  updateUserRole,
  toggleUserSuspension,
  updateKycStatus,
} from "../controllers/adminUserController.js";

import { protectroute, isAdmin } from "../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);

// Admin & Super Admin
router.get("/users", isAdmin("admin", "super_admin"), adminListUsers);
router.patch(
  "/users/:userId/suspend",
  isAdmin("admin", "super_admin"),
  toggleUserSuspension
);
router.patch("/users/kyc", isAdmin("admin", "super_admin"), updateKycStatus);

// Super Admin only
router.patch("/users/role", isAdmin("super_admin"), updateUserRole);

export default router;
