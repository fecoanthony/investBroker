import express from "express";
import {
  listUsers,
  getUserDetails,
  updateUserRole,
  updateUserStatus,
} from "../../controllers/admin/adminUserController.js";
import { protectroute } from "../../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectroute);

// Admin only
router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/status", updateUserStatus);

// Super admin only
router.patch("/users/:id/role", updateUserRole);

export default router;
