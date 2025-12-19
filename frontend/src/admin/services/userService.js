import api from "../../utils/api";

export const fetchAdminUsers = async (params = {}) => {
  const res = await api.get("/admin/users", { params });
  return res.data.data;
};

export const updateUserRole = async (userId, role) => {
  return api.patch(`/admin/users/${userId}/role`, { role });
};

export const toggleUserStatus = async (userId, active) => {
  return api.patch(`/admin/users/${userId}/status`, { active });
};
