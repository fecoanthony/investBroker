export const listReferralsForUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;

    const refs = await Referral.find({ referrerId: userId })
      .populate("refereeId", "name email")
      .lean();

    return res.json({ success: true, data: refs });
  } catch (err) {
    console.error("listReferralsForUser error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
