// src/stores/useUserStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  // Initialize: call on app mount to hydrate user from cookie
  getCurrentUser: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/me");
      // backend returns { user: {...} } or similar — adjust as needed
      set({ user: res.data.user || res.data, checkingAuth: false });
    } catch (err) {
      set({ user: null, checkingAuth: false });
    }
  },

  register: async ({
    name,
    email,
    password,
    confirmPassword,
    referralCode,
  }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
        referralCode: referralCode || undefined,
      });

      // backend returns { message, user }
      const user = res.data.user ?? res.data;
      set({ user, loading: false });
      toast.success("Registered Successfully");
      return user;
    } catch (error) {
      set({ loading: false });
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during registration";
      toast.error(msg);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      const user = res.data.user ?? res.data;
      set({ user, loading: false });
      toast.success("Logged In Successfully");
      return user;
    } catch (error) {
      set({ loading: false });
      const msg =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(msg);
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false });
      toast.success("Logged out");
    } catch (error) {
      set({ loading: false });
      const msg =
        error?.response?.data?.message || error?.message || "Logout failed";
      toast.error(msg);
    }
  },
}));
