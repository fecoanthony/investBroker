import axios from "@/lib/axios";

export const getPlans = () => axios.get("/admin/plans");

export const createPlan = (data) => axios.post("/admin/plans", data);

export const updatePlan = (id, data) => axios.put(`/admin/plans/${id}`, data);

export const togglePlanStatus = (id) =>
  axios.patch(`/admin/plans/${id}/toggle`);
