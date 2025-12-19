import User from "../models/User.js";

/**
 * GET ALL USERS (ADMIN)
 */
export const adminListUsers = async (req, res) => {
  try {
    const { role, kycStatus, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (kycStatus) filter.kycStatus = kycStatus;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);

    return res.json({
      success: true,
      data: { users, page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE USER ROLE (SUPER ADMIN ONLY)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "admin", "super_admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await User.findByIdAndUpdate(userId, { role });

    return res.json({ success: true, message: "Role updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * SUSPEND / UNSUSPEND USER
 */
export const toggleUserSuspension = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    return res.json({
      success: true,
      message: user.isSuspended ? "User suspended" : "User unsuspended",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * KYC APPROVAL / REJECTION
 */
export const updateKycStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    await User.findByIdAndUpdate(userId, { kycStatus: status });

    return res.json({ success: true, message: `KYC ${status}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
