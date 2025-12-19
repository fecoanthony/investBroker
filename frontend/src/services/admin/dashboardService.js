import api from "../../utils/api";

export const fetchAdminDashboardSummary = async () => {
  const res = await api.get("/admin/dashboard/summary");
  return res.data.data;
};
