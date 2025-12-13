// src/lib/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const axiosInstance = axios.create({
  baseURL: API_BASE + "/api", // results in http://localhost:5000/api in dev
  withCredentials: true, // allow cookies to be sent
});

export default axiosInstance;
