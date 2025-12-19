import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,

  fetchAdminTransactions: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await axios.get("/transaction/list-transactions", {
        params,
      });
      set({ transactions: res.data.data.txs, loading: false });
    } catch (err) {
      set({ loading: false });
      toast.error("Failed to load transactions");
    }
  },

  processWithdrawal: async (transactionId, action) => {
    try {
      await axios.post("/transaction/withdraw/process", {
        transactionId,
        action,
      });
      toast.success(`Withdrawal ${action}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  },

  approveCryptoDeposit: async (txId) => {
    try {
      await axios.post("/transaction/deposit", {
        transactionId: txId,
      });
      toast.success("Deposit approved");
    } catch (err) {
      toast.error("Failed to approve deposit");
    }
  },
}));
