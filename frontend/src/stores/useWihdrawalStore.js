import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useWithdrawalStore = create((set) => ({
  loading: false,

  requestWithdrawal: async ({ amountCents, destination }) => {
    try {
      set({ loading: true });
      await axios.post("/request-withdrawal", {
        amountCents,
        destination,
      });
      toast.success("Withdrawal requested");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Withdrawal failed");
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
