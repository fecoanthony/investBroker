import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import Investment from "../../models/Investment.js";

/**
 * GET /admin/users
 * List all users (admin only)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /admin/users/:id
 * View single user with summary (read-only)
 */
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await Wallet.findOne({ userId, currency: "USD" }).lean();
    const investments = await Investment.find({ userId }).lean();

    return res.json({
      success: true,
      data: {
        user,
        wallet,
        investmentCount: investments.length,
      },
    });
  } catch (err) {
    console.error("getUserDetails error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PATCH /admin/users/:id/role
 * Only superAdmin can change roles
 */
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { role } = req.body;
    const allowedRoles = ["user", "admin", "superAdmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("updateUserRole error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PATCH /admin/users/:id/status
 * Enable / disable user
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("updateUserStatus error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
