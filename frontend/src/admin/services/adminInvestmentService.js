import axios from "@/lib/axios";

/**
 * GET all investments (admin)
 */
export const fetchAdminInvestments = async (params = {}) => {
  const res = await axios.get("/admin/investments", { params });
  return res.data.data;
};

/**
 * Pause or Resume investment
 */
export const toggleInvestment = async ({ investmentId, action }) => {
  const res = await axios.patch("/admin/investments/toggle", {
    investmentId,
    action,
  });
  return res.data;
};

/**
 * Force cancel investment (SUPER ADMIN)
 */
export const forceCancelInvestment = async (investmentId) => {
  const res = await axios.delete(
    `/admin/investments/${investmentId}/force-cancel`
  );
  return res.data;
};
