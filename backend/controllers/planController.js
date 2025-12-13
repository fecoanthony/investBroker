// controllers/planController.js
import Plan from "../models/Plan.js";

/**
 * createPlan - ADMIN only
 * Body: { name, slug, description, rate, rateUnit, payoutFrequencySeconds, periodCount, minAmountCents, maxAmountCents, capitalBack, autoRenew }
 */
export const createPlan = async (req, res) => {
  try {
    const payload = req.body;
    const plan = await Plan.create(payload);
    return res.status(201).json({ success: true, data: plan });
  } catch (err) {
    console.error("createPlan error:", err);
    return res
      .status(400)
      .json({
        success: false,
        message: err.message || "Failed to create plan",
      });
  }
};

export const listPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: plans });
  } catch (err) {
    console.error("listPlans error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error("getPlan error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error("updatePlan error:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message || "Update failed" });
  }
};
