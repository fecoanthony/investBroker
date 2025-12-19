import { create } from "zustand";
import axios from "../lib/axios";

export const useUserDashboardStore = create((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchDashboardSummary: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("/user/dashboard-summary");

      set({
        summary: res.data.data,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error:
          err.response?.data?.message || "Failed to load dashboard summary",
      });
    }
  },

  clearDashboardSummary: () => {
    set({ summary: null, error: null });
  },
}));
