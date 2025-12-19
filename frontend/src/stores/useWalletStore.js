// stores/useWalletStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useWalletStore = create((set) => ({
  wallets: [],
  loading: false,
  error: null,

  fetchWallet: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get("/get-wallet");
      set({
        wallets: res.data.data,
        loading: false,
      });

      return res.data.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load wallet";

      toast.error(msg);
      set({ loading: false, error: msg });
      throw err;
    }
  },
}));
